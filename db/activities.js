const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING 
    RETURNING *;
    `,
      [name, description]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(
      `
    SELECT *
    FROM activities;
    `
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE id=$1
    `,
      [id]
    );

    if (!activity) {
      return null;
    }

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT * 
      FROM activities
      WHERE name = $1
      `,
      [name]
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  try {
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, ...fields }) {
  const { name, description } = { ...fields };

  if (name || description) {
    try {
      let updateQuery = "";
      let params = [id];
      let paramIndex = 2;

      if (name) {
        updateQuery += `name=$${paramIndex}, `;
        params.push(name);
        paramIndex++;
      }

      if (description) {
        updateQuery += `description=$${paramIndex}, `;
        params.push(description);
      }

      // Remove trailing comma and space
      updateQuery = updateQuery.slice(0, -2);

      const {
        rows: [updatedActivity],
      } = await client.query(
        `
          UPDATE activities
          SET ${updateQuery}
          WHERE id=$1
          RETURNING *
        `,
        params
      );

      return updatedActivity;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
