const express = require("express");
const router = express();

const ScheduleController = require("../controllers/ScheduleController");
const { jwtAuthMiddleware } = require("../services/Passport");

router.get('/api/schedule', ScheduleController.getAllSchedules);
router.get('/api/schedule/available', ScheduleController.getAvailableSchedules);
router.post('/api/schedule', ScheduleController.createSchedule);

module.exports = router;
