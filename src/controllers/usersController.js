import UsersDAO from "../DAO/usersDAO.js";
import UserModel from "../models/usersModel.js";

const UsersController = (app, db) => {
  const usersDAO = new UsersDAO(db);

  app.get("/users", async (req, res) => {
    try {
      const users = await usersDAO.getAllEmails();
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ message: error.message, error: true });
    }
  });

  app.get("/users/names", async (req, res) => {
    try {
      const names = await usersDAO.getAllNames();
      res.status(200).json(names);
    } catch (error) {
      res.status(404).json({ message: error.message, error: true });
    }
  });

  app.post("/users", async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const newUserModel = await UserModel.create(email, name, password);
      const result = await usersDAO.insertUser(newUserModel);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message, error: true });
    }
  });

  app.put("/users/name/:email", async (req, res) => {
    const { email } = req.params;
    const { newName } = req.body;
    try {
      const result = await usersDAO.updateUserName(email, newName);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message, error: true });
    }
  });

  app.put("/users/password/:email", async (req, res) => {
    const { email } = req.params;
    const { newPassword } = req.body;
    try {
      const result = await usersDAO.updateUserPassword(email, newPassword);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message, error: true });
    }
  });

  app.delete("/users/:email", async (req, res) => {
    const { email } = req.params;
    try {
      const result = await usersDAO.deleteUser(email);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message, error: true });
    }
  });
};

export default UsersController;
