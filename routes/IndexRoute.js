const express = require("express");
const router = express.Router();
const IndexRouter = require("../controllers/IndexController");
const DashboardController = require("../controllers/DashboardController");
const { jwtAuthMiddleware } = require("../services/Passport");

router.get('/', IndexRouter.index);
router.get('/api/test', IndexRouter.test);
router.get('/api/dashboard/admin', DashboardController.dashboardAdmin);
module.exports = router;
