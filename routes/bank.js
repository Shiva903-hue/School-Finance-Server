import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const {
    bank_name,
    bank_account_no,
    bank_ifsc,
    bank_branch,
    city_id,
    state_id,
    bank_address,
    bank_type
  } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO Tbl_bank_master 
       (bank_name, bank_account_no, bank_ifsc, bank_branch, city_id, state_id, bank_address, bank_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [bank_name, bank_account_no, bank_ifsc, bank_branch, city_id, state_id, bank_address, bank_type]
    );
    res.json({ success: true, message: "Bank added successfully" });
  } catch (error) {
    console.error("Error creating bank:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
