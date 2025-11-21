import express from "express";
import db from "../DataBase/DBConn.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { isLoggedIn, roleCheck } from "../middleware/auth.js";

const router = express.Router();

//* Health check
router.get("/ping", (req, res) => {
  res.json({ message: "auth route alive" });
});

//* Debug endpoint - check what roles exist in DB
router.get("/debug-roles", async (req, res) => {
  try {
    const [roles] = await db.promise().query(
      "SELECT user_type_id, user_type_name FROM Tbl_user_type_master"
    );
    res.json({ roles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//* Login endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      `SELECT u.user_id, u.user_name, u.user_email, u.user_pwd, t.user_type_name AS role 
       FROM Tbl_user_master u
       JOIN Tbl_user_type_master t ON u.user_type_id = t.user_type_id
       WHERE u.user_email = ? AND u.user_status = 'active'`,
      [email]
    );
    
    const user = rows[0];
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const ok = await bcrypt.compare(password, user.user_pwd);
    
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user in session
    req.session.user = {
      user_id: user.user_id,
      name: user.user_name,
      email: user.user_email,
      role: user.role,
    };

    // Explicitly save session before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Session save failed" });
      }

      console.log("Session saved successfully:", {
        sessionID: req.sessionID,
        user: req.session.user
      });

      // Return success response
      res.json({
        success: true,
        message: "Logged in",
        role: user.role,
        name: user.user_name,
      });
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* Get current session / me
router.get('/me', (req, res) => {
  console.log('=== SESSION CHECK ===');
  console.log('Has session object:', !!req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Session user:', req.session?.user);
  console.log('Session cookie:', req.headers.cookie);
  console.log('====================');
  
  if (!req.session || !req.session.user) {
    return res.json({ 
      authenticated: false,
      user: null
    });
  }
  
  res.json({ 
    authenticated: true,
    user: req.session.user 
  });
});

//* Logout endpoint
router.post('/logout', (req, res) => {
  console.log('Logout requested for user:', req.session?.user);
  
  if (!req.session) {
    return res.json({ success: false, message: 'No session found' });
  }

  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }

    // Clear the session cookie
    res.clearCookie('sid'); // Must match the 'key' in session config
    console.log('Session destroyed and cookie cleared');
    
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

//* Fetch all roles from DB
router.get("/roles",async (req, res) => {
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
router.post("/register", roleCheck(['Admin']), async (req, res) => {
  const { name, email, password, mobile, role, status } = req.body;
    if (!email || !password || !role || !mobile || !name|| !status || !role) return res.status(400).json({ error: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.promise().query(
      `INSERT INTO Tbl_user_master 
       (user_name, user_pwd, user_mob, user_email, user_type_id, user_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, hashedPassword, mobile, email, role, status || "active"]
    );

    res.json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;
