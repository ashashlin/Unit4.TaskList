import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { createTask, getTasksByUserId } from "#db/queries/tasks";
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

      await createTask(title, id, done);
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  }
);

export default tasksRouter;
