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
                // job.data.token  these we used when we create reset token in controller as we already stored token in job 
            )
        default:
            throw new Error(`Unknown email: ${job.name}`);
    }

}