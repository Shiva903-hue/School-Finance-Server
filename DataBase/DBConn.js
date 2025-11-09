import mysql from "mysql2";
const dbpass = process.env.DBPass;

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: dbpass,
  database: "voucher_entry",
});

db.getConnection((error, connection) => {
  if (error) {
    console.log("Database Connection Failed", error);
    return;
  }
  console.log("Database Connected Successfully");
  connection.release();
});

export default db;
