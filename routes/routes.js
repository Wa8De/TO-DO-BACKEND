const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const BoardController = require("../controllers/BoardController");
const TasksController = require("../controllers/TasksController");
const Authmiddleware = require("../middlwares/AuthMiddlware");
const upload = require("../helpers/muter");

router.use(Authmiddleware.Check);

router.get("/account", userController.AuthenticatedUser);

// Boards Routes
router.post("/boards", BoardController.createBoard);
router.get("/boards", BoardController.getUserBoards);
router.get("/boards/:OwnerId", BoardController.getBoardById);
router.put("/boards/:id", BoardController.updateBoard);
router.delete("/boards/:id", BoardController.deleteBoard);

// Tasks Routes
router.post("/tasks", upload.single("thumbnail"), TasksController.createTask);
router.get("/tasks/:BoardId", TasksController.getBoardTasks);
router.get("/tasks/:id", TasksController.getTaskById);
router.put(
  "/tasks/:id",
  upload.single("thumbnail"),
  TasksController.updateTask
);
router.put("/tasks/reorder", TasksController.updateTaskOrder);
router.delete("/tasks/:id", TasksController.deleteTask);

module.exports = router;
