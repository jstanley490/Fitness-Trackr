const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1,$2,$3,$4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    WHERE routines.id = $1;
    `,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const res = await client.query(`
      SELECT *
      FROM routines
    `);
    return res.rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id;
      `
    );

    await attachActivitiesToRoutines(routines);

    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routine } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE "isPublic" = true
      `
    );

    await attachActivitiesToRoutines(routine);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routine } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users
  ON routines."creatorId" = users.id
  WHERE username = $1;
  `,
      [username]
    );

    await attachActivitiesToRoutines(routine);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routine } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    WHERE "isPublic" = true AND username = $1;
    `,
      [username]
    );

    await attachActivitiesToRoutines(routine);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routine } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users
  ON routines."creatorId" = users.id
  JOIN routine_activities 
  ON routine_activities."routineId" = routines.id
  WHERE "isPublic" = true AND routine_activities."activityId" = $1;
  `,
      [id]
    );

    await attachActivitiesToRoutines(routine);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ routineId, ...fields }) {
  try {
    const setString = Object.keys(fields)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");

    const {
      rows: [routine],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id = ${routineId}
    RETURNING *;
    `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    DELETE FROM routines
    WHERE id = $1
    RETURNING *;
    `,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
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
};
