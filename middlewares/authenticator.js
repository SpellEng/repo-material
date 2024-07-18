const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

AuthenticatorJWT = (req, res, next) => {
    const tokenWithBearer = req.headers?.authorization;
    const token = tokenWithBearer?.split(' ')[1];
    if (!token) {
        res.status(404).json({ errorMessage: 'No token. Access Denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();

    } catch (error) {
        res.status(400).json({ errorMessage: 'You cannot access this rout. Please try logging out and loging in again' });

    }
}

isStudent = (req, res, next) => {
    if (req.user && req.user.role === 0) {
        return next();
    } else {
        return res.status(401).send({ errorMessage: 'This route is protected for students!.' });
    }
}

isTutor = (req, res, next) => {
    if (req.user && (req.user.role === 1 || req.user.role === 2)) {
        return next();
    } else {
        return res.status(401).send({ errorMessage: 'This route is protected for tutors only!.' });
    }
}

isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 2) {
        return next();
    } else {
        return res.status(401).send({ errorMessage: 'This route is protected for admin only!.' });
    }
}


module.exports = { AuthenticatorJWT, isStudent, isTutor, isAdmin };