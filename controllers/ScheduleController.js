const db = require('../models/Index');
const Schedule = db.Schedule;
const Users = db.Users;


class ScheduleController {
    async createSchedule(req, res) {
        const { date, time, konsultan_id } = req.body;
        const schedule = await db.Schedule.create({
            konsultan_id: konsultan_id,
            date,
            time,
            is_booked: false,
        });

        return res.status(201).json({
            status: 'success',
            message: 'Schedule created successfully',
            schedule,
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create schedule',
            error: err.message,
        });
    }

    async getAllSchedules(req, res) {
    try {
      const schedules = await db.Schedule.findAll({
        include: [
          {
            model: db.Users,
            as: 'konsultan', 
            attributes: ['id', 'name', 'email'], 
          },
        ],
        order: [['date', 'ASC'], ['time', 'ASC']],
      });

      return res.status(200).json({
        status: 'success',
        message: 'All schedules retrieved successfully',
        data: schedules,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve schedules',
        error: error.message,
      });
    }
  }

  async getAvailableSchedules(req, res) {
    try {
        const schedules = await Schedule.findAll({
            where: {
                is_booked: false
            },
            include: [
                {
                    model: Users,
                    as: "konsultan",
                    attributes: ["id", "name", "email"]
                }
            ],
            order: [["date", "ASC"], ["time", "ASC"]]
        });

        return res.status(200).json({
            status: "success",
            message: "Available schedules retrieved successfully",
            data: schedules
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to retrieve schedules",
            error: error.message
        });
    }
}
}

module.exports = new ScheduleController();


