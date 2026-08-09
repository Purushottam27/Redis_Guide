import {Queue} from 'bullmq'

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
}
const emailQueue = new Queue("emails",{connection})

// multiple queue can be possible:
const notificationQueue = new Queue('notifications', { connection })

const imageQueue = new Queue('image-processing', { connection })

export {connection,emailQueue}