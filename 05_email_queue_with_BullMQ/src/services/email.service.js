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


export async function sendPasswordResetEmail(email,resetLink) { // 
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
    // So when user click the reset link then the user is redirected to the resetLink url where we can first verify the user with the reset token and then show the new password and confirm password field after that when user clcik submit then it again redirect to the post route of same url which again verify the token first and then update the password in the DB. 
}