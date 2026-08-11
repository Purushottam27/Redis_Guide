import express from 'express'
import { emailQueue } from './queue/email.queue.js'
import { notificationQueue } from './queue/notification.queue.js'
import { imageQueue } from './queue/image.queue.js'


const app = express()

app.use(express.json())

app.post('/email',async(req,res)=>{

    const job = await emailQueue.add(
        'send-welcome-email',
        {
            to:req.body.to,
            name:req.body.name
        },
        {   
            attempts: 3, // these tells how many times should it retry
            backoff:{  // these tells how long should it wait between retries
                type:'exponential',
                delay:1000
            }
        }
    )
    res.json({message:"Welcome email added in queue", JobID: job.id})
})

app.post('/notification',async(req,res)=>{

    const job = await notificationQueue.add(
        'wake-up-notification',
        {
            userId:req.body.userId,
            message:req.body.message
        },
        
    )
    res.json({
        message: 'Notification job added',
        jobId: job.id
    })
})

app.post('/image',async(req,res)=>{

    const job = await imageQueue.add(
        'resize-image',
        {
            imgUrl: req.body.imgUrl
        }
    )
    res.json({message:"Image job added successfully", JobID: job.id})
})


app.listen(3000,()=>{
    console.log('Server is running on port http://localhost3000');
    
})

// BullMQ's Queue.add() creates a job and stores it in Redis, while a worker consumes jobs from that queue.