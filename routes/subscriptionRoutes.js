const express = require('express');
const { getAllUserSubscriptionsById, getSubscriptionById, createSubscription, cancelSubscription, getAllSubscriptions, createOrder, updateSubscriptionStatus, getActiveSubscriptionStatusByUser } = require('../controllers/subscriptionController');
const { isAdmin, AuthenticatorJWT, isStudent } = require('../middlewares/authenticator');

const router = express.Router();

router.get('/', AuthenticatorJWT, isAdmin, getAllSubscriptions);
router.get('/user/:id', AuthenticatorJWT, getAllUserSubscriptionsById);
router.get('/active-subscription', AuthenticatorJWT, isStudent, getActiveSubscriptionStatusByUser);
router.get('/:id', AuthenticatorJWT, getSubscriptionById);
router.post('/create-order', AuthenticatorJWT, createOrder);
router.post('/create-subscription', AuthenticatorJWT, createSubscription);
// router.put('/update-status/:id', AuthenticatorJWT, updateSubscriptionStatus);
router.delete('/subscription/cancel/:id', AuthenticatorJWT, cancelSubscription);


module.exports = router;