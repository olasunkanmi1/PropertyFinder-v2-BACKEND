import sendEmail from "./send-email.js"

const sendVerificationEmail = async ({name, email, verificationToken}) => {
    const origin = process.env.CORSORIGIN
    const verifyUrl = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<h5>Let's confirm your email address.</h5> <p>By clicking on the button below, you are confirming your email address.</p> <button style="background-color: #0847A8; padding: 10px; border-radius: 5px; color: #ffffff; text-decoration: none; font-size: 20px;"><a href="${verifyUrl}" style="color: #ffffff; text-decoration: none; font-size: 20px;">Verify Email</a></button>`

    return sendEmail({
        to: email,
        subject: 'Welcome to PropertyFinder! Confirm Your Email',
        html: `<h4>Hello ${name},</h4> <br /> 
        ${message}
        `
    })
}

export default sendVerificationEmail