const StudentTutorCancelClassTemplate = ({ tutorName, studentName, date, time }) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Session Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        .content h2 {
            font-size: 22px;
            color: #333;
        }

        .content p {
            font-size: 16px;
            color: #555;
            margin-bottom: 15px;
        }

        .footer {
            margin-top: 20px;
            color: #777;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }

        .details-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }

        .details-list li {
            margin-bottom: 10px;
            font-size: 16px;
        }

        .details-list li strong {
            color: #333;
        }

        .footer p {
            margin: 5px 0;
            margin-bottom: 0px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="content">
            <h2>Dear ${studentName},</h2>
            <p>We regret to inform you that your class with ${tutorName} scheduled for ${date} at ${time} has been canceled.</p>
           <p>You can reschedule your class through your dashboard here: 
           <br>
           <a href="https://www.spelleng.com/all-tutors" target="_blank"
                    class="button">here</a>
           </p>
            <p>We apologize for any inconvenience this may cause. You can view
            your updated schedule by logging in to your SpellEng account.</p>
            <p>Thank you for your understanding.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p><strong>The SpellEng Team</strong></p>
        </div>
    </div>
</body>

</html>
    `;
};

module.exports = StudentTutorCancelClassTemplate;
