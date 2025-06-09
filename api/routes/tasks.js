import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import {
  createTask,
  deleteTaskById,
  getTaskById,
  getTasksByUserId,
  updateTaskById,
} from "#db/queries/tasks";
import requireBody from "#middleware/requireBody";

const tasksRouter = express.Router();

tasksRouter.use(getUserFromToken);
tasksRouter.use(requireUser);

// GET /tasks
tasksRouter.get("/", async (req, res, next) => {
  try {
    const { id } = req.user;
    const tasks = await getTasksByUserId(id);
    res.send(tasks);
  } catch (error) {
    next(error);
  }
});

// POST /tasks
tasksRouter.post(
  "/",
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const { id } = req.user;
      const { title, done } = req.body;

      const task = await createTask(title, id, done);
      res.status(201).send(task);
    } catch (error) {
      next(error);
    }
  }
);

// middleware for any route that includes id
// check if the task exists, and if it belongs to the logged in user
tasksRouter.param("id", async (req, res, next, id) => {
  const userId = req.user.id;
  const task = await getTaskById(id);

  if (!task) return res.status(404).send("Error: task not found.");
  if (task.user_id !== userId) {
    return res.status(403).send("Error: you do not have access to this task.");
  }

  req.task = task;
  next();
});

// PUT /tasks/:id
tasksRouter.put(
  "/:id",
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const { id } = req.task;
      const { title, done } = req.body;

      const task = await updateTaskById(title, done, id);
      res.send(task);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /tasks/:id
tasksRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.task;

    await deleteTaskById(id);
    // 204 No Content means “success with no response body”
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default tasksRouter;
