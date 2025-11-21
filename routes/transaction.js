import express from "express";
import db from "../DataBase/DBConn.js";
import { roleCheck } from "../middleware/auth.js";

const router = express.Router();
// http://localhost:8001/api/request/transaction
router.post("/transaction", roleCheck(['User','Superviser','Banker']) ,async (req, res) => {
  const {
    transaction_type_id,
    transaction_details,
    trns_date,
    trns_status,
    voucher_id,
    bank_id,
    trns_amount
  } = req.body;


  const created_by = req.session.user.user_id;
  try {
    await db.promise().query(
      `INSERT INTO tbl_transaction_details
       (
          transaction_type_id,
    transaction_details,
    trns_date,
    trns_status,
    voucher_id,
    user_id,
    bank_id,
    trns_amount
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction_type_id,
        transaction_details,
        trns_date,
        trns_status,
        voucher_id,
        created_by,
        bank_id,
        trns_amount
      ]
    );
    res.json({ success: true, message: "Transaction requested successfully" });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
