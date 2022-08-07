exports.systemCheck = async (req,h) => {
    try {
        return h.response({success:true,message:req.i18n.__('SYSTEM_IS_UP_AND_RUNNING'),responseData:{}}).code(200);
    } catch (error) {
        console.log(error);
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}

exports.initializeSystem = async (req,h) => {
    const transaction = await Models.sequelize.transaction();
    try {
        // Code to initialize system
        const systemInitialized = await Models.User.findOne({});
        if(systemInitialized) {
            await transaction.rollback();
            return h.response({success:false,message:req.i18n.__('SYSTEM_ALREADY_INITIALIZED'),responseData:{}}).code(400);
        }

        const rounds = parseInt(process.env.HASH_ROUNDS);
        console.log(process.env.GLOBAL_ADMIN_PASSWORD,rounds)
        const globalAdminPassword = Bcrypt.hashSync(process.env.GLOBAL_ADMIN_PASSWORD,rounds);

        const createdUser = await Models.User.create({
            username: 'admin',
            lastLoggedIn: Moment(),
            password: globalAdminPassword,
            email: process.env.GLOBAL_ADMIN_EMAIL,
            userProfile: {
                firstName: 'Admin',
                lastName: 'Marketfeed',
            }
        },{include:[
            {model:Models.UserProfile,as:'userProfile'}
        ],transaction:transaction});

        await transaction.commit();
        return h.response({success:true,message:req.i18n.__('SYSTEM_INITIALIZED_SUCCESSFULLY'),responseData:{}}).code(200);
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}