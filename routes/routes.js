const express = require("express");
const router = express.Router();
const TasksController = require("../controllers/TasksController");
const upload = require("../helpers/muter");

router.post("/tasks", upload.single("thumbnail"), TasksController.createTask);
router.get("/tasks", TasksController.getAllTasks);
router.get("/tasks/:id", TasksController.getTaskById);
router.put(
  "/tasks/:id",
  upload.single("thumbnail"),
  TasksController.updateTask
);
router.put("/tasks/reorder", TasksController.updateTaskOrder);
router.delete("/tasks/:id", TasksController.deleteTask);

module.exports = router;
