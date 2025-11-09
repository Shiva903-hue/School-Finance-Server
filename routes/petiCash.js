import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();

router.post("/peticash", async (req, res) => {
  const { Vendor_name, Txn_description, Txn_Amount, bank_id } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO tbl_peticash
       (
          Vendor_name,
          Txn_description,
          Txn_Amount,
          bank_id
       )
       VALUES (?, ?, ?, ?)`,
      [Vendor_name, Txn_description, Txn_Amount, bank_id]
    );
    res.json({ success: true, message: "Peticash Transaction done successfully" });
  } catch (error) {
    console.error("Error creating peticash:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
