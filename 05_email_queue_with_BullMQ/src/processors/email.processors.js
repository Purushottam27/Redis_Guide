import { sendPasswordResetEmail, sendWelcomeEmail } from "../services/email.service.js"

export async function processEmail(job){

    switch(job.name){
        case 'send-welcome-email':
            return await sendWelcomeEmail(
                job.data.to,
                job.data.name
            )
        case 'send-password-reset-email':
            return await sendPasswordResetEmail(
                job.data.to,
                job.data.resetLink
            )
        default:
            throw new Error(`Unknown email: ${job.name}`);
    }

}