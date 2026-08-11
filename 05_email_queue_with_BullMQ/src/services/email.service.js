import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }
})



export async function sendWelcomeEmail(email,name) {
    const emailHtml = `
        <h1>Welcome ${name}</h1>
        <p>Thanks for registering</p>
    `
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:`Welcome ${name}`,
        html:emailHtml
    })
}

// these 3 things are done in the controller file of forgot password
const resetToken = crypto.randomBytes(32).toString('hex')
// store it in redis and then in the queue
const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`

export async function sendPasswordResetEmail(email) { // (email,resetLink)
    const send = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your Password",

        html: `
            <h2>Password Reset Request</h2>

            <p>
                We received a request to reset your password.
            </p>

            <p>
                Click the button below to create a new password:
            </p>

            <a href="${resetLink}">
                Reset Password
            </a>

            <p>
                This link will expire in 15 minutes.
            </p>

            <p>
                If you did not request this, you can safely ignore this email.
            </p>
        `
    }); 
}