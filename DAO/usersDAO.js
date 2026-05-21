import bcrypt from "bcrypt";

class UsersDAO {
  constructor(db) {
    this.db = db;
  }

  // Verificar se usuário existe
  userExists = async (email) => {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT email FROM users WHERE email = ?",
        [email.toLowerCase()],
        (error, row) => {
          if (error) {
            reject({ message: error.message, error: true });
          } else {
            resolve(!!row);
          }
        },
      );
    });
  };

  getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT email, name FROM users WHERE email = ?",
        [email.toLowerCase()],
        (error, row) => {
          if (error) {
            reject({ message: error.message, error: true });
          } else if (!row) {
            reject({ message: "User not found", error: true });
          } else {
            resolve({ user: row, error: false });
          }
        },
      );
    });
  };

  getAllEmails = () => {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT email FROM users ORDER BY email LIMIT 1000",
        (error, rows) => {
          if (error) {
            reject({ message: error.message, error: true });
          } else {
            resolve({
              emails: rows.map((row) => row.email),
              count: rows.length,
              error: false,
            });
          }
        },
      );
    });
  };

  getAllNames = () => {
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT name, email FROM users ORDER BY name LIMIT 1000",
        (error, rows) => {
          if (error) {
            reject({ message: error.message, error: true });
          } else {
            resolve({
              names: rows.map((row) => ({ name: row.name, email: row.email })),
              count: rows.length,
              error: false,
            });
          }
        },
      );
    });
  };

  insertUser = async (userModel) => {
    const { Email: email, Name: name, Password: hashedPassword } = userModel;

    // Verificar se usuário já existe
    const exists = await this.userExists(email);
    if (exists) {
      throw { message: `User with email ${email} already exists`, error: true };
    }

    try {
      const insertQuery =
        "INSERT INTO users (email, name, password) VALUES (?, ?, ?)";
      const params = [email, name, hashedPassword];

      const lastID = await new Promise((resolve, reject) => {
        this.db.run(insertQuery, params, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID);
          }
        });
      });

      return {
        message: `User ${name} (${email}) created successfully`,
        id: lastID,
        error: false,
      };
    } catch (error) {
      throw {
        message: error.message,
        error: true,
      };
    }
  };

  updateUserName = async (email, newName) => {
    const normalizedEmail = email.toLowerCase();

    // Validar nome
    if (!newName || newName.trim().length < 2) {
      throw { message: "Name must be at least 2 characters long", error: true };
    }

    // Verificar se usuário existe
    const exists = await this.userExists(normalizedEmail);
    if (!exists) {
      throw {
        message: `User with email ${normalizedEmail} not found`,
        error: true,
      };
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE users SET name = ? WHERE email = ?",
        [newName.trim(), normalizedEmail],
        function (error) {
          if (error) {
            reject({ message: error.message, error: true });
          } else if (this.changes === 0) {
            reject({ message: "No user was updated", error: true });
          } else {
            resolve({
              message: `User ${normalizedEmail}'s name updated to ${newName.trim()}`,
              changes: this.changes,
              error: false,
            });
          }
        },
      );
    });
  };

  updateUserPassword = async (email, newPlainTextPassword) => {
    const normalizedEmail = email.toLowerCase();

    // Validar senha
    if (!newPlainTextPassword || newPlainTextPassword.length < 8) {
      throw {
        message: "Password must be at least 8 characters long",
        error: true,
      };
    }

    // Verificar se usuário existe
    const exists = await this.userExists(normalizedEmail);
    if (!exists) {
      throw {
        message: `User with email ${normalizedEmail} not found`,
        error: true,
      };
    }

    try {
      const newHashedPassword = await bcrypt.hash(newPlainTextPassword, 10);

      return new Promise((resolve, reject) => {
        this.db.run(
          "UPDATE users SET password = ? WHERE email = ?",
          [newHashedPassword, normalizedEmail],
          function (error) {
            if (error) {
              reject({ message: error.message, error: true });
            } else if (this.changes === 0) {
              reject({ message: "No user was updated", error: true });
            } else {
              resolve({
                message: `User ${normalizedEmail}'s password updated successfully`,
                changes: this.changes,
                error: false,
              });
            }
          },
        );
      });
    } catch (error) {
      throw { message: error.message, error: true };
    }
  };

  deleteUser = async (email) => {
    const normalizedEmail = email.toLowerCase();

    // Verificar se usuário existe
    const exists = await this.userExists(normalizedEmail);
    if (!exists) {
      throw {
        message: `User with email ${normalizedEmail} not found`,
        error: true,
      };
    }

    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM users WHERE email = ?",
        [normalizedEmail],
        function (error) {
          if (error) {
            reject({ message: error.message, error: true });
          } else if (this.changes === 0) {
            reject({ message: "No user was deleted", error: true });
          } else {
            resolve({
              message: `User with email ${normalizedEmail} deleted successfully`,
              changes: this.changes,
              error: false,
            });
          }
        },
      );
    });
  };

  // Método para buscar usuários com paginação
  getUsersPaginated = (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
      this.db.all(
        "SELECT email, name FROM users ORDER BY email LIMIT ? OFFSET ?",
        [limit, offset],
        (error, rows) => {
          if (error) {
            reject({ message: error.message, error: true });
          } else {
            resolve({ users: rows, page, limit, error: false });
          }
        },
      );
    });
  };
}

export default UsersDAO;
