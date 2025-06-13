import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://localhost:6379`
});

redisClient.on('errer', (err) => {
    console.error('❌ Redis Client Error:', err);
});

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log('✅ Redis connected');
        }
    } catch (error) {
        console.error('❌ Failed to connect to Redis:', error);
    }
}

export {
    redisClient, connectRedis
}