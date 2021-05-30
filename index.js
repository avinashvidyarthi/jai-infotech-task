// server setup
require('dotenv').config();
const express = require('express');
const activitiesRoutes = require('./routes/activities');
const { connectToRedis } = require('./utils/redis');
const port = process.env.PORT || 3000;
const app = express();


// middlewares
app.use(express.json());
app.use('/activity/', activitiesRoutes);


// connect to redis & start server
connectToRedis()
	.then(() => {
		console.log('Connected to Redis');
		app.listen(port, () => {
			console.log('App listening to port:', port);
		});
	})
	.catch((err) => {
		console.log('Error connecting to redis', err);
		console.log(
			"Didn't started express server because app is not connected to redis"
		);
	});
