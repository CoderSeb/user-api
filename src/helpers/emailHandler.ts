import nodemailer from 'nodemailer'

export interface IEmailOptions {
  to: string
  subject: string
  html: string
}

export const sendEmail = async (mailOpt: IEmailOptions) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  const options = {
    from: process.env.EMAIL_FROM,
    to: mailOpt.to,
    subject: mailOpt.subject,
    html: mailOpt.html
  }
  transporter.sendMail(options, (err, info) => {
    if (err) {
      throw err
    }
    return
  })
}