const formatUserResponseData = (user) => {
    let tokenData = {
        hasFullAccess: Constants.STATUS.ACTIVE,
        user: {
            email: user.email,
            password: user.password,
            username: user.username,
            status: user.status
        },
        userProfile: {
            lastName: user.userProfile.lastName,
            firstName: user.userProfile.firstName,
            profileImage: user.userProfile.profileImage, 
            profileImageId: user.userProfile.profileImageId,
        }
    }
    let token = Common.signToken(tokenData);
    return {...tokenData, token};
}

exports.login = async (req,h) => {
    try {
        const { email, password } = req.payload;

        let _requiredUserFields = Constants.MODEL_FIELDS.USER;
        _requiredUserFields.push('password');

        _requiredAttachmentFields = Constants.MODEL_FIELDS.ATTACHMENT;
        _requiredUserProfileFields = Constants.MODEL_FIELDS.USER_PROFILE;

        const userExists = await Models.User.findOne({where:{email},attributes:_requiredUserFields,include:[
            {model:Models.UserProfile,as:'userProfile',attributes:_requiredUserProfileFields,include:[
                {model:Models.Attachment,as:'profileImage',attributes:_requiredAttachmentFields}
            ]}
        ]});
        if(!userExists) {
            return h.response({success:false,message:req.i18n.__('USER_DOESNT_EXIST'),responseData:{}}).code(401);
        }

        if(userExists.status === Constants.STATUS.INACTIVE) {
            return h.response({success:false,message:req.i18n.__('USER_BLOCKED_BY_ADMIN'),responseData:{}}).code(401);
        }

        const verificationSucessful = Bcrypt.compareSync(password,userExists.password);
        if(!verificationSucessful) {
            return h.response({success:false,message:req.i18n.__('AUTHENTICATION_FAILED'),responseData:{}}).code(401);
        }

        userExists.dataValues.password = '*'.repeat(password.length);
        const responseData = formatUserResponseData(userExists);

        return h.response({success:true,message:req.i18n.__('AUTHENTICATION_SUCCESSFUL'),responseData:responseData}).code(200);
    } catch(error) {
        console.log(error);
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}