import TaskModel from "../model/task.model.js";
import { TryError, CatchError } from "../utils/errors.js";

const createTask = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            created_by: req.user.id
        }
        const response = await TaskModel.create(payload)
        res.status(200).json({ message: 'Task created', data: response })
    } catch (error) {
        console.error("Error while creating task:", error);
        CatchError(error, res, 'Task not created, something went wrong');
    }
}

const getTask = async (req, res) => {
    try {
        const response = await TaskModel.find({}, { taskname: 1, description: 1, assign_date: 1, status: 1 })
        res.status(200).json({ data: response })
    } catch (error) {
        console.error("Error while fetching task:", error);
        CatchError(error, res, "Something went wrong");
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.length !== 24) {
            throw TryError("Invalid Task ID", 400);
        }

        const task = await TaskModel.findById(id);

        if (!task) {
            throw TryError("Task not found", 404);
        }

        if (task.created_by.toString() !== req.user.id) {
            throw TryError("You are not authorized to delete this task", 403);
        }

        await TaskModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Task deleted successfully",
        });

    } catch (error) {
        console.error("Error while deleting task:", error);
        CatchError(error, res, "Task not deleted, Something went wrong'");
    }
};

const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id || id.length !== 24) {
            throw TryError("Invalid Task ID", 400);
        }

        const task = await TaskModel.findById(id);

        if (!task) {
            throw TryError("Task not found", 404);
        }

        if (task.created_by.toString() !== req.user.id) {
            throw TryError("You are not authorized to update this task", 403);
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        console.error("Error while updating task:", error);
        CatchError(error, res, "Task not updated, Something went wrong");
    }
};

export { createTask, getTask, deleteTask, editTask }