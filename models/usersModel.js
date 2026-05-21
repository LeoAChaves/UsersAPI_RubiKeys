import bcrypt from "bcrypt";

class UserModel {
  constructor(email, name, hashedPassword) {
    this.Email = this._validateEmail(email);
    this.Name = this._validateName(name);
    this.Password = hashedPassword;
  }

  static async create(email, name, plainTextPassword) {
    const hashedPassword =
      await UserModel._validateAndHashPassword(plainTextPassword);
    return new UserModel(email, name, hashedPassword);
  }

  _validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
    return email.toLowerCase(); // Normalizar email
  };

  _validateName = (name) => {
    const trimmedName = name?.trim();
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
    if (trimmedName.length > 100) {
      throw new Error("Name must be less than 100 characters");
    }
    return trimmedName;
  };

  static async _validateAndHashPassword(plainTextPassword) {
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      throw new Error("Password is required");
    }

    const trimmedPassword = plainTextPassword.trim();
    if (trimmedPassword.length === 0) {
      throw new Error("Password cannot be empty");
    }

    UserModel._validatePassword(trimmedPassword);

    const saltRounds = 10;
    try {
      const hash = await bcrypt.hash(trimmedPassword, saltRounds);
      return hash;
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  static _validatePassword(password) {
    // Senha mais realista: mínimo 8 caracteres, pelo menos 1 letra, 1 número e 1 especial
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!regex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character",
      );
    }
  }

  // Método utilitário para comparar senhas
  static async comparePassword(plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

export default UserModel;
