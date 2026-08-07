import express from 'express'
import Redis from 'ioredis'

const app = express()

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

app.use(express.json())

// Now to store the otp in the store we have to create its key for that we are using these function

function otpKey(phone){
    return `otp:${phone}` // these is the key for otp
}


// generate the otp and store it in the redis for verification
app.post('/otp',async(req,res)=>{
    const {phone} = req.body;

    if(!phone){
        return res.status(401).json("Invalid mobile number")
    }

    // Now generate otp:
    const otp = Math.floor(10000 + Math.random()*90000).toString() // generated 6 digit otp and converted it into string formate

    const store = await redis.set(otpKey(phone),otp,'EX',30) 

    return res.status(201).json({status:store,otp:otp}) // in production send otp through SMS

})

// Now verify the otp send by the user with the otp we have stored

app.post('/otp/verify',async(req,res)=>{
    const {phone,otp} = req.body
    
    const storedOtp = await redis.get(otpKey(phone))

    if(!storedOtp){
        return res.status(400).json({message:"OTP is expired or not found"})
    }

    if(otp !== storedOtp){
        return res.status(400).json({message:"Invalid OTP"})
    }

    // when we verified the user then delete the otp from store 
    await redis.del(otpKey(phone))

    return res.status(200).json({message:"OTP verified successfully"})
})

app.get('/otp/:phone/ttl',async(req,res)=>{
    const {phone} = req.params

    const ttl = await redis.ttl(otpKey(phone))

    return res.status(200).json({expiryIn:ttl})
})

app.listen(3000,()=>{
    console.log('Server is running on http://localhost:3000')
})

// redis not only store the otp but also:
// otp: 432561,
// attempts: 0,
// maxAttempts: 3,
// createdAt: timestamp
// lastAttemptAt: timestamp,
// blockedUntil:timestamp  // optional

// these is the things that should be stored in the redis to handle otp with rate limiting