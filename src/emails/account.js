require('dotenv').config()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({  // this is promise
        to: email,
        from: process.env.EMAIL,
        subject: 'Thanks for joining',
        text: `Welcome to the app, ${name}. Let us know how we can help you`
    }).then(response => {
        //sent
    }).catch(error => {
        console.log(error)
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({  // this is promise
        to: email,
        from: process.env.EMAIL,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. We hope to see you soon.`
    }).then(response => {
        //sent
    }).catch(error => {
        console.log(error)
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}