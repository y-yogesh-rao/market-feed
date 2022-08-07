const { Readable } = require('stream');
const extensions = require('../extensions');

/* Create directory structure */
const createFolderIfNotExists = () => {
    const dt = new Date();
    const folder = dt.getUTCFullYear() + "/" + dt.getUTCMonth() + "/" +  dt.getUTCDate() + '/';
    const targetDir = 'resources/attachments/' + folder;
    Fs.mkdirSync(targetDir, { recursive: true }, 0o777);
    return targetDir
}

 /* Check file is array or object and call respective functions */
const uploader = (file,options) => {
    return Array.isArray(file) ? filesHandler(file,options) : fileHandler(file,options);
}

/* Function to upload multiple files */
const filesHandler = (files,options) => {
    const promises = files.map(x => fileHandler(x,options));
    return Promise.all(promises);
}

/* Unlink file from path */
const unlinkFile = (path) => {
    Fs.unlink(path, (err) => {
        if (err) {
            console.error(err)
            return
        }      
    })
}

/* Function to upload single file */
const fileHandler = async (file,options) => {
    if (!file.hapi.filename) throw new Error(422);
    const extension = Path.extname(file.hapi.filename);
    const name = uuid.v1() + extension;
    const destinationPath = `${options.dest}${name}`;
    const fileStream = await Fs.createWriteStream(destinationPath);
    
    return new Promise((resolve, reject) => {
        file.on('error', (err) => {
            reject(err);
        });
        file.pipe(fileStream);
        file.on('end', async (err) => {
            console.log('file upload ended');
            setTimeout(() => {
                const { size } = Fs.statSync(destinationPath);
                const kb = Math.ceil(size / 1000);
                const fileDetails = {
                    size: kb,
                    uniqueName: name,
                    extension: extension,
                    path: destinationPath,
                    userId: options.userId,
                    inUse: Constants.STATUS.INACTIVE,
                    originalName: file?.hapi?.filename,
                }
                resolve(fileDetails);
            }, 100); 
        });
    });
}

/* Upload attachment */
exports.uploadFile = async (req,h) => {
    try {
        const userId = req.auth.credentials.userData.user.id;
        if (req.payload && req.payload['files']) {
            const path = createFolderIfNotExists();
            const uploadInfo = {dest:path,userId:userId};

            let fileDetails = await uploader(req.payload['files'], uploadInfo);
            if(Array.isArray(fileDetails)) {
                fileDetails = fileDetails.map(fileDetail => {return {...fileDetail}});
            }
            if ((fileDetails && fileDetails.hasOwnProperty('uniqueName')) || (Array.isArray(fileDetails) && fileDetails && fileDetails.length)) {
                fileDetails = Array.isArray(fileDetails) ? fileDetails : [ fileDetails ]; 

                let responseData = await Models.Attachment.bulkCreate(fileDetails, { returning: true });
                return h.response({success:true,message:req.i18n.__("FILE_UPLOADED_SUCCESSFULLY"),data:responseData}).code(200);
            }
        }
    } catch(error) {
        console.log(error);
        if (error.message == 422) return h.response({success:false,message:req.i18n.__('SELECT_FILE_TO_UPLOAD'),responseData:{}}).code(422);
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}

/*  Delete attachment */
exports.deleteAttachments = async (req,h) => {
    try {
        const attachmentIds = req.query.attachmentIds;
        const _requiredAttachmentFields = Constants.MODEL_FIELDS.ATTACHMENT;

        const attachmentIdsArray = attachmentIds.split(',');
        const attachmentArray = await Models.Attachment.findAll({where:{id:attachmentIdsArray},attributes:_requiredAttachmentFields});
        attachmentArray.forEach( async (data) => {
            unlinkFile(data.path);
            await Models.Attachment.destroy({where:{id:data.id}});
        });
        if (attachmentArray.length) {
            return h.response({success:true,message:req.i18n.__("FILE_DELETED_SUCCESSFULLY"),data:{}}).code(200);
        } else {
            return h.response({success:false,message:req.i18n.__('FILE_NOT_FOUND'),responseData:{}}).code(404);
        }
    } catch (error)  {
        console.log(error);
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}

/* View and download attachment */
exports.viewAttachments = async (req,h) => {
    try {
        const attachmentId = req.params.id;

        const _requiredAttachmentFields = Constants.MODEL_FIELDS.ATTACHMENT;

        const attachmentExists = await Models.Attachment.findOne({where:{id:attachmentId},attributes:_requiredAttachmentFields});
        if (attachmentExists) {
            if (attachmentExists.path && attachmentExists.uniqueName) {
                const stream = Fs.createReadStream(attachmentExists.path);
                const streamData = new Readable().wrap(stream);
                const contentType = extensions.getContentType(attachmentExists.extension);
                if(!req.query.view) {
                    return h.response(streamData)
                        .header('Content-Type', contentType)
                        .header('Content-Disposition', 'attachmen; filename= ' + attachmentExists.uniqueName);              
                } else {
                    return h.response({success:true,message:req.i18n.__('REQUEST_SUCCESSFUL'),data:attachmentExists}).code(200)
                }
            }
        } else {
            return h.response({success:false,message:req.i18n.__('FILE_NOT_FOUND'),responseData:{}}).code(404);
        }
    } catch (error) {
        console.log(error);
        return h.response({success:false,message:req.i18n.__('SOMETHING_WENT_WRONG'),responseData:{}}).code(500);
    }
}