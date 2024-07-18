const express = require('express');
const config = require('./config/keys');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const scheduledClassesRoutes = require('./routes/schduledClassesRoutes');
const ScheduledClass = require('./models/scheduledClassesModel');
const Chat = require('./models/chatModel');
const mongoose = require('mongoose');
const cors = require('cors');
const moment = require('moment-timezone');
const path = require('path');
const morgan = require('morgan');
const app = express();
const nodeCron = require('node-cron');
// const moment = require('moment');
const server = require('http').createServer(app);
const { v4: uuidV4 } = require('uuid');
const sendEmail = require('./nodemailer');
const ClassReminderTemplate = require('./templates/class-reminder-template');
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
}
);

require("dotenv").config();

/******************************************  MiddleWares  ********************************************/
app.use(express.json({ limit: "5000mb" }));
app.use(express.urlencoded({ extended: true, limit: "5000mb" }));
app.use(express.static('client/build'));
app.use(morgan("tiny"));
app.use(cors({ origin: ["http://localhost:3000", "http://192.168.243.226:3000", "https://spell-eng-78aa45beff15.herokuapp.com", "http://192.168.1.143:3000"] }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/files', fileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scheduled-classes', scheduledClassesRoutes);

/******************************************  MongoDb Connection  ********************************************/

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('./client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
// }

// Function to parse date and time in Pakistan time zone
const parseDateTimePakistan = (date, time, timezone) => {
    const [startTime] = time.split(' - ');
    const startDateTimeString = `${date} ${startTime}`;
    return moment.tz(startDateTimeString, 'DD/MM/YYYY h:mma', timezone);
};

// Function to convert local date-time to UTC
const convertToUTC = (localDateTime) => {
    return localDateTime.clone().utc();
};

// Function to convert Pakistan time to user's local time
const convertToUserLocalTime = (pakistanTime, userTimeZone) => {
    return pakistanTime.clone().tz(userTimeZone);
};

nodeCron.schedule('*/1 * * * *', async () => {
    const nowUTC = moment.utc();
    const fiveMinutesLaterUTC = moment.utc().add(5, 'minutes');
    console.log("Cron job called at UTC time: ", nowUTC.format());

    const upcomingClasses = await ScheduledClass.find({ date: { $gte: moment().format("DD/MM/YYYY") } }).populate("students tutor");
    upcomingClasses.forEach(async (upcomingClass) => {
        // Parse the class date-time in Pakistan time
        const classDateTimePakistan = parseDateTimePakistan(upcomingClass.date, upcomingClass.time, upcomingClass?.tutor?.timezone);

        // Convert Pakistan time to student's local time and then to UTC
        if (upcomingClass?.students?.length > 0) {
            const studentTimeZone = upcomingClass?.students[0]?.timezone; // Assuming you store the student's time zone
            const studentLocalDateTime = convertToUserLocalTime(classDateTimePakistan, studentTimeZone);
            const studentNotificationTimeUTC = convertToUTC(studentLocalDateTime?.clone()?.subtract(5, 'minutes'));

            if (nowUTC.isSameOrAfter(studentNotificationTimeUTC) && nowUTC.isBefore(studentNotificationTimeUTC.clone().add(5, 'minutes'))) {
                await sendEmail(
                    upcomingClass?.students[0]?.email,
                    'Class Reminder From SpellENg',
                    ClassReminderTemplate(
                        config.FRONTEND_URL + "/student/upcoming-classes",
                        upcomingClass?.students[0]?.fullName,
                        upcomingClass?.tutor?.fullName,
                        upcomingClass?.time,
                        upcomingClass?.date
                    )
                );
            }
        }

        // Convert Pakistan time to tutor's local time and then to UTC
        const tutorTimeZone = upcomingClass?.tutor?.timezone; // Assuming you store the tutor's time zone
        const tutorLocalDateTime = convertToUserLocalTime(classDateTimePakistan, tutorTimeZone);
        const tutorNotificationTimeUTC = convertToUTC(tutorLocalDateTime.clone().subtract(5, 'minutes'));

        if (nowUTC.isSameOrAfter(tutorNotificationTimeUTC) && nowUTC.isBefore(tutorNotificationTimeUTC.clone().add(5, 'minutes'))) {
            await sendEmail(
                upcomingClass?.tutor?.email,
                'Class Reminder From SpellENg',
                ClassReminderTemplate(
                    config.FRONTEND_URL + "/tutor/upcoming-classes",
                    upcomingClass?.tutor?.fullName,
                    upcomingClass?.students[0]?.fullName,
                    upcomingClass?.time,
                    upcomingClass?.date
                )
            );
        }
    });
});

app.get("/server", (req, res) => {
    res.send("Server is running...")
})

// Generate a unique room ID
const roomId = uuidV4();

app.get('/room', (req, res) => {
    res.json({ roomId });
});

const sessionsMap = {};
const socketToRoom = {};
io.on('connection', socket => {
    console.log('User connected:', socket.id);
    // Joining a chat room based on userId 
    socket.on('join', async ({ userId }) => {
        socket.join(userId);
        sessionsMap[userId] = socket.id
    });
    console.log("All Users", sessionsMap);
    socket.on('users', async (userId) => {
        try {
            const users = await Chat.find({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            }).populate("sender receiver");
            io.to(userId).emit('users', users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });

    socket.on('messages', async ({ receiver, sender }) => {
        try {
            const chats = await Chat.findOne({
                $or: [
                    { sender: sender, receiver: receiver },
                    { sender: receiver, receiver: sender }
                ]
            });
            socket.emit('messages', chats?.messages);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    });

    // Sending message event
    socket.on('sendMessage', async ({ senderId, receiverId, message, file }) => {
        try {
            // Save message to MongoDB
            const newMessage = {
                message,
                sender: senderId,
                receiver: receiverId,
                file,
            };

            // Update or create chat if not exist
            let findChats = await Chat.findOne(
                {
                    $or: [
                        { sender: senderId, receiver: receiverId },
                        { sender: receiverId, receiver: senderId }
                    ]
                });
            if (findChats) {
                findChats?.messages?.push(newMessage);
                await findChats?.save();
                io.to(receiverId).emit('messages', findChats?.messages);
                io.to(senderId).emit('messages', findChats?.messages);
            } else {
                const newChat = new Chat({
                    sender: senderId,
                    receiver: receiverId,
                    messages: [newMessage]
                });
                await newChat.save();
                io.to(receiverId).emit('messages', newChat?.messages);
                io.to(senderId).emit('messages', newChat?.messages);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });


    //Join Video Call Meeting
    socket.on('join-room', (roomId, userId, loggedInUser) => {
        console.log(`a new user ${userId} joined room ${roomId}`);
        socket.join(roomId);
        let user = {
            userId, loggedInUser
        }
        socket.broadcast.to(roomId).emit('user-connected', user);
        socketToRoom[socket.id] = roomId; // Track which room the socket is in
    });


    // Sending messages to group video chat
    socket.on('sendMessageInRoom', async ({ roomId, senderId, message }) => {
        try {
            // Save message to MongoDB
            const newMessage = {
                message,
                sender: senderId
            };
            console.log(newMessage);
            // Update or create chat if not exist
            let findChats = await ScheduledClass.findOne({ _id: roomId }).populate("messages.sender");
            if (findChats) {
                findChats?.messages?.push(newMessage);
                await findChats?.save();
                let getNewChats = await ScheduledClass.findOne({ _id: roomId }).populate("messages.sender");
                io.to(roomId).emit('roomMessages', getNewChats?.messages);
            } else {
                findChats.messages = [newMessage];
                await findChats.save();
                let getNewChats = await ScheduledClass.findOne({ _id: roomId }).populate("messages.sender");
                io.to(roomId).emit('roomMessages', getNewChats?.messages);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('user-toggle-audio', (userId, roomId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-toggle-audio', userId)
    })

    socket.on('user-toggle-video', (userId, roomId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-toggle-video', userId)
    })

    socket.on('user-leave', (userId, roomId) => {
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit('user-leave', userId)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        const roomId = socketToRoom[socket.id];
        if (roomId) {
            socket.broadcast.to(roomId).emit('user-leave', socket.id);
            delete socketToRoom[socket.id];
        }
        // Clean up the session map
        for (const userId in sessionsMap) {
            if (sessionsMap[userId] === socket.id) {
                delete sessionsMap[userId];
                break;
            }
        }
    });
});

server.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));