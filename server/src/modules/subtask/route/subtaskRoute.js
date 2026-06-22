import express from "express";
import {
  createSubTask,
  getSubtasks,
  updateSubtask,
  toggleSubtask,
  deleteSubtask,
} from "../controller/subtask.controller.js";

const router = express.Router();

router.post("/task/:taskId", createSubTask);

router.get("/task/:taskId", getSubtasks);

router.put("/:id", updateSubtask);

router.patch("/:id", toggleSubtask);

router.delete("/:id", deleteSubtask);

export default router;