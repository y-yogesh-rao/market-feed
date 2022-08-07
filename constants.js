module.exports = {
    STATUS: {
        ACTIVE: 1,
        INACTIVE: 0
    },
    MODEL_FIELDS: {
        USER: ['id','username','email','status'],
        USER_PROFILE: ['id','userId','profileImageId','firstName','lastName'],
        ATTACHMENT: ['id','path','uniqueName','originalName','extension','size']
    }
}