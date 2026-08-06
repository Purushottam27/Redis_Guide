import express from 'express'
import mongoose from 'mongoose'
import Redis from 'ioredis'

const app = express()

// Now we create a redis client and ye client hame jitni jagah share krna hai us hisab se client banta hai 

// it takes url as parameter
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
// redis://localhost:6379 ye wala url aya jo hamara docker compose  jo up hai usse connect hoga 
// Jab bhi ham docker compose se client create kre to isse tara se krna hai

// Redis se kese baat kre uske liye redis option deta hai ping krna ka
app.get('/redis',async(req,res)=>{
    const reply = await redis.ping()
    res.json({redis : reply})
})

// mongo db ke connection ke liye
app.get('/mongo',async(req,res)=>{
    const url = process.env.MONGO_URL || 'mongodb://localhost:27017/redis_DB'

    if(mongoose.connection.readyState === 0){
        await mongoose.connect(url)
    }

    res.json({mongo: "connected", database: mongoose.connection.name}) // database name
})

app.listen(3000,()=>{
    console.log('Server running on port 3000');
    
})