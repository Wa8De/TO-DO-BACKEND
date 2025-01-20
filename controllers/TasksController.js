const Task = require("../models/Task");
const path = require("path");
const fs = require("fs");
// Create a new contact
const createTask = async (req, res) => {
  try {
    const { name, description, status, order } = req.body;

    const thumbnail = req.file ? req.file.filename : null;

    const task = new Task({
      name,
      description,
      status,
      order,
      thumbnail,
    });
    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contacts
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateTask = async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    let newThumbnail = req.file ? req.file.filename : null;

    // Handle the new thumbnail upload
    if (newThumbnail) {
      const newThumbnailPath = path.resolve(
        __dirname,
        "../uploads",
        newThumbnail
      );

      // Remove the existing thumbnail if it exists
      if (task.thumbnail) {
        const oldThumbnailPath = path.resolve(
          __dirname,
          "../uploads",
          task.thumbnail
        );
        if (fs.existsSync(oldThumbnailPath)) {
          fs.unlinkSync(oldThumbnailPath);
        }
      }

      // Update task's thumbnail with the new one
      task.thumbnail = newThumbnail;
    }

    // Update other fields
    task.name = name || task.name;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully!",
      success: true,
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = updateTask;

const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body;

    // Validate input
    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        error: "Invalid input format",
      });
    }

    const updatePromises = tasks.map(({ id, order, status }) =>
      Task.findByIdAndUpdate(id, { $set: { order, status } }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Task order updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Task deleted successfully ! ",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskOrder,
  deleteTask,
};
