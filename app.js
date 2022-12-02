require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const authenticationRoute = require("./routes/authenticate-route");
const adminPostRoute = require("./routes/admin-post-route");
const classesRouter = require("./routes/classes-router");
const archivedClassesRouter = require("./routes/archived-classes-route");
const classStudentsRouter = require("./routes/class-students-router");
const classTasksRouter = require("./routes/class-tasks-route");
const assignerTaskRouter = require("./routes/handler-tasks-route");
const globalTasksRouter = require("./routes/global-tasks-router");
const postCommentRouter = require("./routes/post-comments-route");
const publicTaskCommentRouter = require("./routes/task-public-comments-route");
const privateTaskCommentRouter = require("./routes/task-private-comments-route");
const fileUploadRouter = require("./routes/file-upload-route");
const globalStudentsSubmitRouter = require("./routes/global-students-submit-route");
const globalStudentsUnsubmitRouter = require("./routes/global-students-unsubmit-route");
const archivedTasksRouter = require("./routes/archived-tasks-route");
const classPostRouter = require("./routes/class-post-route");
const tasksToGradeRouter = require("./routes/tograde-tasks-route");
const userRouter = require("./routes/user-router");

const authenticationMiddleware = require("./middleware/authentication-middleware");
const errorHandlerMiddleware = require("./middleware/error-handler-middleware");
const notFoundMiddleware = require("./middleware/not-found-middleware");

app.use(cors());
app.set("trust proxy", 1);
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(fileUpload({ useTempFiles: true }));

app.use("/authenticate", authenticationRoute); // login
app.use("/home", authenticationMiddleware, adminPostRoute); // admin post
app.use("/tasks", authenticationMiddleware, globalTasksRouter); // all tasks
app.use("/classes", authenticationMiddleware, classesRouter); // all classes and single class
app.use("/archived-classes", authenticationMiddleware, archivedClassesRouter); // all archived classes and single archived class
app.use("/classes/:class_id/posts", authenticationMiddleware, classPostRouter); // all class posts and single class post
app.use("/classes/:class_id/tasks", authenticationMiddleware, classTasksRouter); // all class tasks and single class task
app.use("/classes/:class_id/archived-tasks", authenticationMiddleware, archivedTasksRouter); // all class archived tasks and single class archived task
app.use("/classes/:class_id/students-submit", authenticationMiddleware, globalStudentsSubmitRouter); // student submit route
app.use(
  "/classes/:class_id/students-unsubmit",
  authenticationMiddleware,
  globalStudentsUnsubmitRouter
); // student unsubmit route
app.use("/classes/:class_id/students", authenticationMiddleware, classStudentsRouter); // all class student and class single student
app.use("/classes/:class_id/comments/:post_id", authenticationMiddleware, postCommentRouter); // all post comments and single post comment
app.use(
  "/classes/:class_id/tasks-comments/:task_id/public",
  authenticationMiddleware,
  publicTaskCommentRouter
); // all public task comments and single public task comment
app.use(
  "/classes/:class_id/tasks-comments/:task_id/private",
  authenticationMiddleware,
  privateTaskCommentRouter
); // all private task comments and single public task comment
app.use("/assigner-task/:class_id/tasks", authenticationMiddleware, assignerTaskRouter); // all assigned tasks and archived task
app.use(
  "/to-grade/:class_id/tasks/:task_id/students",
  authenticationMiddleware,
  tasksToGradeRouter
);
app.use("/grasp-by-rltn/file-upload", authenticationMiddleware, fileUploadRouter);
app.use("/users", authenticationMiddleware, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    app.listen(port, () => console.log(`listening to ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
