import sgMail from '@sendgrid/mail';

const sendEmail = async ({ to, subject, html }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: {
        email: 'abdulsalamquadri999@gmail.com',
        name: 'Olasunkanmi from PropertyFinder'
      } ,
      subject,
      text: 'This is an example email',
      html
    };
    const info = await sgMail.send(msg);

    return info;
}

export default sendEmail