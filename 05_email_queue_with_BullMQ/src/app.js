import dotenv from 'dotenv'
import express from 'express'
import { emailQueue } from './queue/email.queue.js'
import { notificationQueue } from './queue/notification.queue.js'
import { imageQueue } from './queue/image.queue.js'
import redis from 'ioredis'

dotenv.config({
  path: "./.env",
})

const app = express()

app.use(express.json())

app.post('/email',async(req,res)=>{

    // Job 1
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

    // Job 2
    const resetToken = crypto.randomBytes(32).toString('hex')
    // store it in redis and then in the queue
    const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`
    const job = await emailQueue.add(
        'send-password-reset-email',
        {
            to:req.body.to
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

// function resetKey(token){
//     return `resetKey:${token}`
// }
app.post('/send-otp',async(req,res)=>{

    // Job 2
    const resetToken = crypto.randomBytes(32).toString('hex')

    // store it in redis
    await redis.set('resetKey',resetToken)

    const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`

    // push it in the queue
    const job = await emailQueue.add(
        'send-password-reset-email',
        {
            to:req.body.to,
            resetLink:resetLink
        },
        {   
            attempts: 3,
            backoff:{  
                type:'exponential',
                delay:1000
            }
        }
    )

    res.json({message:"Password reset email added in queue", JobID: job.id})
})

const otpKey = (phone)=>{
    return `otp:${phone}`
}

app.post('/notification/otp',async(req,res)=>{
    const phone = req.body.phone;

    const otp = Math.floor(10000 + Math.random()*90000).toString() 
    await redis.set(otpKey(phone),otp,'EX',300)

    const job = await notificationQueue.add(
        'send-otp',
        {
            phone:phone,
            otp:otp
        },
        {   
            attempts: 3, // these tells how many times should it retry
            backoff:{  // these tells how long should it wait between retries
                type:'exponential',
                delay:1000
            }
        }
    )
    res.json({
        message: 'OTP job added',
        jobId: job.id
    })
})

app.post('/notification-sms',async(req,res)=>{
    const phone = req.body.phone;

    const job = await notificationQueue.add(
        'send-notification-sms',
        {
            phone:phone
        },
        {   
            attempts: 3, // these tells how many times should it retry
            backoff:{  // these tells how long should it wait between retries
                type:'exponential',
                delay:1000
            }
        }
    )
    res.json({
        message: 'Notification job added in the queue',
        jobId: job.id
    })
})


app.listen(3000,()=>{
    console.log('Server is running on port http://localhost3000');
    
})

// BullMQ's Queue.add() creates a job and stores it in Redis, while a worker consumes jobs from that queue.