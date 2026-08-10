import {Queue} from 'bullmq'
import { redisConnection } from '../connection/redis.connection.js'

// const connection = {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: Number(process.env.REDIS_PORT) || 6379,
//     password: process.env.REDIS_PASSWORD
// }
const emailQueue = new Queue("emails",{connection:redisConnection})


export {emailQueue}