import Redis from "ioredis";

// create the subscriber same as publisher client

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

subscriber.subscribe(
    'notification',
    (err)=>{
        if(err){
            console.error('Failed to subscribe: ',err.message)
            return
        }
        console.log('Notification received successfully')
    }
)


subscriber.on('message',(channel,message)=>{
    console.log(`Recieved message: ${JSON.parse(message)} on channel: ${channel}`);
})

// If we have to create multiple subscriber then from line 5 to 21 repeates same process for another subscriber.