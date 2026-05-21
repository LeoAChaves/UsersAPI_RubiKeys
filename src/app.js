import express from "express";
import cors from "cors";
import database from "./database/sqlite-db.js"; // Ensure this path is correct
import IndexController from "./controllers/indexController.js";
import UsersController from "./controllers/usersController.js"; // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use(cors());

IndexController(app);
UsersController(app, database);

export default app;
