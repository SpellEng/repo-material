const AdminStudentBuySubscriptionTemplate = ({ name, email, plan, date }) => {
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
            <h2>Dear Admin,</h2>
            <p>A student has purchased a subscription plan on SpellEng.</p>
            <p>Purchase Details:</p>
            <ul class="details-list">
                <li><strong>Student Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Subscription Plan:</strong> ${plan}</li>
                <li><strong>Purchase Date:</strong> ${date}</li>
            </ul>
            <p>Please update the student’s account to reflect the new subscription
            and ensure they have access to the appropriate features.</p>
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

module.exports = AdminStudentBuySubscriptionTemplate;
