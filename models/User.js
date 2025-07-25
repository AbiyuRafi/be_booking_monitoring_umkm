'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Users = sequelize.define('Users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('umkm', 'konsultan', 'admin'),
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: true,
    });

    Users.associate = (models) => {
        Users.hasMany(models.Schedule, {
            foreignKey: 'konsultan_id',
            as: 'schedules',
        });
    };


    return Users;
};
