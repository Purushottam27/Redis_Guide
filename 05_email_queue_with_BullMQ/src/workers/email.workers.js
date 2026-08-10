import { Worker } from "bullmq";
import { redisConnection } from "../connection/redis.connection";
import { welcomeEmail } from "../processors/email.processors";

const emailWorker = new Worker(
    'emails',
    // async(job) =>{
    //     console.log(`${job.name} is processing.....`)

    //     await new Promise((resolve, reject) => {
    //         setTimeout(resolve,1500)
    //     })
    // },
    welcomeEmail,
    {
        connection:redisConnection,
        concurrency:5,
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