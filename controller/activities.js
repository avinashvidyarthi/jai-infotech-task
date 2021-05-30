const queryString = require('query-string');
const fetch = require('node-fetch');
const { getItem, setItem } = require('../utils/redis');

/**
 * @function
 * @name search
 * @param {Request} req
 * @param {Response} res
 * @description This function is used to handle the http req for search activities
 */
const search = async (req, res) => {
	console.log('Search Called...');
	try {
		const query = queryString.stringify(req.query);
		const redisResult = await getItem(query);
		if (redisResult === null) {
			console.log('Not Found In Redis');
			const url = 'https://sandbox.musement.com/api/v3/activities?' + query;
			const options = {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Accept-Language': 'en-US',
					'X-Musement-Currency': 'USD',
				},
			};

			const fetchResult = await fetch(url, options);
			const data = await fetchResult.json();
			await setItem(query, JSON.stringify(data));
			res.status(200).json(data);
		} else {
			console.log('Found In Redis');
			res.status(200).json(JSON.parse(redisResult));
		}
	} catch (error) {
        res.status(503).json(error);
    }
};

module.exports = {
	search,
};
