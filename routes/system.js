const systemController = require('../controllers/systemController');

module.exports = [
	{
        method: "GET",
        path: "/",
        handler: systemController.systemCheck,
		options: {
			tags: ["api", "System"],
			notes: "Endpoint to check if the server is up and running",
			description: "System Check",
			auth: false,
			validate: {
				headers: Joi.object(Common.headers(false)).options({
					allowUnknown: true
				}),
				options: {
					abortEarly: false
				},
				failAction: async (req, h, err) => {
					return Common.failureError(err, req);
				},
                query: {
                },
				validator: Joi
			},
			pre : [{method: Common.prefunction}]
		}
    },
    {
        method: "GET",
        path: "/system/initialize",
        handler: systemController.initializeSystem,
		options: {
			tags: ["api", "System"],
			notes: "Endpoint to initlaize system",
			description: "Initialize System",
			auth: false,
			validate: {
				options: {
					abortEarly: false
				},
				failAction: async (req, h, err) => {
					return Common.failureError(err, req);
				},
                query: {
                },
				validator: Joi
			},
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
			pre : [{method: Common.prefunction}]
		}
    },
]