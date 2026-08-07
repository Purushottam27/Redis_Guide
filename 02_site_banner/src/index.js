import express from 'express'
import Redis from 'ioredis'

const app = express()

// created redis client 
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// middleware to read the json input 
app.use(express.json())

// Now we are see how we can interact with the redis: We are storing the site banner in the redis data store, as redis store the data in key-val pair we create a key for the banner

const BANNER_KEY = "app:banner"

// 1. Storing data in redis : creating the endpoint which store data in the redis 

app.post('/banner', async(req,res)=>{
    const message = req.body?.message

    if(!message){
        res.json("Banner message required")
    }

    const banner = await redis.set(BANNER_KEY,message || "Welcome to the redis",'EX',3600) // it returns ok

    if(!banner){
        res.json("Something went wrong while storing the banner msg in redis")
    }

    return res.status(201).json({banner:banner,msg:message})
})

// 2. Now to get the data from the redis store

app.get('/banner',async(req,res)=>{
    const banner = await redis.get(BANNER_KEY) || "Welcome to the redis"

    if(!banner){
        res.json("Banner not found")
    }

    return res.status(200).json({banner:banner,msg:'Banner fetched successfully'})
})

// 3. Check wether the banner exist in the store or not

app.get('/banner/exists',async(req,res)=>{
    const exists = await redis.exists(BANNER_KEY)
    
    return res.status(200).json({bannerStatus:exists,status:Boolean(exists)})
})

// 4. Delete the banner from the redis store

app.delete('/banner',async(req,res)=>{
    const banner = await redis.del(BANNER_KEY)
    return res.status(200).json({banner:banner,msg:'Banner deleted successfully'})
})


app.listen(3000,()=>{
    console.log('Server running on port 3000');
})



// In production the workflow is something like that :
// Create a simple Banner MongoDB model and implement this flow:

// GET /banner
// 1. Check Redis.
// 2. If found → return it (Cache Hit).
// 3. If not found → fetch from MongoDB (Cache Miss), store it in Redis with a TTL, then return it.

// PUT /banner
// Update MongoDB first.
// Then either:
// delete the Redis key (DEL), or
// update the Redis value (SET).