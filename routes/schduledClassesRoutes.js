const express = require('express');
const { getAllScheduledClasses, getAllTutorFutureScheduledClasses, getAllTutorPastScheduledClasses, addScheduledClass, deleteScheduledClass, getAllStudentFutureScheduledClasses, getAllStudentPastScheduledClasses, addStudentsInScheduledClass, getScheduledClassById, deleteScheduledClassByDelAvailability, getReservedClass, cancelAndRescheduleClass, getAllTutorsScheduledClasses, getAllStudentsScheduledClasses, endClass, getAllStudentCancelledScheduledClasses, createMeeting, getAllPastScheduledClasses, getAllFutureScheduledClasses, addReview, cancelAndDeleteScheduledClassByTutor } = require('../controllers/scheduledClassesController');
const { isAdmin, AuthenticatorJWT, isStudent, isTutor } = require('../middlewares/authenticator');

const router = express.Router();

router.get('/', AuthenticatorJWT, isAdmin, getAllScheduledClasses);
router.get('/class/:id', AuthenticatorJWT, getScheduledClassById);
router.get('/past', AuthenticatorJWT, isAdmin, getAllPastScheduledClasses);
router.get('/future', AuthenticatorJWT, isAdmin, getAllFutureScheduledClasses);
router.get('/all/tutor/:id', AuthenticatorJWT, isAdmin, getAllTutorsScheduledClasses);
router.get('/all/student/:id', AuthenticatorJWT, isAdmin, getAllStudentsScheduledClasses);
router.get('/tutor/future/:id', AuthenticatorJWT, isTutor, getAllTutorFutureScheduledClasses);
router.get('/tutor/past/:id', AuthenticatorJWT, isTutor, getAllTutorPastScheduledClasses);
router.get('/student/cancelled/:id', AuthenticatorJWT, isStudent, getAllStudentCancelledScheduledClasses);
router.get('/student/future/:id', AuthenticatorJWT, isStudent, getAllStudentFutureScheduledClasses);
router.get('/student/past/:id', AuthenticatorJWT, isStudent, getAllStudentPastScheduledClasses);
router.post('/create-meeting', createMeeting);
router.post('/reserved/:id', getReservedClass);
router.post('/add', AuthenticatorJWT, isTutor, addScheduledClass);
router.post('/add-students', AuthenticatorJWT, isStudent, addStudentsInScheduledClass);
router.put('/cancel-and-reschedule/:id', AuthenticatorJWT, isStudent, cancelAndRescheduleClass);
router.put('/add-review', AuthenticatorJWT, addReview);
router.put('/end-class/:id', AuthenticatorJWT, endClass);
router.put('/delete-class-and-availability/:id', AuthenticatorJWT, isTutor, deleteScheduledClassByDelAvailability);
router.delete('/delete/:id', AuthenticatorJWT, isTutor, cancelAndDeleteScheduledClassByTutor);

module.exports = router;