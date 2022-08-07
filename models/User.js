const Constants = require('../constants');

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define("User",
        {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            password: { type: DataTypes.STRING, allowNull: false },
            username: { type: DataTypes.STRING, defaultValue: null },
            lastLoggedIn: { type: DataTypes.DATE, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            status: { type: DataTypes.INTEGER, defaultValue: Constants.STATUS.ACTIVE },
        },
        {
            paranoid: true,
            underscored: true,
            tableName: "users"
        }
    );

    User.associate = (models) => {
        User.hasOne(models.UserProfile, { foreignKey: 'userId', as: 'userProfile' });
    }
    
    return User;
};  