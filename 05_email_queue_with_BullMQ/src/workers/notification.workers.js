import { Worker } from "bullmq";
import { redisConnection } from "../connection/redis.connection.js";
import { processNotification } from "../processors/notification.processors.js";

const notificationWorker = new Worker(
    'notifications',
    processNotification,
    {
        connection: redisConnection,
        concurrency:20
    }
)

notificationWorker.on('completed',(job)=>{
    console.log('Image processing is completed');
    
})

notificationWorker.on('failed',(job,err)=>{
    console.log('Image processing is failed',err);
    
})
