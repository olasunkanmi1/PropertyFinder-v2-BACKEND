import sendEmail from "./send-email.js"
import ejs from 'ejs'

const sendResetPasswordEmail = async ({name, email, passwordToken}) => {
    const origin = process.env.CORSORIGIN
    const firstName = name; 
    const resetUrl = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`

    const template = await ejs.renderFile('views/reset-password-email.ejs', { origin, firstName, resetUrl });

    return sendEmail({
        to: email,
        subject: 'Forgot Password',
        html: template
    })
}

export default sendResetPasswordEmail