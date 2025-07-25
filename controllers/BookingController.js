const { Booking, Schedule, Users } = require('../models/Index');
const { v4: uuidv4 } = require('uuid');

class BookingController {
    async createBooking(req, res) {
        const umkm_id = req.user.id;
        const { schedule_id } = req.body;

        try {
            const schedule = await Schedule.findByPk(schedule_id);
            if (!schedule) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Schedule not found',
                });
            }

            if (schedule.is_booked) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Schedule has already been booked',
                });
            }

            const booking = await Booking.create({
                id: uuidv4(),
                umkm_id,
                schedule_id,
                status: 'pending',
            });

            await schedule.update({ is_booked: true });

            return res.status(201).json({
                status: 'success',
                message: 'Booking created successfully',
                data: booking,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to create booking',
                error: error.message,
            });
        }
    }

    async getBookingsForCurrentKonsultan(req, res) {
        try {
            const konsultanId = req.user.id;

            const bookings = await Booking.findAll({
                include: [
                    {
                        model: Schedule,
                        as: 'schedule',
                        where: { konsultan_id: konsultanId },
                        include: [
                            {
                                model: Users,
                                as: 'konsultan',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        model: Users,
                        as: 'umkm',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return res.json({
                status: 'success',
                data: bookings,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to fetch bookings',
                error: error.message,
            });
        }
    }


    async getAllBookings(req, res) 
    {
        try {
            const bookings = await Booking.findAll({
                include: [
                    {
                        model: Schedule,
                        as: 'schedule',
                        attributes: ['date', 'time'],
                    },
                    {
                        model: Users,
                        as: 'umkm',
                        attributes: ['id', 'name', 'email'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return res.status(200).json({
                status: 'success',
                message: 'All bookings retrieved successfully',
                data: bookings,
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve bookings',
                error: error.message,
            });
        }
    }


}

module.exports = new BookingController();