'use strict';
module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        umkm_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        schedule_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
            defaultValue: 'pending',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'bookings',
    });

    Booking.associate = (models) => {
        Booking.belongsTo(models.Users, {
            foreignKey: 'umkm_id',
            as: 'umkm',
        });

        Booking.belongsTo(models.Schedule, {
            foreignKey: 'schedule_id',
            as: 'schedule',
        });
    };

    return Booking;
};
