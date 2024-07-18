const express = require('express');
const { AuthenticatorJWT, isAdmin, isTutor } = require('../middlewares/authenticator');
const { getAllStudens, getUserById, adminLogin, changePassword, resetPasswordLink, updatePassword, signUp, login, updateEmail, addUserByAdmin, updateUserByAdmin, deleteUser, updateUser, sendOTPToPhoneNumber, addTutorTimeSlot, getAllTutors, removeTutorTimeSlot, bookTrial, addReview, addTutorPaymentDetails, withdrawTutorPayments, sendContactUsEmail } = require('../controllers/userController');

const router = express.Router();

router.get('/', AuthenticatorJWT, isAdmin, getAllStudens);
router.post('/tutors', getAllTutors);
router.get('/user/:id', getUserById);
router.post('/send-otp', sendOTPToPhoneNumber);
router.post('/signup', signUp);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/book-trial', bookTrial);
router.post('/tutor/add-reviews', AuthenticatorJWT, addReview);
router.put('/update-profile', AuthenticatorJWT, updateUser);
router.put('/change-password', AuthenticatorJWT, changePassword);
router.put('/send-contact-email', sendContactUsEmail);

router.post('/send/forgot-email', resetPasswordLink);
router.put('/reset-password', updatePassword);


// Tutor Specific APIs
router.put('/tutors/add/time-slot', AuthenticatorJWT, isTutor, addTutorTimeSlot);
router.put('/tutors/remove/time-slot', AuthenticatorJWT, isTutor, removeTutorTimeSlot);
router.put('/tutors/add-payment-details', AuthenticatorJWT, isTutor, addTutorPaymentDetails);
router.put('/tutors/withdraw-tutor-payments/:id', AuthenticatorJWT, isAdmin, withdrawTutorPayments);

router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteUser);

module.exports = router; 