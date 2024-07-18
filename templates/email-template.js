const Template = (
    {
        orderId, name
    }) => {
    return `
    <!DOCTYPE html>
    <html>
    
    <head>
        <style>
            .template {
                margin: 15px;
                font-size: 17px;
                font-family: 'Courier New', Courier, monospace;
            }
    
            .template p {
                margin: 4px 0px;
            }
    
            .template .content {
                margin-top: 23px;
            }
    
            .template .content h6 {
                font-size: 23px;
                margin-bottom: 8px;
            }
    
            .template .content .btn a {
                background-color: black;
                padding: 8px 23px;
                border-radius: 10px;
                text-decoration: none;
                color: white;
            }
    
            .template .bottom {
                margin-top: 32px;
            }
    
            footer p, footer h2 {
                margin-bottom: 0px;
                margin-top: 0px;
            }
        </style>
    </head>
    
    <body>
        <div className="template">
            <h2>Payment Confirmation: </h2>
            <p>You have successfully made payment on SpellEng</p>
            <p>Order Id: ${orderId}</p>
            <p>Thank you for your purchase!</p>     
                <footer>
                <div className="bottom">
                    <h2>SpellEng</h2>
                </div>
            </footer>
            </div>
        </div>
    </body>
    
    </html>`
        ;
};

module.exports = Template;