const StudentBookTrialTemplate = ({ name, email, loginUrl }) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Session Booking Confirmation</title>
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
            <h2>Hello ${name},</h2>
            <p>Thank you for booking a trial session with SpellEng for just 99 INR!</p>
            <p>We are thrilled to have you start your journey with us.</p>
            <p>Here are your trial session details:</p>
            <ul class="details-list">
                <li><strong>Session Cost:</strong> 99 INR</li>
                <li><strong>Full Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
            </ul>
            <p>You can log in to your account and view your trial session details <a href="${loginUrl}" target="_blank"
                    class="button">here</a>.</p>
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        </div>
        <div class="footer">
            <p>Happy learning!</p>
            <p>Best regards,</p>
            <p><strong>The SpellEng Team</strong></p>
        </div>
    </div>
</body>

</html>
    `;
};

module.exports = StudentBookTrialTemplate;
