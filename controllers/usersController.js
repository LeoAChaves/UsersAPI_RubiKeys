import UsersDAO from "../DAO/usersDAO.js";
import UserModel from "../models/usersModel.js";

const UsersController = (app, db) => {
  const usersDAO = new UsersDAO(db);

  // GET /users - Buscar todos emails
  app.get("/users", async (req, res) => {
    try {
      const users = await usersDAO.getAllEmails();
      res.status(200).json({
        success: true,
        data: users,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] GET /users: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  });

  // GET /users/names - Buscar todos nomes
  app.get("/users/names", async (req, res) => {
    try {
      const names = await usersDAO.getAllNames();
      res.status(200).json({
        success: true,
        data: names,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] GET /users/names: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to fetch names",
        error: error.message,
      });
    }
  });

  // GET /users/:email - Buscar usuário específico
  app.get("/users/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const user = await usersDAO.getUserByEmail(email);
      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message,
        error: error.error || true,
      });
    }
  });

  // POST /users - Criar novo usuário
  app.post("/users", async (req, res) => {
    try {
      const { email, name, password } = req.body;

      // Validação de campos obrigatórios
      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: email, name, password are required",
        });
      }

      const newUserModel = await UserModel.create(email, name, password);
      const result = await usersDAO.insertUser(newUserModel);

      res.status(201).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] POST /users: ${error.message}`);

      let statusCode = 400;
      if (error.message.includes("already exists")) statusCode = 409;
      if (error.message.includes("format")) statusCode = 422;

      res.status(statusCode).json({
        success: false,
        message: error.message,
        error: error.error || true,
      });
    }
  });

  // PUT /users/name/:email - Atualizar nome
  app.put("/users/name/:email", async (req, res) => {
    const { email } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({
        success: false,
        message: "newName is required",
      });
    }

    try {
      const result = await usersDAO.updateUserName(email, newName);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] PUT /users/name/${email}: ${error.message}`);
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
        error: error.error || true,
      });
    }
  });

  // PUT /users/password/:email - Atualizar senha
  app.put("/users/password/:email", async (req, res) => {
    const { email } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "newPassword is required",
      });
    }

    try {
      const result = await usersDAO.updateUserPassword(email, newPassword);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] PUT /users/password/${email}: ${error.message}`);
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
        error: error.error || true,
      });
    }
  });

  // DELETE /users/:email - Deletar usuário
  app.delete("/users/:email", async (req, res) => {
    const { email } = req.params;

    try {
      const result = await usersDAO.deleteUser(email);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] DELETE /users/${email}: ${error.message}`);
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
        error: error.error || true,
      });
    }
  });

  // GET /users/paginated?page=1&limit=20 - Paginação
  app.get("/users/paginated", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    try {
      const result = await usersDAO.getUsersPaginated(page, limit);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[ERROR] GET /users/paginated: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Failed to fetch paginated users",
        error: error.message,
      });
    }
  });
};

export default UsersController;
