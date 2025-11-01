import { Router } from "express";
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  getTaskById,
} from "../controllers/taskController.js";

const router = Router();

router.post("/", createTask);
router.get("/", listTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
