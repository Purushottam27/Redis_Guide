import {Queue} from 'bullmq'
import { redisConnection } from '../connection/redis.connection.js'

// const connection = {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: process.env.REDIS_PORT || 6379
// }

const notificationQueue = new Queue('notifications',{connection:redisConnection})


export {notificationQueue}