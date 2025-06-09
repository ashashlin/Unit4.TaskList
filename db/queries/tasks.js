import db from "#db/client";

export async function createTask(title, userId, done = false) {
  const sql = `
    INSERT INTO tasks(
      title,
      user_id,
      done
    )
    VALUES(
      $1,
      $2,
      $3
    )
    RETURNING *;
  `;

  const {
    rows: [task],
  } = await db.query(sql, [title, userId, done]);

  return task;
}

export async function getTasksByUserId(id) {
  const sql = `
    SELECT * FROM tasks
    WHERE user_id = $1;
  `;

  const { rows: tasks } = await db.query(sql, [id]);

  return tasks;
}

export async function updateTaskByIdAndUserId(title, done, id, userId) {
  const sql = `
    UPDATE tasks
    SET
      title = $1,
      done = $2
    WHERE id = $3
      AND user_id = $4
    RETURNING *;
  `;

  const {
    rows: [task],
  } = await db.query(sql, [title, done, id, userId]);

  return task;
}

export async function deleteTaskByIdAndUserId(id, userId) {
  const sql = `
    DELETE FROM tasks
    WHERE id = $1
      AND user_id = $2
    RETURNING *;
  `;

  const {
    rows: [deletedTask],
  } = await db.query(sql, [id, userId]);

  return deletedTask;
}
