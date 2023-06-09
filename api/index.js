const express = require("express");
const router = express.Router();

// GET /api/health
router.get("/health", async (req, res) => {
  res.send({
    message: "Server is up and running.",
  });
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
const { getUserById } = require("../db");
router.use("/routine_activities", routineActivitiesRouter);

module.exports = router;
