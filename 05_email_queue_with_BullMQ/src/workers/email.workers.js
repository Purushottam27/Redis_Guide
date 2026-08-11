import { Worker } from "bullmq";
import { redisConnection } from "../connection/redis.connection";
import { processEmail } from "../processors/email.processors";

const emailWorker = new Worker(
    'emails',
    processEmail,
    {
        connection:redisConnection,
        concurrency:10,
    }
)

emailWorker.on('completed', (job)=>{
    console.log('Job completed',job.name,job.id,job.data);
})

emailWorker.on('failed', (job,err)=>{
    console.log('Job failed',err);
})

emailWorker.on('active',(job)=>{
    console.log('Job is active',job.name,job.id,job.data);
})

emailWorker.on('error',(err)=>{
    console.log('Job failed',err.message);
})