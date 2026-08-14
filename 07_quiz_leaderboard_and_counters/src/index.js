import express from 'express'
import Redis from 'ioredis'

const app = express()

app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

app.post('/post',async(req,res)=>{
    const {id,title,desc,views} = req.body;
    if(!id || !title || !desc){
        return res.json('All field required')
    }
    const postDetail = {
        _id:id,
        title: title,
        desc: desc,
        views:views || 0
    }
    const post = await redis.hset(`post:${id}`,postDetail)

    return res.status(201).json({status:post, postDetails: postDetail})
})

// increment view count of a post
app.post('/post/:id/view',async(req,res)=>{
    const {id} = req.params;

    const views = await redis.hincrby(`post:${id}`,"views",1)
    const postDetail = await redis.hgetall(`post:${id}`)

    return res.status(201).json({views: views,postDetail})

    // as these is a hset so we have used the hincrby but if it is a single var then we use incr("name of var")
})

app.post('/user',async(req,res)=>{
    const {id,score} = req.body;

    if(!id || !score){
        return res.json('All field required')
    }

    // zadd creates a sorted set we cannot use the hset here 
    // in these there is one single key used and increment as well as data(user) changes
    const userDetail = await redis.zadd(`user`,score,`user:${id}`)

    return res.status(201).json({userDetail: userDetail})
})

//add points to user score
app.post('/user/leaderboard/score',async(req,res)=>{
    const {id,score} = req.body

    // to increament the sorted set user score val we use zincrby(key,val to incr,user whose val to incr)
    const userScore = await redis.zincrby(`user`,score,`user:${id}`)

    return res.status(201).json({userScore: userScore})
})

//get top 10 leaders
app.get('/user/leaderboard',async(req,res)=>{
    const leaders = await redis.zrevrange(`user`,0,9,"WITHSCORES")

    return res.status(201).json({leaders:leaders})
})

//get a rank of user
app.get('/user/leaderboard/:userId/rank',async(req,res)=>{
    const {userId} = req.params
    const rank  = await redis.zrevrank('user',`user:${userId}`)
    return res.status(201).json({rank:rank+1})
})


app.listen(3000,()=>{
    console.log('Serevr is running on port 3000');
    
})