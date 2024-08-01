const ScheduledClass = require('../models/scheduledClassesModel');
const Subscription = require('../models/subscriptionModel');
const Chat = require('../models/chatModel');
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
const TutorStudentCancelClassTemplate = require('../templates/tutor-student-cancel-class-template');
const StudentTutorCancelClassTemplate = require('../templates/student-tutor-cancel-class-template');


// Function to parse date and time in time zone
const parseDateTime = (date, time, timezone) => {
  const [startTime] = time.split(' - ');
  const startDateTimeString = `${date} ${startTime}`;
  return moment.tz(startDateTimeString, 'DD/MM/YYYY h:mma', timezone);
};

// Function to parse date and time in time zone
const parseDateAndEndTime = (date, time, timezone) => {
  const [startTime, endTime] = time.split(' - ');
  const startDateTimeString = `${date} ${endTime}`;
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
  const nowUTC = moment.utc();

  try {
    const scheduledClasses = await ScheduledClass.find({
      students: { $exists: true, $not: { $size: 0 } },
    })
      .populate('students tutor')
      .exec();

    const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const { date, time } = scheduledClass;
      const timezone = scheduledClass?.tutor?.timezone;

      // Parse the start and end time from the time string
      const [startTime, endTime] = time.split(' - ');

      // Combine date and time to form the full date-time string
      const endDateTimeStr = `${date} ${endTime}`;

      // Parse the end date-time string according to the class's time zone
      const endDateTime = moment.tz(endDateTimeStr, 'DD/MM/YYYY h:mma', timezone);

      // Convert the end date-time to UTC for comparison
      const endDateTimeUTC = endDateTime.clone().utc();

      // Check if the class's end time in UTC is before the current time in UTC
      return endDateTimeUTC.isBefore(nowUTC);
    });

    res.status(200).json(pastScheduledClasses);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};


// exports.getAllPastScheduledClasses = async (req, res) => {
//   const nowUTC = moment.utc();

//   try {
//     const currentDateTime = moment();
//     const scheduledClasses = await ScheduledClass.find({
//       students: { $exists: true, $not: { $size: 0 } },
//       date: { $lte: moment().format("DD/MM/YYYY") }
//     })
//       .populate("students tutor")
//       .exec();

//     // Filter the classes to get only the past ones
//     const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
//       const classDateTime = parseDateAndEndTime(scheduledClass.date, scheduledClass.time, scheduledClass?.tutor?.timezone);
//       const [startTime, endTime] = scheduledClass.time.split(' - ');
//       const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
//       const endDateTime = moment(endDateTimeStr, "DD/MM/YYYY h:mma");

//       return endDateTime.isBefore(currentDateTime);
//     });

//     if (pastScheduledClasses.length > 0) {
//       res.status(200).send(pastScheduledClasses);
//     } else {
//       res.status(200).json([]);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// }

exports.getAllFutureScheduledClasses = async (req, res) => {
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      students: { $exists: true, $not: { $size: 0 } }
    })
      .populate("students tutor")
      .exec();

    // Filter the classes to get only the past ones
    const futureScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
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
  const zoomAccessToken = await authController.getZoomAccessToken();
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
    res.status(201).json({ errorMessage: `${error?.response?.data?.message || error?.message} Please click on authorize zoom button` });
  }
};

exports.getAllTutorFutureScheduledClasses = async (req, res) => {
  try {
    const currentDateTime = moment();
    const scheduledClasses = await ScheduledClass.find({
      tutor: req.params.id,
      students: { $exists: true, $not: { $size: 0 } }
    })
      .populate("students tutor").exec();
    // Filter the classes to get only the past ones
    const futureScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
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
    const nowUTC = moment.utc();
    const scheduledClasses = await ScheduledClass.find({
      tutor: req.params.id,
      students: { $exists: true, $not: { $size: 0 } },
      date: { $lte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor")
      .exec();

    // Filter the classes to get only the past ones
    const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const { date, time } = scheduledClass;
      const timezone = scheduledClass?.tutor?.timezone;

      // Parse the start and end time from the time string
      const [startTime, endTime] = time.split(' - ');

      // Combine date and time to form the full date-time string
      const endDateTimeStr = `${date} ${endTime}`;

      // Parse the end date-time string according to the class's time zone
      const endDateTime = moment.tz(endDateTimeStr, 'DD/MM/YYYY h:mma', timezone);

      // Convert the end date-time to UTC for comparison
      const endDateTimeUTC = endDateTime.clone().utc();

      // Check if the class's end time in UTC is before the current time in UTC
      return endDateTimeUTC.isBefore(nowUTC);
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
      let classesWithoutTrial = scheduledClasses?.filter(f => !f?.trialClass);
      res.status(200).send(classesWithoutTrial);
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
    // const users = await User.updateMany({ role: 1 }, { availability: { $set: null } });
    // const users = await User.findOne({ role: 0 });
    // users.trialUsed = false;
    // users.trialDetails = null;
    // users.trialActivated = false;
    // users.save();
    // console.log(users);
    // const sc = await Subscription.findOne();
    // // const sc = await ScheduledClass.findById("66ac05f7915869d73c395083").populate("students tutor");
    // console.log(sc);
    // sc.expiryDate = "01/08/2024";
    // sc.save();
    const scheduledClasses = await ScheduledClass.find({
      students: { $in: [mongoose.Types.ObjectId(studentId)] }
    })
      .populate("students tutor").exec();

    const currentDateTime = moment();
    const futureScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const [startTime, endTime] = scheduledClass.time.split(' - ');
      const endDateTimeStr = `${scheduledClass.date} ${endTime}`;
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
    const nowUTC = moment.utc();
    const scheduledClasses = await ScheduledClass.find({
      students: { $in: [mongoose.Types.ObjectId(studentId)] },
      date: { $lte: moment().format("DD/MM/YYYY") }
    })
      .populate("students tutor").exec();
    // Filter the classes to get only the past ones
    const pastScheduledClasses = scheduledClasses.filter((scheduledClass) => {
      const { date, time } = scheduledClass;
      const timezone = scheduledClass?.tutor?.timezone;

      // Parse the start and end time from the time string
      const [startTime, endTime] = time.split(' - ');

      // Combine date and time to form the full date-time string
      const endDateTimeStr = `${date} ${endTime}`;

      // Parse the end date-time string according to the class's time zone
      const endDateTime = moment.tz(endDateTimeStr, 'DD/MM/YYYY h:mma', timezone);

      // Convert the end date-time to UTC for comparison
      const endDateTimeUTC = endDateTime.clone().utc();

      // Check if the class's end time in UTC is before the current time in UTC
      return endDateTimeUTC.isBefore(nowUTC);
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
  const findStudent = await User.findOne({ _id: student });
  const findTutor = await User.findOne({ _id: tutor });

  if (findStudent?.trialActivated && !findStudent?.trialUsed) {
    try {
      let scheduledClass = await ScheduledClass.findOne({
        tutor,
        date,
        time
      });

      if (scheduledClass) {
        if (!scheduledClass?.students?.includes(student)) {
          scheduledClass?.students?.push(student);
          scheduledClass.trialClass = true;
        }
        findStudent.trialUsed = true;
        await scheduledClass.save();
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
  } else {
    const now = moment();
    const checkIfStudentIsSubscribed = await Subscription.findOne({ user: student, status: "active" });
    if (checkIfStudentIsSubscribed) {
      const subsStartDate = moment(checkIfStudentIsSubscribed.startDate, "DD/MM/YYYY");
      const subsEndDate = moment(checkIfStudentIsSubscribed.expiryDate, "DD/MM/YYYY");
      try {
        if (now.isAfter(subsEndDate) || now.isBefore(subsStartDate)) {
          res.status(202).json({ errorMessage: 'Your subscription has expired or is not yet active.' });
        } else {
          const allScheduledClasses = await ScheduledClass.find({
            students: { $in: [mongoose.Types.ObjectId(student)] }
          }).populate("students tutor").exec();

          const studentCurrentPlanAttendedClasses = allScheduledClasses.filter(scheduledClass => {
            const classDate = moment(scheduledClass.date, "DD/MM/YYYY");
            return !scheduledClass?.trialClass && classDate.isSameOrAfter(subsStartDate) && classDate.isBefore(subsEndDate);
          });
          console.log(studentCurrentPlanAttendedClasses)
          if (checkIfStudentIsSubscribed.totalClasses > studentCurrentPlanAttendedClasses.length) {
            let scheduledClass = await ScheduledClass.findOne({
              tutor,
              date,
              time
            });

            if (scheduledClass) {
              if (!scheduledClass?.students?.includes(student)) {
                scheduledClass?.students?.push(student);
              }
              await scheduledClass.save();
              sendEmail(findStudent?.email, `Class Scheduled with ${findTutor?.fullName}`, StudentBookClassTemplate({ studentName: findStudent?.fullName, tutorName: findTutor?.fullName, date, time, url: `${config.FRONTEND_URL}/student/upcoming-classes` }));
              sendEmail(findTutor?.email, `Class Scheduled with ${findStudent?.fullName}`, TutorBookClassTemplate({ tutorName: findTutor?.fullName, studentName: findStudent?.fullName, date, time }));
              res.status(200).json({ successMessage: 'You are added to scheduled class successfully' });
            } else {
              res.status(201).json({ errorMessage: 'No class is scheduled yet.' });
            }
          } else {
            res.status(202).json({ errorMessage: 'You have used all your classes available in your current plan. Please resubscribe to add more classes' });
          }
        }
      } catch (error) {
        console.error('Error adding student to scheduled class:', error);
        res.status(500).json({ errorMessage: 'Failed to add student to scheduled class. Please try again.', error });
      }
    } else {
      res.status(202).json({ errorMessage: 'You are not subscribed. Please buy a subscription plan and then try again.' });
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

exports.cancelAndRescheduleClass = async (req, res) => {
  const nowUTC = moment.utc();
  try {
    const studentId = req.user?._id;
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nextMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    // Count the number of classes cancelled by the student in the current month
    const findUser = await User.findOne({ _id: studentId });
    const cancelledCount = await ScheduledClass.find({
      cancelledBy: studentId,
      updatedAt: { $gte: currentMonthStart, $lt: nextMonthStart }
    });
    const updatedCancelCount = cancelledCount?.filter(f => !f?.trialClass);
    if (updatedCancelCount?.length >= 3) {
      return res.status(201).json({ errorMessage: 'You have already cancelled 3 classes this month. You cannot cancel more.' });
    }
    else {
      const upcomingClass = await ScheduledClass.findOne({ _id: req.params.id }).populate("students tutor");

      if (upcomingClass) {
        const classDateTime = parseDateTime(upcomingClass.date, upcomingClass.time, upcomingClass?.tutor?.timezone);

        // Convert class time to student's local time and then to UTC
        if (upcomingClass?.students?.length > 0) {
          const studentTimeZone = upcomingClass?.students[0]?.timezone;
          const studentLocalDateTime = convertToUserLocalTime(classDateTime, studentTimeZone);
          const studentNotificationTimeUTC = convertToUTC(studentLocalDateTime?.clone()?.subtract(120, 'minutes'));

          if (nowUTC.isSameOrAfter(studentNotificationTimeUTC)) {
            res.status(201).json({ errorMessage: 'Class can only be cancelled 2 hours before the start time' });
          } else {
            const result = await ScheduledClass.findByIdAndUpdate(
              { _id: req.params.id },
              { $push: { cancelledBy: studentId }, $pull: { students: studentId }, $set: { trialClass: false } },
            ).populate("students tutor");
            if (result) {
              console.log(result);
              // const findScheduledClass = await ScheduledClass.findOne({ _id: req.params.id });
              if (findUser?.role === 0) {
                sendEmail(upcomingClass?.tutor?.email, `Class Cancellation Notification`, TutorStudentCancelClassTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, date: upcomingClass?.date, time: upcomingClass?.time }));
                sendEmail(upcomingClass?.students[0]?.email, `Class Cancellation Notification`, StudentTutorCancelClassTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, date: upcomingClass?.date, time: upcomingClass?.time }));
                sendEmail("admin@spelleng.com", `Class Cancellation - Student`, AdminStudentClassCancelTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, dateAndTime: `${upcomingClass?.date} ${upcomingClass?.time}`, date: moment().format("DD/MM/YYYY") }));
                if (result?.trialClass) {
                  findUser.trialUsed = false;
                  await findUser.save();
                  res.status(200).json({ successMessage: 'Scheduled Class Cancelled Successfully. You can reschedule now' });
                } else {
                  res.status(200).json({ successMessage: 'Scheduled Class Cancelled Successfully. You can reschedule now' });
                }
              } else {
                sendEmail(upcomingClass?.tutor?.email, `Class Cancellation Notification`, TutorStudentCancelClassTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, date: upcomingClass?.date, time: upcomingClass?.time }));
                sendEmail(upcomingClass?.students[0]?.email, `Class Cancellation Notification`, StudentTutorCancelClassTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, date: upcomingClass?.date, time: upcomingClass?.time }));
                sendEmail("admin@spelleng.com", `Class Cancellation - Tutor`, AdminTutorClassCancelTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, dateAndTime: `${upcomingClass?.date} ${upcomingClass?.time}`, date: moment().format("DD/MM/YYYY") }));
                res.status(200).json({ successMessage: 'Scheduled Class Cancelled Successfully. You can reschedule now' });
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

exports.cancelAndDeleteScheduledClassByTutor = async (req, res) => {
  const nowUTC = moment.utc();
  try {
    const upcomingClass = await ScheduledClass.findById({ _id: req.params.id }).populate("tutor students");

    if (upcomingClass) {
      const findStudent = await User.findOne({ _id: upcomingClass?.students[0]?._id, role: 0 });
      const classDateTime = parseDateTime(upcomingClass.date, upcomingClass.time, upcomingClass?.tutor?.timezone);

      // Convert class time to student's local time and then to UTC
      if (upcomingClass?.students?.length > 0) {
        const studentTimeZone = upcomingClass?.students[0]?.timezone;
        const studentLocalDateTime = convertToUserLocalTime(classDateTime, studentTimeZone);
        const studentNotificationTimeUTC = convertToUTC(studentLocalDateTime?.clone()?.subtract(120, 'minutes'));

        if (nowUTC.isSameOrAfter(studentNotificationTimeUTC)) {
          res.status(201).json({ errorMessage: 'Class can only be cancelled 2 hours before the start time' });
        } else {
          const result = await upcomingClass.remove();
          if (upcomingClass?.trialClass) {
            findStudent.trialUsed = false;
            await findStudent.save();
          }
          if (result) {
            sendEmail(upcomingClass?.tutor?.email, `Class Cancellation Notification`, TutorStudentCancelClassTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, date: upcomingClass?.date, time: upcomingClass?.time }));
            sendEmail(upcomingClass?.students[0]?.email, `Class Cancellation Notification`, StudentTutorCancelClassTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, date: upcomingClass?.date, time: upcomingClass?.time }));
            sendEmail("admin@spelleng.com", `Class Cancellation - Tutor`, AdminTutorClassCancelTemplate({ tutorName: upcomingClass?.tutor?.fullName, studentName: upcomingClass?.students[0]?.fullName, dateAndTime: `${upcomingClass?.date} ${upcomingClass?.time}`, date: moment().format("DD/MM/YYYY") }));
            res.status(200).json({ successMessage: 'Scheduled Class Cancelled Successfully. You can reschedule now' });
          }
        }
      }
    } else {
      res.status(201).json({ errorMessage: 'Class cannot be cancelled. Please try again later' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}
// exports.deleteScheduledClass = async (req, res) => {
//   try {
//     const scheduledClass = await ScheduledClass.findById({ _id: req.params.id });
//     if (scheduledClass) {
//       scheduledClass.remove();
//       res.status(200).json({ successMessage: 'Scheduled Class Deleted Successfully' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error);
//   }
// }
