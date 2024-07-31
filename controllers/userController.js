const User = require('../models/userModel');
var bcrypt = require('bcryptjs');
const config = require('../config/keys');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');
const sendEmail = require('../nodemailer');
const razorpay = require('../utils/razorpay');
const ContactUsTemplate = require('../templates/contact-us-template');
const StudentBookTrialTemplate = require('../templates/student-book-trial-template');
const ResetPasswordTemplate = require('../templates/reset-password-template');
const AdminTutorRegisterationTemplate = require('../templates/admin-tutor-registeration-template');
const AdminStudentRegisterationTemplate = require('../templates/admin-student-registeration-template');

exports.getAllStudens = async (req, res) => {
    try {
        sendEmail();
        const findUsers = await User.find({ role: 0 });
        if (findUsers) {
            res.status(200).json(findUsers);
        } else {
            res.status(404).json({ errorMessage: 'No Users Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getUserById = async (req, res) => {
    try {
        const findUser = await User.findOne({ _id: req.params.id }).populate("reviews.userId");
        if (findUser) {
            res.status(200).json(findUser);
        } else {
            res.status(404).json({ errorMessage: 'No Users Found' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.verifyUserTokenIfUserExists = async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            res.status(404).json({ errorMessage: 'No token. Access Denied' });
        } else {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            const userInToken = decoded.user;
            const findUser = await User.findOne({ _id: userInToken?._id });
            if (findUser) {
                delete findUser["password"];
                res.status(200).json(findUser);
            } else {
                res.status(202).json({ errorMessage: 'No Users Found' });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.getAllTutors = async (req, res) => {
    try {
        const { availability, specialities, languages, tutorCategory, showAll, fullName } = req.body;

        // Construct the filter object
        const filter = { role: 1 };
        const currentDate = moment().format("DD/MM/YYYY");
        console.log(currentDate);

        if (availability) {
            filter['availability.date'] = currentDate;
            filter['availability.time'] = availability;
        }

        if (specialities && specialities.length > 0) {
            filter.specialities = { $in: specialities };
        }

        if (languages && languages.length > 0) {
            filter.languages = { $in: languages };
        }

        if (tutorCategory) {
            filter.tutorCategory = tutorCategory;
        }

        if (fullName) {
            filter.fullName = { $regex: fullName, $options: 'i' }; // Case-insensitive regex search
        }

        let query = User.find(filter);

        if (!showAll) {
            query = query.limit(12);
        }

        const tutors = await query.exec();

        if (tutors.length > 0) {
            res.status(200).json(tutors);
        } else {
            res.status(200).json([]);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

exports.sendOTPToPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const ifPhoneNumberAlreadyPresent = await User.findOne({ phoneNumber: phoneNumber });
        if (ifPhoneNumberAlreadyPresent) {
            res.status(201).json({ errorMessage: 'Phone number already exists. Please try another one.' });
        } else {
            const response = await axios.post(`${config.OTP_LESS_BASE_URL}/send`, {
                phoneNumber,
                otpLength: 6,
                channel: 'SMS',
                expiry: 120
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'clientId': config.OTP_LESS_CLIENT_ID,
                    'clientSecret': config.OTP_LESS_CLIENT_SECRET
                }
            });

            console.log('OTP sent:', response.data);
            res.status(200).json({ successMessage: 'OTP has been sent to your phone number', orderId: response.data?.orderId });
        }
    } catch (error) {
        console.error('Error sending OTP:', error.response.data);
        res.status(400).json({ errorMessage: `Failed to send OTP. ${error.response.data?.message}` });
    }
}

exports.signUp = async (req, res) => {
    const { fullName, city, phoneNumber, email, password, otp, orderId, role, timezone } = req.body;
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);
    // const user = new User({
    //     role: role === "tutor" ? 1 : 0,
    //     fullName,
    //     city,
    //     phoneNumber,
    //     email,
    //     timezone,
    //     password: hash
    // });

    // const saveUser = await user.save();
    // if (saveUser) {
    //     const payload = {
    //         user: {
    //             _id: saveUser._id,
    //             role: saveUser.role
    //         }
    //     }
    //     jwt.sign(payload, config.JWT_SECRET, (err, token) => {
    //         if (err) {
    //             res.status(400).json({ errorMessage: 'Jwt Error' })
    //         } else {
    //             delete saveUser["password"];
    //             res.status(200).json({
    //                 token,
    //                 user: saveUser,
    //                 successMessage: 'Account created successfuly',
    //             });
    //         }
    //     });
    // } else {
    //     res.status(400).json({ errorMessage: 'Account not created. Please try again' });
    // }
    try {
        if (fullName && email && phoneNumber && password && otp) {
            const ifEmailAlreadyPresent = await User.findOne({ email: email });
            const ifPhoneNumberAlreadyPresent = await User.findOne({ phoneNumber: phoneNumber });
            if (ifEmailAlreadyPresent) {
                res.status(201).json({ errorMessage: 'Email already exists. Please try another one.' });
            }
            else if (ifPhoneNumberAlreadyPresent) {
                res.status(201).json({ errorMessage: 'Phone number already exists. Please try another one.' });
            }
            else {
                await axios.post(`${config.OTP_LESS_BASE_URL}/verify`, {
                    otp,
                    orderId,
                    phoneNumber
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'clientId': config.OTP_LESS_CLIENT_ID,
                        'clientSecret': config.OTP_LESS_CLIENT_SECRET
                    }
                })
                    .then(async (verification) => {
                        console.log(verification)
                        if (verification?.data?.isOTPVerified) {
                            var salt = bcrypt.genSaltSync(10);
                            var hash = bcrypt.hashSync(password, salt);
                            const user = new User({
                                role: role === "tutor" ? 1 : 0,
                                fullName,
                                city,
                                phoneNumber,
                                email,
                                timezone,
                                password: hash
                            });

                            const saveUser = await user.save();
                            if (saveUser) {
                                const payload = {
                                    user: {
                                        _id: saveUser._id,
                                        role: saveUser.role
                                    }
                                }
                                jwt.sign(payload, config.JWT_SECRET, (err, token) => {
                                    if (err) {
                                        res.status(400).json({ errorMessage: 'Jwt Error' })
                                    } else {
                                        delete saveUser["password"];
                                        res.status(200).json({
                                            token,
                                            user: saveUser,
                                            successMessage: 'Account created successfuly',
                                        });
                                        if (role === "tutor") {
                                            sendEmail("admin@spelleng.com", "New Tutor Registration on SpellEng", AdminTutorRegisterationTemplate({ name: user?.fullName, email, regDate: moment(saveUser?.createdAt).format("DD/MM/YYYY") }))
                                        } else {
                                            sendEmail("admin@spelleng.com", "New Student Registration on SpellEng", AdminStudentRegisterationTemplate({ name: user?.fullName, email, regDate: moment(saveUser?.createdAt).format("DD/MM/YYYY") }))
                                        }
                                    }
                                });
                            } else {
                                res.status(400).json({ errorMessage: 'Account not created. Please try again' });
                            }
                        } else {
                            res.status(400).json({ errorMessage: 'OTP you entered is wrong' });
                        }
                    })
                    .catch(error => {
                        console.error('Error verifying OTP:', error);
                        res.status(201).json({ errorMessage: 'Opt is wrong. Error verifying OTP' });
                    });
            }
        } else {
            res.status(400).json({ errorMessage: 'Account not created. Please try again' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}


exports.login = async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email });
        if (findUser) {
            const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
            if (checkPassword) {
                const payload = {
                    user: {
                        _id: findUser._id,
                        role: findUser.role
                    }
                }
                jwt.sign(payload, config.JWT_SECRET, (err, token) => {
                    if (err) res.status(400).json({ errorMessage: 'Jwt Error' })
                    else {
                        delete findUser["password"];
                        delete findUser["resetToken"];
                        delete findUser["expireToken"];
                        res.status(200).json({
                            user: findUser,
                            token,
                            successMessage: 'Logged In Successfully',

                        });
                    }
                });
            } else {
                res.status(201).json({ errorMessage: 'Incorrect username or password.' })
            }
        }
        else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.updateUser = async (req, res) => {
    try {
        const findUser = await User.findOne({ _id: req.user._id });
        if (findUser) {
            findUser.email = req.body.email;
            findUser.fullName = req.body.fullName;
            findUser.city = req.body.city;
            findUser.state = req.body.state;
            findUser.country = req.body.country;
            findUser.phoneNumber = req.body.phoneNumber;
            findUser.picture = req.body.picture;
            findUser.proficiency = req.body.proficiency;
            findUser.learningGoals = req.body.learningGoals;
            findUser.headline = req.body.headline;
            findUser.experience = req.body.experience;
            findUser.education = req.body.education;
            if (req.body.timezone) {
                findUser.timezone = req.body.timezone;
            }
            if (req.body.videoLink) {
                findUser.videoLink = req.body.videoLink;
            }
            if (req.body.specialities) {
                findUser.specialities = req.body.specialities;
            }
            if (req.body.languages) {
                findUser.languages = req.body.languages;
            }
            findUser.description = req.body.description;
            findUser.address = req.body.address;

            const saveUser = await findUser.save();
            if (saveUser) {
                delete findUser["password"];
                delete findUser["resetToken"];
                delete findUser["expireToken"];

                await res.status(200).json({ successMessage: 'User Updated Successfully', user: findUser })
            } else (
                res.status(400).json({ errorMessage: 'User could not be Updated.' })
            )
        } else {
            res.status(404).json({ errorMessage: 'User code not found.' })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.bookTrial = async (req, res) => {
    const { plan, razorpayPaymentId, amount, email, name, user } = req.body;

    try {
        // Verify the payment with Razorpay
        const findUser = await User.findOne({ _id: user });
        if (findUser?.trialActivated) {
            res.status(201).json({ errorMessage: "You have already activated your trial." });
        } else {
            const payment = await razorpay.payments.fetch(razorpayPaymentId);

            if (payment.status !== 'captured') {
                return res.status(400).json({ error: 'Payment not successful' });
            }


            // Create a new subscription in the database
            const trialObject = {
                razorpayPaymentId: razorpayPaymentId,
                user: req.user?._id,
                plan,
                status: 'active',
                amount
            }

            findUser.trialActivated = true;
            findUser.trialDetails = trialObject;

            await findUser.save();

            // Send an email notification
            sendEmail(email, "Your SpellEng Trial Booking Confirmation", StudentBookTrialTemplate({ name: findUser?.fullName, email: findUser?.email, loginUrl: `${config.FRONTEND_URL}/login` }));
            res.json({ successMessage: 'Trial activated successfully. You can book a class with tutors', user: findUser });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to activate trial' });
    }
}

exports.addReview = async (req, res) => {
    try {
        const { rating, message, userId, tutorId, classId } = req.body;

        const user = await User.findById({ _id: tutorId, role: 1 });
        if (!user) {
            return res.status(404).json({ errorMessage: 'User not found' });
        }
        else {
            let IfReviewAlreadyPresentForThatClass = user?.reviews?.filter(f => f?.classId === classId && f?.userId === userId);
            if (IfReviewAlreadyPresentForThatClass?.length > 0) {
                res.status(201).json({ errorMessage: "Your Review is already submitted" });
            } else {
                const review = {
                    rating,
                    message,
                    userId,
                    classId
                };
                user.reviews.push(review);
                await user.save();
                res.status(200).json({ successMessage: "Review added successfully" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ errorMessage: 'Error adding review', error });
    }
};


exports.addTutorTimeSlot = async (req, res) => {
    const { date, time } = req.body;

    try {
        const findUser = await User.findOne({ _id: req.user._id });

        if (!findUser) {
            return res.status(404).send('User not found');
        }

        // Check if the date and time combination already exists in the availability array
        const slotExists = findUser.availability.some(slot => {
            // Compare dates using getTime() to ensure exact match
            return slot.date === date && slot.time === time;
        });

        if (!slotExists) {
            // If the slot does not exist, add it to the availability array
            findUser.availability.push({ date, time });
            await findUser.save();
            return res.status(200).json({ successMessage: 'Time slot added successfully' });
        } else {
            return res.status(201).json({ errorMessage: 'Time slot already exists' });
        }
    } catch (error) {
        console.error('Error adding tutor time slot:', error);
        res.status(500).send({ errorMessage: 'Failed to add time slot. Please try again.', error });
    }
};

exports.removeTutorTimeSlot = async (req, res) => {
    const { date, time } = req.body;
    try {
        const findUser = await User.findOne({ _id: req.user._id });
        if (findUser) {
            if (!findUser) {
                return res.status(404).send('User not found');
            }
            else {
                findUser.availability = findUser.availability.filter(entry =>
                    !(entry.date === date && entry.time === time)
                );

                await findUser.save();
                await res.status(200).json({ successMessage: 'Time slot removed Successfully' })
            }
        } else {
            res.status(404).json({ errorMessage: 'User code not found.' })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.saveMeetingRecording = async (req, res) => {
    const { recording } = req.body;
    try {
        const user = await User.findById({ _id: req.params.id });
        if (user) {
            user.recording = recording;
            await user.save()
            res.status(200).json({ successMessage: 'Recording saved Successfully' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.deleteRecording = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (user) {
            user.recording = null;
            await user.save()
            res.status(200).json({ successMessage: 'Recording Deleted Successfully' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirm } = req.body;
    try {
        const findUser = await User.findOne({ _id: req.user?._id });
        if (findUser) {
            const checkPassword = bcrypt.compareSync(oldPassword, findUser.password);
            if (checkPassword) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(newPassword, salt);

                findUser.password = hash;
                await findUser.save();
                res.status(200).json({ successMessage: 'Password updated successfuly!' });
            } else {
                res.status(201).json({ errorMessage: 'Incorrect old password.' })
            }

        } else {
            res.status(201).json({ errorMessage: 'Incorrect old password.' })
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}


exports.sendContactUsEmail = async (req, res) => {
    const { fullName, email, phoneNumber, type, message } = req.body
    try {
        await sendEmail("admin@spelleng.com", "Email from Contact Us form", ContactUsTemplate({ fullName, email, phoneNumber, type, message }));
        res.status(200).json({ successMessage: 'Email sent successfuly!' });
    } catch (err) {
        res.status(400).json({ successMessage: ' Failed to send email. Please try again later' });
    }
}


exports.addTutorPaymentDetails = async (req, res) => {
    const { userId, type, accountHolderName, accountNumber, ifscCode, upiId, isPreferred } = req.body;

    try {
        const user = await User.findOne({ _id: req.user?._id });

        if (!user) {
            return res.status(404).send('User not found');
        }

        let paymentDetails = user.paymentDetails.filter(detail => detail.type !== type);

        if (isPreferred) {
            paymentDetails = paymentDetails.map(detail => ({ ...detail, isPreferred: false }));
        }

        const newPaymentDetail = {
            type,
            accountHolderName: type === 'bank' ? accountHolderName : undefined,
            accountNumber: type === 'bank' ? accountNumber : undefined,
            ifscCode: type === 'bank' ? ifscCode : undefined,
            upiId: type === 'upi' ? upiId : undefined,
            isPreferred
        };

        paymentDetails.push(newPaymentDetail);

        user.paymentDetails = paymentDetails;

        await user.save();
        res.status(200).send(user.paymentDetails);
    } catch (error) {
        console.error('Error saving payment details:', error);
        res.status(500).send('Server error');
    }
}

exports.withdrawTutorPayments = async (req, res) => {
    const { title, amount, date } = req.body;
    try {
        const result = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $push: { withdrawals: { title, amount, date } } },
            { new: true } // Return the updated document
        );
        if (result) {
            res.status(200).json({ successMessage: 'Withdrawal added to tutor data successfully!' });
        } else {
            res.status(201).json({ errorMessage: 'Withdrawal cannot be added. Please try again later' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}




/****************************************************** Forgot Password ***********************************************/
exports.resetPasswordLink = async (req, res) => {
    try {
        crypto.randomBytes(32, (error, buffer) => {
            if (error) {
                console.log(error);
            }
            const token = buffer.toString("hex");
            User.findOne({ email: req.body.email }).then(user => {
                if (!user) {
                    res.status(201).json({ errorMessage: 'Email does not exist' });
                } else {
                    user.resetToken = token;
                    user.expireToken = Date.now() + 3600000;
                    user.save((err, result) => {
                        if (err) {
                            res.status(400).json({ errorMessage: 'Token saving failed' });
                        }
                        if (result) {
                            let url = `${config.FRONTEND_URL}/reset-password/${token}`

                            sendEmail(req.body.email, "Password Reset Request", ResetPasswordTemplate({ name: user?.fullName, url }))
                            res.status(200).json({ successMessage: 'Check your Inbox!' });
                        }
                    })
                }
            })
        })
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

exports.updatePassword = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirm) {
            res.status(400).json({ errorMessage: 'Passwords do not match.' })
        }

        else {
            await User.findOne({ resetToken: req.body.token, expireToken: { $gt: Date.now() } }).then(user => {
                if (!user) {
                    res.status(201).json({ errorMessage: 'Try again. Session expired!' });
                }
                if (user) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(req.body.password, salt);
                    user.password = hash;
                    user.resetToken = '',
                        user.expireToken = '',
                        user.save((error, result) => {
                            if (error) {
                                res.status(400).json({ errorMessage: 'Failed to update password' });
                            } else {
                                res.status(200).json({ successMessage: 'Password updated Successfully.' })
                            }
                        })
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findById({ _id: req.params.id })
        if (deleteUser) {
            deleteUser.remove();
            res.status(200).json({ successMessage: `User has been deleted successfully` });
        } else {
            res.status(400).json({ errorMessage: 'User could not be deleted. Please try again' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}