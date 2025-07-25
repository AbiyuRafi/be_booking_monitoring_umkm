'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        konsultan_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        date: { 
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: { 
            type: DataTypes.TIME,
            allowNull: false,
        },
        is_booked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        tableName: 'schedules',
        underscored: true,
    });

    Schedule.associate = (models) => {
        console.log('Associating Schedule' + JSON.stringify(models));
        Schedule.belongsTo(models.Users, {
            foreignKey: 'konsultan_id',
            as: 'konsultan',
        });

        Schedule.hasOne(models.Booking, {
            foreignKey: 'schedule_id',
            as: 'booking',
        });
    };

    return Schedule;
};
