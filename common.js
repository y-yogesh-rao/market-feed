decrypt = (text) => {
  let decipher = crypto.createDecipheriv(
    process.env.ALGORITHM, 
    process.env.PRIVATE_KEY, 
    process.env.IV,
  );
  return decipher.update(text,"hex","utf8") + decipher.final("utf8");
}

encrypt = (text) => {
  let cipher = crypto.createCipheriv(
    process.env.ALGORITHM, 
    process.env.PRIVATE_KEY, 
    process.env.IV,
  );
  return cipher.update(text,"utf8","hex") + cipher.final("hex");
}

exports.signToken = (tokenData) => {
  return Jwt.sign({ 
    data: encrypt(JSON.stringify(tokenData))
  }, process.env.PRIVATE_KEY);
};

exports.prefunction = (req,h) => {
  global.utcOffset = req.headers.utcoffset;
  global.LanguageCodes = process.env.ALL_LANGUAGE_CODE.split(',');
  global.LanguageIds = process.env.ALL_LANGUAGE_ID.split(',').map((item) => parseInt(item,10));
  return true;
}

exports.routeError = (errors,message) => {
  errors.forEach(err=>{ 
    switch(err.code) {
      case "any.required":
        err.message=message;
        break;
      case "string.guid":
        err.message='PLEASE_ENTER_A_VALID_UUID';
        break;
      case "string.min":
        err.message=`MINIMUM_LENGTH_MUST_BE_${err.local.limit}`;
        break;
      case "string.max":
        err.message=`LENGTH_CANNOT_BE_GREATER_THAN_${err.local.limit}`;
        break;
    }
  });
  return errors
}

exports.axiosRequest = async (requestUrl,requestMethod,requestHeader,requestBody) => {
  try {
    let responseData;
    let requestObject = {
      url: requestUrl,
      headers: requestHeader,
      method: requestMethod.toLowerCase(),
    }
    requestObject = (requestMethod.toLowerCase() === 'get') ? {...requestObject,params:requestBody} : {...requestObject,data:requestBody}
    responseData = await Axios(requestObject);
    responseData = responseData.data;
    stringifiedResponse = JSON.stringify(responseData)
    return responseData
  } catch(error) {
    return error ? error?.message : 'AXIOS_REQUEST_FAILED';
  }
}

exports.validateToken = async (token) => {
  let tokenDetails = JSON.parse(decrypt(token.data));

  var timeDifference = Moment().diff(Moment(token.iat * 1000));
  if (timeDifference < 0) return { isValid: false };

  return {
    isValid: true,
    credentials: { userData: tokenDetails, scope: ['admin','user'] }
  };
};

exports.headers = (authorizationRequired) => {
	let globalHeaders = {
    utcoffset: Joi.string().optional().default(0),
    language: Joi.string().optional().default(process.env.DEFAULT_LANGUANGE_CODE),
  };
	if (authorizationRequired) _.assign(globalHeaders, { authorization: Joi.string().required().description("Authorization Token") });
	return globalHeaders;
};

exports.failureError = (err,req) => {
	let customMessages = {};
  const updatedError = err;
	updatedError.output.payload.message = [];
	if (err.isJoi && Array.isArray(err.details) && err.details.length > 0){
		err.details.forEach((error) => {
			customMessages[error.context.label] = req.i18n.__(error.message);
		});
	}
	delete updatedError.output.payload.validation;
	updatedError.output.payload.error =  req.i18n.__('BAD_REQUEST');
  if(err.details[0].type === 'string.email') {
    updatedError.output.payload.message = req.i18n.__(
      "PLEASE_ENTER_A_VALID_EMAIL"
    );
  } else if(err.details[0].type === 'any.required') {
    updatedError.output.payload.message = req.i18n.__(
      err.details[0].message
    );
  } else {
    updatedError.output.payload.message = req.i18n.__(
      "ERROR_WHILE_VALIDATING_REQUEST"
    );
  }
	updatedError.output.payload.errors = customMessages;
	return updatedError;
}

exports.getTotalPages = async (records, perpage) => {
  let totalPages = Math.ceil(records / perpage);
  return totalPages;
};