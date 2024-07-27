const ScheduledClass = require('../models/scheduledClassesModel');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const config = require('../config/keys');
const mongoose = require("mongoose");
const axios = require("axios");
const moment = require('moment-timezone');
const authController = require('../controllers/authController');
const StudentBookClassTemplate = require('../templates/student-book-class-template');
const sendEmail = require('../nodemailer');
const TutorBookClassTemplate = require('../templates/tutor-book-class-template');
const AdminStudentClassCancelTemplate = require('../templates/admin-student-class-cancel-template');
const AdminTutorClassCancelTemplate = require('../templates/admin-tutor-class-cancel-template');


exports.getAllScheduledClasses = async (req, res) => {
  try {
    const scheduledClasses = await ScheduledClass.find()
      .populate("students tutor").exec();
    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllPastScheduledClasses = async (req, res) => {
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      students: { $exists: true, $not: { $size: 0 } },
      date: { $lte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor")
      .exec();

    // Filter the classes to get only the past ones
    const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
      const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

      return endDateTime.isBefore(currentDateTime);
    });

    if (pastScheduledClasses.length > 0) {
      res.status(200).send(pastScheduledClasses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllFutureScheduledClasses = async (req, res) => {
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      students: { $exists: true, $not: { $size: 0 } },
      date: { $lte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor")
      .exec();

    // Filter the classes to get only the past ones
    const futureScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${startTime}`;
      const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

      return endDateTime.isAfter(currentDateTime);
    });

    if (futureScheduledClasses.length > 0) {
      res.status(200).send(futureScheduledClasses);
    } else {
      res.status(200).json([]);
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
      res.status(200).json([]);
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
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.createMeeting = async (req, res) => {
  const { startTime, email, timezone } = req.body;
  const zoomAccessToken = authController.getZoomAccessToken();
  console.log(zoomAccessToken, "zoomAccessToken");

  try {
    const response = await axios.post(
      `https://api.zoom.us/v2/users/${email}/meetings`,
      {
        topic: "SpellEng Class",
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: 20,
        timezone,
        settings: {
          "join_before_host": false,  // Participants can join only when the meeting starts
          "auto_recording": "cloud",  // Automatically record the meeting
          "mute_upon_entry": false
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${zoomAccessToken}`,
        },
      }
    );

    const meetingLink = response.data.join_url;

    // Save meeting link to your database (example with in-memory storage)
    // In real application, use your preferred database
    // For example, using MongoDB:
    // await Meeting.create({ topic, startTime, duration, meetingLink });

    res.json({ meetingLink });
  } catch (error) {
    console.log(error.response);
    // console.error('Error creating Zoom meeting', error.response ? error.response.data : error.message);
    res.status(201).json({ errorMessage: `${error?.response?.data?.message || error?.message}. Please click on authorize zoom button` });
  }
};

exports.getAllTutorFutureScheduledClasses = async (req, res) => {
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      tutor: req.params.id,
      students: { $exists: true, $not: { $size: 0 } },
      date: { $gte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();
    // Filter the classes to get only the past ones
    const futureScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${startTime}`;
      const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

      return endDateTime.isAfter(currentDateTime);
    });

    if (futureScheduledClasses.length > 0) {
      res.status(200).send(futureScheduledClasses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllTutorPastScheduledClasses = async (req, res) => {
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      tutor: req.params.id,
      students: { $exists: true, $not: { $size: 0 } },
      date: { $lte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor")
      .exec();

    // Filter the classes to get only the past ones
    const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
      const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

      return endDateTime.isBefore(currentDateTime);
    });

    if (pastScheduledClasses.length > 0) {
      res.status(200).send(pastScheduledClasses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllStudentCancelledScheduledClasses = async (req, res) => {
  const studentId = req.params.id;
  try {
    const scheduledClasses = await ScheduledClass.find({
      cancelledBy: { $in: [studentId] }
    })
      .populate("students tutor").exec();

    if (scheduledClasses) {
      res.status(200).send(scheduledClasses);
    } else {
      res.status(200).json([]);
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
      cancelledBy: { $nin: [mongoose.Types.ObjectId(studentId)] },
      students: { $in: [mongoose.Types.ObjectId(studentId)] },
      date: { $gte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();

    const currentDateTime = moment();
    const futureScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${startTime}`;
      const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

      return endDateTime.isAfter(currentDateTime);
    });

    if (futureScheduledClasses.length > 0) {
      res.status(200).send(futureScheduledClasses);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

exports.getAllStudentPastScheduledClasses = async (req, res) => {
  const studentId = req.params.id;
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      cancelledBy: { $nin: [mongoose.Types.ObjectId(studentId)] },
      students: { $in: [mongoose.Types.ObjectId(studentId)] },
      date: { $lte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();
    // Filter the classes to get only the past ones
    const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
      const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

      return endDateTime.isBefore(currentDateTime);
    });

    if (pastScheduledClasses.length > 0) {
      res.status(200).send(pastScheduledClasses);
    } else {
      res.status(200).json([]);
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
      meetingUrl: req.body.meetingUrl
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
  const findTutor = await User?.findOne({ _id: tutor });
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
        await findStudent.save();
        sendEmail(findStudent?.email, `Class Scheduled with ${findTutor?.fullName}`, StudentBookClassTemplate({ studentName: findStudent?.fullName, tutorName: findTutor?.fullName, date, time, url: `${config.FRONTEND_URL}/student/upcoming-classes` }));
        sendEmail(findTutor?.email, `Class Scheduled with ${findStudent?.fullName}`, TutorBookClassTemplate({ tutorName: findTutor?.fullName, studentName: findStudent?.fullName, date, time }));
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
        // Check if a scheduled classes exceed students plan
        const currentMonthStart = moment().startOf('month').toDate();
        const nextMonthStart = moment().startOf('month').add(1, 'month').toDate();

        // Fetch all scheduled classes first
        const allScheduledClasses = await ScheduledClass.find({
          students: { $in: [mongoose.Types.ObjectId(student)] },
          cancelledBy: { $nin: [mongoose.Types.ObjectId(student)] }
        }).populate("students tutor").exec();

        // Filter classes that fall within the current month
        const studentCurrentMonthClasses = allScheduledClasses.filter(scheduledClass => {
          const classDate = moment(scheduledClass.date, "DD/MM/YYYY").toDate();
          return classDate >= currentMonthStart && classDate < nextMonthStart;
        });
        if (parseInt(checkIfStudentIsSubscribed?.classesPerMonth) > studentCurrentMonthClasses?.length) {
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
            sendEmail(findStudent?.email, `Class Scheduled with ${findTutor?.fullName}`, StudentBookClassTemplate({ studentName: findStudent?.fullName, tutorName: findTutor?.fullName, date, time, url: `${config.FRONTEND_URL}/student/upcoming-classes` }));
            sendEmail(findTutor?.email, `Class Scheduled with ${findStudent?.fullName}`, TutorBookClassTemplate({ tutorName: findTutor?.fullName, studentName: findStudent?.fullName, date, time })); res.status(200).json({ successMessage: 'You are added to scheduled class successfully' });
          } else {
            res.status(201).json({ errorMessage: 'No class is scheduled yet.' });
          }
        } else {
          res.status(201).json({ errorMessage: `You have used all your sessions this month.` });
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

const addReviewToUserModel = async ({ rating, message, userId, classId, tutorId }) => {
  const user = await User.findById({ _id: tutorId, role: 1 });
  if (!user) {
    return res.status(404).json({ errorMessage: 'User not found' });
  }
  else {
    const review = {
      rating,
      message,
      userId,
      classId
    };
    if (user?.reviews?.length > 0) {
      user.reviews.push(review);
    } else {
      user.reviews = [review]
    }
    await user.save();
    return true;
  }
}

exports.addReview = async (req, res) => {
  try {
    const { rating, message, userId, classId, tutorId } = req.body;

    const findClass = await ScheduledClass.findById({ _id: classId });
    if (!findClass) {
      return res.status(404).json({ errorMessage: 'Class not found' });
    }
    else {
      let IfReviewAlreadyPresentForThatClass = findClass?.review.userId === userId;
      if (IfReviewAlreadyPresentForThatClass?.length > 0) {
        res.status(201).json({ errorMessage: "Your Review is already submitted" });
      } else {
        const review = {
          rating,
          message,
          userId
        };
        findClass.review = review;
        await findClass.save();
        await addReviewToUserModel({ rating, message, userId, classId, tutorId: findClass?.tutor });
        res.status(200).json({ successMessage: "Review added successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ errorMessage: 'Error adding review', error });
  }
};

exports.endClass = async (req, res) => {
  try {
    const scheduledClass = await ScheduledClass.findById({ _id: req.params.id });
    if (scheduledClass) {
      scheduledClass.ended = true;
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

// Function to parse date and time in time zone
const parseDateTime = (date, time, timezone) => {
  const [startTime] = time.split(' - ');
  const startDateTimeString = `${date} ${startTime}`;
  return moment.tz(startDateTimeString, 'DD/MM/YYYY h:mma', timezone);
};

// Function to convert local date-time to UTC
const convertToUTC = (localDateTime) => {
  return localDateTime.clone().utc();
};

// Function to convert time to user's local time
const convertToUserLocalTime = (time, userTimeZone) => {
  return time.clone().tz(userTimeZone);
};


exports.cancelAndRescheduleClass = async (req, res) => {
  const nowUTC = moment.utc();
  try {
    const studentId = req.user?._id;
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nextMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    // Count the number of classes cancelled by the student in the current month
    const findUser = await User.findOne({ _id: studentId });
    const cancelledCount = await ScheduledClass.countDocuments({
      cancelledBy: studentId,
      updatedAt: { $gte: currentMonthStart, $lt: nextMonthStart }
    });

    if (cancelledCount >= 3) {
      return res.status(201).json({ errorMessage: 'You have already cancelled 3 classes this month. You cannot cancel more.' });
    }
    else {
      const upcomingClass = await ScheduledClass.findOne({ _id: req.params.id }).populate("students tutor");

      if (upcomingClass) {
        const classDateTime = parseDateTime(upcomingClass.date, upcomingClass.time, upcomingClass?.tutor?.timezone);

        // Convert class time to student's local time and then to UTC
        if (upcomingClass?.students?.length > 0) {
          const studentTimeZone = upcomingClass?.students[0]?.timezone; // Assuming you store the student's time zone
          const studentLocalDateTime = convertToUserLocalTime(classDateTime, studentTimeZone);
          const studentNotificationTimeUTC = convertToUTC(studentLocalDateTime?.clone()?.subtract(120, 'minutes'));

          if (nowUTC.isSameOrAfter(studentNotificationTimeUTC) && nowUTC.isBefore(studentNotificationTimeUTC.clone().add(120, 'minutes'))) {
            res.status(201).json({ errorMessage: 'Class can only be cancelled 2 hours before the start time' });
          } else {
            const result = await ScheduledClass.findByIdAndUpdate(
              { _id: req.params.id },
              { $push: { cancelledBy: studentId }, $pull: { students: studentId } },
              { new: true } // Return the updated document
            ).populate("students tutor");
            if (result) {
              res.status(200).json({ successMessage: 'Scheduled Class Cancelled Successfully. You can reschedule now' });
              if (findUser?.role === 0) {
                sendEmail("admin@spelleng.com", `Class Cancellation -  Student`, AdminStudentClassCancelTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, dateAndTime: `${upcomingClass?.date} ${upcomingClass?.time}`, date: moment().format("DD/MM/YYYY") }));
              } else {
                sendEmail("admin@spelleng.com", `Class Cancellation - Tutor`, AdminTutorClassCancelTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, dateAndTime: `${upcomingClass?.date} ${upcomingClass?.time}`, date: moment().format("DD/MM/YYYY") }));
              }
            }
          }
        }
      } else {
        res.status(201).json({ errorMessage: 'Class cannot be cancelled. Please try again later' });
      }
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
