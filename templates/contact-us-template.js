const ContactUsTemplate = ({
    fullName, email, phoneNumber, type, message
}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Us Email</title>
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
                background-color: #28a745;
                color: #fff;
                text-align: center;
                padding: 10px;
            }
    
            .content {
                padding: 20px;
            }
    
            .content h2 {
                font-size: 24px;
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
        </style>
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <h1>Contact Us Email</h1>
            </div>
            <div class="content">
                <h2>Contact Details:</h2>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>User Type:</strong> ${type}</p>
                <p><strong>Message:</strong> ${message}</p>
            </div>
            <div class="footer">
                <p>Thank you for contacting us!</p>
                <p><strong>SpellEng</strong></p>
            </div>
        </div>
    </body>
    
    </html>
    `;
};

module.exports = ContactUsTemplate;
