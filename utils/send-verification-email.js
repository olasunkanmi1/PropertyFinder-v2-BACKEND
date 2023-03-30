import sendEmail from "./send-email.js"

const sendVerificationEmail = async ({name, email, verificationToken}) => {
    const origin = 'http://localhost:3000'
    const verifyUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<h5>Let's confirm your email address.</h5> <p>By clicking on the button below, you are confirming your email address.</p> <button><a href="${verifyUrl}">Verify Email</a></button>`

    return sendEmail({
        to: email,
        subject: 'Welcome to PropertyFinder! Confirm Your Email',
        html: `<h4>Hello ${name},</h4> <br /> 
        ${message}
        `
    })
}

export default sendVerificationEmail