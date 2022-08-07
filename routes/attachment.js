const attachmentController = require('../controllers/attachmentController');

module.exports = [
	{
		method : "GET",
		path : "/file/{id}",
		handler : attachmentController.viewAttachments,
		options: {
			tags: ["api", "File"],
			notes: "Endpoint to view or download attachment based on 'view' flag",
			description: "View and Download Attachment",
			auth: false,
			validate: {
				options: {
					abortEarly: false
				},
				query: {
					view: Joi.boolean().optional().default(true),
				},
				params: {
                    id: Joi.number().integer().required().error(errors=>{return Common.routeError(errors,'ATTACHMENT_ID_IS_REQUIRED')})
				},
				failAction: async (req, h, err) => {
					return Common.failureError(err, req);
				},
				validator: Joi
			},
			pre : [{method: Common.prefunction}]
		}
	},
    {
        method: "POST",
        path: "/file",
        handler: attachmentController.uploadFile,
		options: {
			tags: ["api", "File"],
			notes: "Endpoint to upload single/multiple attachments",
			description: "Upload attachment",
			auth: {strategy:'jwt'},
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
                payload: Joi.object({
                    files: Joi.any().meta({ swaggerType: 'file'}).required().description('Array of files or object'),
                }),
				validator: Joi
			},
            payload: {
                parse: true,
                timeout: 60000,
                multipart: true,
                output: "stream",
                maxBytes: 10000000
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
			pre : [{method: Common.prefunction}]
		}
    },
    {
		method: "DELETE",
		path: "/file",
		handler: attachmentController.deleteAttachments,
		options: {
			tags: ["api", "File"],
			notes: "Endpoint to delete single/multiple attachments by id",
			description: "Delete File",
			auth: {strategy:'jwt', scope:['admin','user','manage-attachment']},
			validate: {
                headers: Joi.object(Common.headers(true)).options({
					allowUnknown: true
				}),
				options: {
					abortEarly: false
				},
				query: {
                    attachmentIds: Joi.string().required().error(errors=>{return Common.routeError(errors,'ATTACHMENT_ID_IS/ARE_REQUIRED')})
				},
				failAction: async (req, h, err) => {
					return Common.failureError(err, req);
				},
				validator: Joi
			},
			pre : [{method: Common.prefunction}]
		}
	},
]