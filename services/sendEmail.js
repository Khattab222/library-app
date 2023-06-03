import nodemailer from 'nodemailer';

export const sendEmail =async ({to='', message='',subject=''}) => {
  

    let transporter = nodemailer.createTransport({
        host:'localhost',
        port:587,
        secure:false,
        service:'gmail',
        auth:{
            user:'khattabk205@gmail.com',
            pass:'sqkjawimlftydnli'
        }
    });

    let info = await transporter.sendMail({
        from: 'khattabk205@gmail.com',
        to,
        subject,
        html:message
    })
    if (info.accepted.length) {
        return true
    }
    return false
}
