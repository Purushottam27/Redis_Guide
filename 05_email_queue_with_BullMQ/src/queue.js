import {Queue} from 'bullmq'

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
}
const emailQueues = new Queue("emails",{connection})

// multiple queue can be possible:
const notificationQueues = new Queue('notifications', { connection })

const imageQueues = new Queue('image-processing', { connection })

export {connection,emailQueue}