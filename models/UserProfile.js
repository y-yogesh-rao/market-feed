const Constants = require('../constants');

module.exports = (sequelize, DataTypes) => {
    let UserProfile = sequelize.define("UserProfile",
        {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, defaultValue: null },
            profileImageId: { type: DataTypes.INTEGER, defaultValue: null },
            status: { type: DataTypes.INTEGER, defaultValue: Constants.STATUS.ACTIVE },
        },
        {
            paranoid: true,
            underscored: true,
            tableName: "user_profiles"
        }
    );

    UserProfile.associate = (models) => {
        UserProfile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        UserProfile.belongsTo(models.Attachment, { foreignKey: 'profileImageId', as: 'profileImage' });
    }
    
    return UserProfile;
};  