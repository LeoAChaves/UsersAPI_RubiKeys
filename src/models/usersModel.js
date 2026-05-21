import bcrypt from "bcrypt";

class UserModel {
  constructor(email, name, hashedPassword) {
    this.Email = this._validateEmail(email);
    this.Name = this._validateName(name);
    this.Password = hashedPassword;
  }

  static async create(email, name, plainTextPassword) {
    const hashedPassword = await UserModel._validateAndHashPassword(
      plainTextPassword
    );
    return new UserModel(email, name, hashedPassword);
  }

  _validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format: " + email);
    }
    return email;
  };

  _validateName = (name) => {
    if (typeof name === "string" && name.trim().length > 0) {
      return name;
    } else {
      throw new Error("Invalid name format: " + name);
    }
  };

  static async _validateAndHashPassword(plainTextPassword) {
    if (
      typeof plainTextPassword !== "string" ||
      plainTextPassword.trim() === ""
    ) {
      throw new Error("Password is required and cannot be empty");
    }
    UserModel._validatePassword(plainTextPassword);
    const saltRounds = 10;
    try {
      const hash = await bcrypt.hash(plainTextPassword, saltRounds);
      if (!hash) {
        throw new Error("Failed to generate hash");
      }
      return hash;
    } catch (error) {
      throw new Error("Password hashing failed: " + error.message);
    }
  }

  static _validatePassword(password) {
    const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])[!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!regex.test(password)) {
      throw new Error(
        "Password must be at least 6 characters long and contain at least one special character."
      );
    }
  }
}

export default UserModel;
