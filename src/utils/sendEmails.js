import nodemailer from 'nodemailer'
 export const sendEmail= async ({to , subject , html ,attachments })=>{
    //sender 
    const transporter =  nodemailer.createTransport({
        host : 'localhost',
        port :465,
        secure:true,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass:process.env.EMAILPASS
        }
    })



    //Reciever
    const emailInfo = await transporter.sendMail({
        from: `"E-commerce project" <${process.env.EMAIL}>`,
        to,
        subject,
        html,
        attachments,
    })
    return emailInfo.accepted.length < 1 ? false : true 
}

