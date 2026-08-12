import { sendOtp } from "../services/notification.service.js";

export async function processNotification(job) {
    switch (job.name) {
        case 'send-otp':
            return await sendOtp(job.data.phone,job.data.otp)
        case 'send-notification-msg':
            
            break;
    
        default:
            throw new Error(`Unknown SMS: ${job.name}`);
    }
}