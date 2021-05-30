const redis = require('redis');
let redisClient;

/**
 * @function
 * @name connectToRedis
 * @param {Request} none
 * @param {Response} Promise
 * @description This function is used to connect to redis db and flush the db
 */
const connectToRedis = () => {
	return new Promise((resolve, reject) => {
		redisClient = redis.createClient({
			port: process.env.REDIS_PORT,
			host: process.env.REDIS_HOST,
			password: process.env.REDIS_PASSWORD,
		});
		redisClient.on('ready', () => {
			redisClient.flushdb((err, result) => {
				if (err) reject(err);
				resolve();
			});
		});
		redisClient.on('error', (error) => {
			reject(error);
		});
	});
};

/**
 * @function
 * @name setItem
 * @param {Request} (key, value)
 * @param {Response} Promise
 * @description This function is used to set an item to redis with expiry of 30 minute
 */
const setItem = (key, value) => {
	return new Promise((resolve) => {
		redisClient.set(key, value, 'EX', 1800, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

/**
 * @function
 * @name setItem
 * @param {Request} (key)
 * @param {Response} Promise
 * @description This function is used to get an item to redis
 */
const getItem = (key) => {
	return new Promise((resolve) => {
		redisClient.get(key, (err, data) => {
			if (err) reject(err);
			resolve(data);
		});
	});
};

module.exports = {
	redisClient,
	connectToRedis,
	setItem,
	getItem,
};
