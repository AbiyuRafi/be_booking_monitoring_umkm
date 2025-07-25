const express = require("express");
const router = express();

const BookingController = require("../controllers/BookingController");
const { jwtAuthMiddleware } = require("../services/Passport");

router.get('/api/bookings', BookingController.getAllBookings);
router.get('/api/bookings/konsultan', jwtAuthMiddleware(), BookingController.getBookingsForCurrentKonsultan)
router.post('/api/bookings',  jwtAuthMiddleware(), BookingController.createBooking);

module.exports = router;