import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();

//* Health check
router.get("/ping", (req, res) => {
  res.json({ message: "auth route alive" });
});

//* Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      `SELECT u.user_email, u.user_pwd, t.user_type_name AS role 
       FROM Tbl_user_master u
       JOIN Tbl_user_type_master t ON u.user_type_id = t.user_type_id
       WHERE u.user_email = ? AND u.user_pwd = ? AND u.user_status = 'active'`,
      [email, password]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];
    return res.json({
      success: true,
      message: "Login Successful",
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* Fetch all roles from DB
router.get("/roles", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT user_type_id, user_type_name FROM Tbl_user_type_master");

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No roles found" });
    }

    res.json({ success: true, roles: rows });
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* Register endpoint
router.post("/register", async (req, res) => {
  const { name, email, password, mobile, role, status } = req.body;
  try {
    await db
      .promise()
      .query(
        `INSERT INTO Tbl_user_master 
       (user_name, user_pwd, user_mob, user_email, user_type_id, user_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, password, mobile, email, role, status || "active"]
    );

    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;
