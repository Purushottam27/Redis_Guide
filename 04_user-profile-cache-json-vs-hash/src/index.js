import express, { json } from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// storing the user profile details in the obj formate in redis store: We see both the json and hash method

app.post('/user/:id/json',async(req,res)=>{
    const {userId} = req.params
    const userInfo = req.body

    if(!userInfo){
        return res.json("User details not found")
    }

    const user = await redis.set(`user:${userId}:json`,JSON.stringify(userInfo))

    return res.status(201).json({status:user, userDetails: userInfo})
})

app.get('/user/:id/json',async(req,res)=>{
    const {userId} = req.params
    const userDetails = await redis.get(`user:${userId}:json`)

    return res.status(200).json({status:"User details fetched successfully", userDetails: userDetails ? JSON.parse(userDetails) : null})
})

app.post('/user/:id/hash',async(req,res)=>{
    const {userId} = req.params
    const userInfo = req.body

    const user = await redis.hset(`user:${userId}:hash`, Object(userInfo))
    
    return res.status(201).json({status:user, userDetails: userInfo})
})

app.get('/user/:id/hash',async(req,res)=>{
    const {userId} = req.params
    const userDetails = await redis.hgetall(`user:${userId}:hash`)

    return res.status(200).json({status:"User details fetched successfully", userDetails: userDetails})
})

app.listen(3000,()=>{
    console.log("Server is running at http://localhost3000");
    
})