const userController = require('../controllers/userController');

module.exports = [
    {
        method: "POST",
        path: "/user/login",
        handler: userController.login,
		options: {
			tags: ["api", "User"],
			notes: "Endpoint to login",
			description: "Login",
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
                payload: {
                    password: Joi.string().example('<PASSWORD>').required().error(errors=>{return Common.routeError(errors,'PASSWORD_IS_REQUIRED')}),
                    email: Joi.string().email().example('abc@xyz.com').required().error(errors=>{return Common.routeError(errors,'EMAIL_IS_REQUIRED')}),
                },
				validator: Joi
			},
			pre : [{method: Common.prefunction}]
		}
    },
];