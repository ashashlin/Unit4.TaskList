import db from "#db/client";

export async function createTask(title, userId) {
  const sql = `
    INSERT INTO tasks(
      title,
      user_id
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;

  const {
    rows: [task],
  } = await db.query(sql, [title, userId]);

  return task;
}
