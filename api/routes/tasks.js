import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import {
  createTask,
  deleteTaskByIdAndUserId,
  getTasksByUserId,
  updateTaskByIdAndUserId,
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
      const { title } = req.body;
      const done = req.body.done.toLowerCase() === "true";

      const task = await createTask(title, id, done);
      res.status(201).send(task);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /tasks
tasksRouter.put(
  "/:id",
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const done = req.body.done.toLowerCase() === "true";
      const userId = req.user.id;

      const task = await updateTaskByIdAndUserId(title, done, id, userId);
      if (!task)
        return res
          .status(403)
          .send("Error: you do not have access to this task.");

      res.send(task);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /tasks
tasksRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedTask = await deleteTaskByIdAndUserId(id, userId);
    if (!deletedTask)
      return res
        .status(403)
        .send("Error: you do not have access to this task.");

    // 204 No Content means “success with no response body”
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

export default tasksRouter;
