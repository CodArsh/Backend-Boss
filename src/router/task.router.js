import { Router } from "express";
import { createTask, deleteTask, editTask, getTask } from "../controller/task.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const TaskRouter = Router()

TaskRouter.post('/', verifyToken, createTask)
TaskRouter.get('/', verifyToken, getTask)
TaskRouter.delete('/:id', verifyToken, deleteTask)
TaskRouter.put('/:id', verifyToken, editTask)

export default TaskRouter