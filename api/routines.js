const express = require("express");
const loggedIn = require("./middleware.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const router = express.Router();
const {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
} = require("../db");

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.status(200).json(routines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post("/", loggedIn, async (req, res, next) => {
  const { name, goal } = req.body;
  const creatorId = req.user;
  if (!creatorId) {
    return next({
      name: "Unauthorized User",
      message: "You must be logged in to perform this action",
      error: "Unauthorized User Error",
    });
  }

  try {
    const routine = await createRoutine({
      creatorId: req.user.id,
      ...req.body,
    });
    res.status(200).json(routine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
