const express = require("express");
const {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
} = require("../db");
const loggedIn = require("./middleware.js");
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", loggedIn, async (req, res, next) => {
  const routineActivityId = req.params.routineActivityId;
  const user = req.user.id;

  if (!user) {
    return next({
      name: "AuthorizationHeaderError",
      message: "You must be logged in to perform this action",
    });
  }
  try {
    const routineOwner = await canEditRoutineActivity(routineActivityId, user);

    if (!routineOwner) {
      next({
        error: "AuthorizationHeaderError",
        name: "AuthorizationHeaderError",
        message: `User ${req.user.username} is not allowed to update In the evening`,
      });
    }
    const routineActivity = await updateRoutineActivity({
      id: routineActivityId,
      ...req.body,
    });
    res.status(200).json(routineActivity);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", loggedIn, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const user = req.user.id;

  if (!user) {
    return next({
      name: "AuthorizationHeaderError",
      message: "You must be logged in to perform this action",
    });
  }
  try {
    const routineOwner = await canEditRoutineActivity(routineActivityId, user);

    if (!routineOwner) {
      res.status(403).json({
        error: "AuthorizationHeaderError",
        message: `User ${req.user.username} is not allowed to delete In the afternoon`,
        name: "Error",
      });
    }

    const deletedRoutineActivity = await destroyRoutineActivity(
      routineActivityId
    );

    res.status(200).json(deletedRoutineActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
