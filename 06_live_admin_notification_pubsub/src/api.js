import express from 'express'
import Redis from 'ioredis'

const app = express()

app.use(express.json())

// Now we create a publisher client

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// creating a api endpoint

app.post('/notification',async(req,res)=>{
    const payload = {
        title: req.body.title,
        message: req.body.message,
        createdAt: new Date().toISOString()
    }

    const receiver = await publisher.publish(   // through publish method we have send  message to the channel
        'notification',  // channel
        JSON.stringify(payload) // message
    )

    return res.json({message:`Notification send to ${receiver} subscribers`})
})

app.listen(3000,()=>{
    console.log('Server is running at port http://localhost3000');
    
})