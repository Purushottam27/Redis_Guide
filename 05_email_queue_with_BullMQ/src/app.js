import express from 'express'
import { emailQueue } from './queue.js'

const app = express()

app.use(express.json())

app.post('/email',async(req,res)=>{
    // these is how we add the job in the queue using add() and these return the promise 
    const job = await emailQueue.add(
        'send-welcome-email',
        {
            to:req.body.to,
            name:req.body.name
        },
        {   // 
            attempts: 3, // these tells how many times should it retry
            backoff:{  // these tells how long should it wait between retries
                type:'exponential',
                delay:1000
            }
        }
    )

    res.json({message:"Welcome email added in queue", JobID: job.id})
})

app.listen(3000,()=>{
    console.log('Server is running on port http://localhost3000');
    
})

// BullMQ's Queue.add() creates a job and stores it in Redis, while a worker consumes jobs from that queue.