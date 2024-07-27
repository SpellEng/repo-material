const TutorRegisterationTemplate = ({ name }) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tutor Registeration Template</title>
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
            <h2>Dear ${name},</h2>
            <p>
            Welcome to SpellEng! We are delighted to have you join our
community of dedicated tutors. Your profile has been successfully
created, and you can now start scheduling your availability for 1-on-1
video calls with students eager to learn and improve their English
skills.
            </p>
            <p>
            To get started, log in to your account at [website link] and set up your
time slots. If you have any questions or need assistance, our support
team is here to help.
            </p>
            <p>Thank you for being a part of SpellEng!</p>
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

module.exports = TutorRegisterationTemplate;
