import bcrypt from "bcrypt";
class UsersDAO {
  constructor(db) {
    this.db = db;
  }

  getAllEmails = () => {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT email FROM users", (error, rows) => {
        if (error) {
          reject({ message: error, error: true });
        } else {
          resolve({ emails: rows.map((row) => row.email), error: false });
        }
      });
    });
  };

  getAllNames = () => {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT name FROM users", (error, rows) => {
        if (error) {
          reject({ message: error, error: true });
        } else {
          resolve({ names: rows.map((row) => row.name), error: false });
        }
      });
    });
  };

  insertUser = async (userModel) => {
    // Extract validated and hashed properties from the UserModel instance
    const { Email: email, Name: name, Password: hashedPassword } = userModel;

    try {
      const insertQuery =
        "INSERT INTO users (email, name, password) VALUES (?, ?, ?)";
      const params = [email, name, hashedPassword];

      // Execute database insert operation
      const lastID = await new Promise((resolve, reject) => {
        this.db.run(insertQuery, params, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve(this.lastID); // This returns the ID of the newly inserted user
          }
        });
      });

      // Return the success response including the new user's ID
      return {
        message: `New user added: ${name} (${email})`,
        id: lastID, // Include the ID of the inserted record
        error: false,
      };
    } catch (error) {
      throw {
        message: error.message,
        error: true,
      };
    }
  };

  updateUserName = (email, newName) => {
    return new Promise((resolve, reject) => {
      this.db.run(
        "UPDATE users SET name = ? WHERE email = ?",
        [newName, email],
        function (error) {
          if (error) {
            reject({ message: error, error: true });
          } else {
            resolve({
              message: `User ${email}'s name updated to ${newName}`,
              error: false,
            });
          }
        }
      );
    });
  };

  updateUserPassword = (email, newPlainTextPassword) => {
    return new Promise(async (resolve, reject) => {
      const newHashedPassword = await bcrypt.hash(newPlainTextPassword, 10);
      this.db.run(
        "UPDATE users SET password = ? WHERE email = ?",
        [newHashedPassword, email],
        function (error) {
          if (error) {
            reject({ message: error, error: true });
          } else {
            resolve({
              message: `User ${email}'s password updated successfully`,
              error: false,
            });
          }
        }
      );
    });
  };

  deleteUser = (email) => {
    return new Promise((resolve, reject) => {
      this.db.run(
        "DELETE FROM users WHERE email = ?",
        [email],
        function (error) {
          if (error) {
            reject({ message: error, error: true });
          } else {
            resolve({
              message: `User with email ${email} deleted successfully`,
              error: false,
            });
          }
        }
      );
    });
  };
}

export default UsersDAO;
