const taskController = require('../controllers/taskController');

module.exports = [
    {
        method: "GET",
        path: "/task/repository/popular",
        handler: taskController.getPopularRepository,
		options: {
			tags: ["api", "Task"],
			notes: "Endpoint to get popular repositories based on stars and forks",
			description: "Popular Repositories",
			auth: { strategy:'jwt', scope: ['admin','user'] },
			validate: {
				headers: Joi.object(Common.headers(true)).options({
					allowUnknown: true
				}),
				options: {
					abortEarly: false
				},
				failAction: async (req, h, err) => {
					return Common.failureError(err, req);
				},
                query: {
					orderParameter: Joi.string().valid('asc','desc').optional().default('desc'),
					sortParameter: Joi.string().valid('forks','stars').optional().default('forks'),
					organization: Joi.string().required().error(errors=>{return Common.routeError(errors,'ORGANIZATION_IS_REQUIRED')}),
					m: Joi.number().integer().min(1).max(100).required().error(errors=>{return Common.routeError(errors,'NUMBER_OF_COMITTEES_IS_REQUIRED')}),
					n: Joi.number().integer().min(1).max(100).required().error(errors=>{return Common.routeError(errors,'NUMBER_OF_POPULAR_REPOSITORIES_IS_REQUIRED')}),
                },
				validator: Joi
			},
			pre : [{method: Common.prefunction}]
		}
    },
];