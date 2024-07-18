const ScheduledClass = require('../models/scheduledClassesModel');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const mongoose = require("mongoose");
const moment = require("moment");

exports.getAllScheduledClasses = async (req, res) => {
  try {
    const scheduledClasses = await ScheduledClass.find()
      .populate("students tutor").exec();
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllStudentsScheduledClasses = async (req, res) => {
  try {
    const scheduledClasses = await ScheduledClass.find({ students: { $in: [req.params.id] } })
      .populate("students tutor").exec();
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
exports.getAllTutorsScheduledClasses = async (req, res) => {
  try {
    const scheduledClasses = await ScheduledClass.find({ tutor: req.params.id })
      .populate("students tutor").exec();
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllTutorFutureScheduledClasses = async (req, res) => {
  try {
    const scheduledClasses = await ScheduledClass.find({
      tutor: req.params.id,
      date: { $gte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllTutorPastScheduledClasses = async (req, res) => {
  try {
    const scheduledClasses = await ScheduledClass.find({
      tutor: req.params.id,
      date: { $lt: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllStudentFutureScheduledClasses = async (req, res) => {
  const studentId = req.params.id;
  try {
    const scheduledClasses = await ScheduledClass.find({
      // students: { $in: studentId },
      students: { $in: [mongoose.Types.ObjectId(studentId)] },
      date: { $gte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();

    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllStudentPastScheduledClasses = async (req, res) => {
  const studentId = req.params.id;
  try {
    const scheduledClasses = await ScheduledClass.find({
      students: { $in: [mongoose.Types.ObjectId(studentId)] },
      date: { $lt: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();
    console.log(scheduledClasses)
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(404).json({ errorMessage: 'No scheduled classes found!' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getReservedClass = async (req, res) => {
  const { date } = req.body;
  try {
    const scheduledClass = await ScheduledClass.find({
      tutor: req.params.id,
      date,
      $expr: { $gt: [{ $size: "$students" }, 0] }
    });

    res.status(200).send(scheduledClass);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
exports.getScheduledClassById = async (req, res) => {
  try {
    const findScheduledClass = await ScheduledClass.findOne({ _id: req.params.id }).populate("students tutor").exec();
    res.status(200).send(findScheduledClass);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.addScheduledClass = async (req, res) => {
  try {
    const scheduledClass = new ScheduledClass({
      tutor: req.body.tutor,
      date: req.body.date,
      time: req.body.time,
    });

    await scheduledClass.save(((error, result) => {
      if (error) {
        res.status(400).json({ errorMessage: 'Failed to scheduled class. Please try again', error })
      }
      if (result) {
        res.status(200).send({ successMessage: 'Class scheduled successfully', result });
      }
    }))
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}


exports.addStudentsInScheduledClass = async (req, res) => {
  const { tutor, date, time, student } = req.body;
  const findStudent = await User?.findOne({ _id: student });
  if (findStudent?.trialActivated && !findStudent?.trialUsed) {
    try {
      // Check if a scheduled class exists for the given date and time
      let scheduledClass = await ScheduledClass.findOne({
        tutor,
        date,
        time
      });

      if (scheduledClass) {
        // Add the student to the students array if not already present
        if (!scheduledClass?.students?.includes(student)) {
          scheduledClass?.students?.push(student);
        }

        // Save the updated or newly created scheduled class
        await scheduledClass.save();
        findStudent.trialUsed = true;
        await findStudent.save()
        res.status(200).json({ successMessage: 'You are added to scheduled class successfully' });
      } else {
        res.status(201).json({ errorMessage: 'No class is scheduled yet.' });
      }
    } catch (error) {
      console.error('Error adding student to scheduled class:', error);
      res.status(500).json({ errorMessage: 'Failed to add student to scheduled class. Please try again.', error });
    }
  }
  else {
    const checkIfStudentIsSubscribed = await Subscription.findOne({ user: req?.user?._id, status: "active" });
    if (checkIfStudentIsSubscribed) {
      try {
        // Check if a scheduled class exists for the given date and time
        let scheduledClass = await ScheduledClass.findOne({
          tutor,
          date,
          time
        });

        if (scheduledClass) {
          // Add the student to the students array if not already present
          if (!scheduledClass?.students?.includes(student)) {
            scheduledClass?.students?.push(student);
          }

          // Save the updated or newly created scheduled class
          await scheduledClass.save();

          res.status(200).json({ successMessage: 'You are added to scheduled class successfully' });
        } else {
          res.status(201).json({ errorMessage: 'No class is scheduled yet.' });
        }
      } catch (error) {
        console.error('Error adding student to scheduled class:', error);
        res.status(500).json({ errorMessage: 'Failed to add student to scheduled class. Please try again.', error });
      }
    } else {
      res.status(201).json({ errorMessage: 'You are not subscribed. Please buy any subscription plan and then try again.' });
    }
  }
};


exports.saveMeetingRecording = async (req, res) => {
  const { url } = req.body;
  try {
    const scheduledClass = await ScheduledClass.findById({ _id: req.params.id });
    if (scheduledClass) {
      scheduledClass.recording = url;
      await scheduledClass.save()
      res.status(200).json({ successMessage: 'Recording saved Successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.deleteScheduledClassByDelAvailability = async (req, res) => {
  const { date, time } = req.body;
  try {
    const scheduledClass = await ScheduledClass.findOne({ tutor: req.params.id, time, date });
    if (scheduledClass) {
      scheduledClass.remove();
      res.status(200).json({ successMessage: 'Availability and Scheduled Class Deleted Successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.cancelAndRescheduleClass = async (req, res) => {
  try {
    const result = await ScheduledClass.findByIdAndUpdate(
      { _id: req.params.id },
      { $pull: { students: req.user?._id } },
      { new: true } // Return the updated document
    );
    if (result) {
      res.status(200).json({ successMessage: 'Scheduled Class Cancelled Successfully. You can resechedule now' });
    } else {
      res.status(201).json({ errorMessage: 'Class cannot be cancelled. Please try again later' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.deleteRecording = async (req, res) => {
  try {
    const scheduledClass = await ScheduledClass.findById({ _id: req.params.id });
    if (scheduledClass) {
      scheduledClass.recording = null;
      await scheduledClass.save()
      res.status(200).json({ successMessage: 'Recording Deleted Successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.deleteScheduledClass = async (req, res) => {
  try {
    const scheduledClass = await ScheduledClass.findById({ _id: req.params.id });
    if (scheduledClass) {
      scheduledClass.remove();
      res.status(200).json({ successMessage: 'Scheduled Class Deleted Successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
