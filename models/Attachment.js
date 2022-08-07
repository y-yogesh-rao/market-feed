const Constants = require('../constants');

module.exports = (sequelize, DataTypes) => {
    let Attachment = sequelize.define("Attachment",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            path: { type: DataTypes.STRING, defaultValue: null },
            size: { type: DataTypes.INTEGER, defaultValue: null },
            userId: { type: DataTypes.INTEGER, defaultValue: null },
            uniqueName: { type: DataTypes.STRING, allowNull: false },
            extension: { type: DataTypes.STRING, defaultValue: null },
            originalName: { type: DataTypes.STRING, defaultValue: null },
            inUse: { type: DataTypes.INTEGER, defaultValue: Constants.STATUS.ACTIVE },
        },
        {
            paranoid: true,
            underscored: true,
            tableName: "attachments"
        }
    );

    Attachment.associate = (models) => {
    };

    return Attachment;
}