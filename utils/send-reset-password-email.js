import sendEmail from "./send-email.js"

const sendResetPasswordEmail = async ({name, email, passwordToken}) => {
    const origin = 'http://localhost:3000'
    const resetUrl = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`
    const message = `<p>We received a request to change the password to your PropertyFinder account. You can reset your password by clicking the button below.</p> <br /> This reset link expires in 10 minutes <br /> <button style="background-color: #0847A8; padding: 10px; border-radius: 5px; color: #ffffff; text-decoration: none; font-size: 20px;"><a href="${resetUrl}" style="color: #ffffff; text-decoration: none; font-size: 20px;">Reset Password</a></button>`

    return sendEmail({
        to: email,
        subject: 'Forgot Password',
        html: `<h4>Hello ${name},</h4> <br /> 
        ${message}
        `
    })
}

export default sendResetPasswordEmail