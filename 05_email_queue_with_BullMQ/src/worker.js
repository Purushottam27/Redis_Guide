import { Worker } from "bullmq";
import { connection} from "./queue.js";


const emailWorker = new Worker(
    'emails',
    async (job) =>{
        // await sendEmail(
        //     job.data.to,
        //     job.data.name
        // )
        console.log(job.name,job.id,job.data)
        await new Promise(
            (resolve) => {
                setTimeout(resolve,1500)
            }
        )
    },
    connection
)

emailWorker.on('completed', (job)=>{
    console.log('Job completed',job.name,job.id,job.data);
})

emailWorker.on('failed', (job,err)=>{
    console.log('Job failed',err);
})