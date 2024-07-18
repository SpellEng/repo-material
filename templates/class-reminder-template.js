const ClassReminderTemplate = (frontendUrl, userName, otherUserName, classTime, classDate) => {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Class Reminder</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: auto;
                padding: 20px;
                background: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .header {
                background-color: #4CAF50;
                color: #fff;
                padding: 10px 20px;
                text-align: center;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }

            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #fff;
            }

            .content {
                padding: 20px;
            }

            .content h2 {
                font-size: 20px;
                margin-bottom: 10px;
            }

            .content p {
                font-size: 16px;
                margin-bottom: 5px;
            }

            .footer {
                text-align: center;
                margin-top: 20px;
                color: #777;
            }

            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #fff !important;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <div class="header">
                <h1>Class Reminder</h1>
            </div>
            <div class="content">
                <h2>Hello ${userName},</h2>
                <p>This is a reminder for your upcoming class with ${otherUserName}.</p>
                <p><strong>Date:</strong> ${classDate}</p>
                <p><strong>Time:</strong> ${classTime}</p>
                <p>Please make sure to be available and on time.</p>
                <a href=${frontendUrl} target="_blank" class="button">Join Class</a>
            </div>
            <div class="footer">
                <p>Thank you for using our service!</p>
                <p><strong>SpellEng</strong></p>
            </div>
        </div>
    </body>

    </html>
    `;
};

module.exports = ClassReminderTemplate;
