const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "elvisduverge503@gmail.com",
        subject: "Thanks for joining us!",
        text: `Welcome to the app, ${name}. Let me know how I can help you with the app.`,
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "elvisduverge503@gmail.com",
        subject: "We're sad to see you leave",
        text: `Thanks for using our app, ${name}. Let me know why you left and how we can improve for the better`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

//SENDGRID APIKey
//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