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

export async function getTaskById(id) {
  const sql = `
    SELECT * FROM tasks
    WHERE id = $1;
  `;

  const {
    rows: [task],
  } = await db.query(sql, [id]);

  return task;
}

export async function updateTaskById(title, done, id) {
  const sql = `
    UPDATE tasks
    SET
      title = $1,
      done = $2
    WHERE id = $3
    RETURNING *;
  `;

  const {
    rows: [task],
  } = await db.query(sql, [title, done, id]);

  return task;
}

export async function deleteTaskById(id) {
  const sql = `
    DELETE FROM tasks
    WHERE id = $1;
  `;

  await db.query(sql, [id]);
}
