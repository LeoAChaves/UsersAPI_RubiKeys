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
    password TEXT NOT NULL
)`;

function createUsersTable() {
  db.run(USERS_SCHEMA, (error) => {
    if (error) console.log("Error creating table USERS\n" + error.message);
  });
}

const populateRandomUsers = async (userCount) => {
  const insertSQL = `INSERT INTO users (email, name, password) VALUES (?, ?, ?)`;
  for (let i = 0; i < userCount; i++) {
    const fullName = faker.person.fullName();
    const [firstName, lastName] = fullName.split(" ");
    const email = faker.internet.email({ firstName, lastName });
    const plainTextPassword = faker.internet.password();
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    db.run(insertSQL, [email, fullName, hashedPassword], function (err) {
      if (err) return console.error("Could not insert user", err.message);
      console.log(`A new user has been added: ${fullName} (${email})`);
    });
  }
};

db.serialize(() => {
  createUsersTable();
  populateRandomUsers(10);
});
