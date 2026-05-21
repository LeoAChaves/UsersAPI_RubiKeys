import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { dirname } from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const filePath = dirname(fileURLToPath(import.meta.url)) + "/database.db";
const db = new sqlite3.Database(filePath);

const USERS_SCHEMA = `CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const CREATE_INDEX = `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;

function createUsersTable() {
  return new Promise((resolve, reject) => {
    db.run(USERS_SCHEMA, (error) => {
      if (error) {
        console.log("Error creating table USERS\n" + error.message);
        reject(error);
      } else {
        console.log("Users table created/verified");
        db.run(CREATE_INDEX, (err) => {
          if (err) console.log("Error creating index:", err.message);
          resolve();
        });
      }
    });
  });
}

const populateRandomUsers = async (userCount) => {
  const insertSQL = `INSERT INTO users (email, name, password) VALUES (?, ?, ?)`;
  const users = [];

  for (let i = 0; i < userCount; i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(" ");
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const plainTextPassword = `Test@${faker.internet.password({ length: 8 })}`;
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    users.push({ email, name: fullName, password: hashedPassword });
  }

  // Inserir em batch para melhor performance
  const stmt = db.prepare(insertSQL);
  for (const user of users) {
    stmt.run([user.email, user.name, user.password], (err) => {
      if (err) console.error("Could not insert user", err.message);
    });
  }
  stmt.finalize();

  console.log(`Successfully added ${userCount} random users`);
  console.log("Sample user credentials (for testing):");
  users.slice(0, 3).forEach((user) => {
    console.log(`Email: ${user.email}, Password pattern: Test@********`);
  });
};

// Executar setup
async function setup() {
  try {
    await createUsersTable();
    await populateRandomUsers(10);
    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    db.close((err) => {
      if (err) console.error("Error closing database:", err);
      else console.log("Database connection closed");
    });
  }
}

setup();
