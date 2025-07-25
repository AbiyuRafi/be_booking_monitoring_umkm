const { Booking, Users } = require('../models/Index');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const moment = require('moment');


class DashboardController {

    async dashboardAdmin(req, res) 
    {
        try {
            const totalUmkm = await Users.count({ where: { role: 'umkm' } });
            const totalKonsultan = await Users.count({ where: { role: 'konsultan' } });

            const now = moment();
            const startOfWeek = now.clone().startOf('week').toDate();  
            const startOfMonth = now.clone().startOf('month').toDate();

            const weeklyBookings = await Booking.count({
            where: {
                createdAt: {
                [Op.gte]: startOfWeek,
                },
            },
            });

            const monthlyBookings = await Booking.count({
            where: {
                createdAt: {
                [Op.gte]: startOfMonth,
                },
            },
            });

            return res.status(200).json({
            umkm: totalUmkm,
            konsultan: totalKonsultan,
            booking: {
                weekly: weeklyBookings,
                monthly: monthlyBookings,
            },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

}

module.exports = new DashboardController();
