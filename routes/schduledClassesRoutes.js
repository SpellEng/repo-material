const express = require('express');
const { getAllScheduledClasses, getAllTutorFutureScheduledClasses, getAllTutorPastScheduledClasses, addScheduledClass, deleteScheduledClass, getAllStudentFutureScheduledClasses, getAllStudentPastScheduledClasses, addStudentsInScheduledClass, getScheduledClassById, deleteScheduledClassByDelAvailability, saveMeetingRecording, getReservedClass, cancelAndRescheduleClass, getAllTutorsScheduledClasses, getAllStudentsScheduledClasses, deleteRecording } = require('../controllers/scheduledClassesController');
const { isAdmin, AuthenticatorJWT, isStudent, isTutor } = require('../middlewares/authenticator');

const router = express.Router();

router.get('/', AuthenticatorJWT, isAdmin, getAllScheduledClasses);
router.get('/class/:id', AuthenticatorJWT, getScheduledClassById);
router.get('/all/tutor/:id', AuthenticatorJWT, isAdmin, getAllTutorsScheduledClasses);
router.get('/all/student/:id', AuthenticatorJWT, isAdmin, getAllStudentsScheduledClasses);
router.get('/tutor/future/:id', AuthenticatorJWT, isTutor, getAllTutorFutureScheduledClasses);
router.get('/tutor/past/:id', AuthenticatorJWT, isTutor, getAllTutorPastScheduledClasses);
router.get('/student/future/:id', AuthenticatorJWT, isStudent, getAllStudentFutureScheduledClasses);
router.get('/student/past/:id', AuthenticatorJWT, isStudent, getAllStudentPastScheduledClasses);
router.post('/reserved/:id', getReservedClass);
router.post('/add', AuthenticatorJWT, isTutor, addScheduledClass);
router.post('/add-students', AuthenticatorJWT, isStudent, addStudentsInScheduledClass);
router.put('/cancel-and-reschedule/:id', AuthenticatorJWT, isStudent, cancelAndRescheduleClass);
router.put('/delete-class-and-availability/:id', AuthenticatorJWT, isTutor, deleteScheduledClassByDelAvailability);
router.put('/save-recording/:id', AuthenticatorJWT, isTutor, saveMeetingRecording);
router.delete('/recording/delete/:id', AuthenticatorJWT, isAdmin, deleteRecording);
router.delete('/delete/:id', AuthenticatorJWT, isTutor, deleteScheduledClass);

module.exports = router;