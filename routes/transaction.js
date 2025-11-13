import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();

router.post("/transaction", async (req, res) => {
  const {
    transaction_type_id,
    transaction_details,
    trns_date,
    trns_status,
    voucher_id,
    bank_id,
    trns_amount
  } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO tbl_transaction_details
       (
          transaction_type_id,
    transaction_details,
    trns_date,
    trns_status,
    voucher_id,
    bank_id,
    trns_amount
       )
       VALUES (?, ?, ?, ?, ?, ?,?)`,
      [
        transaction_type_id,
        transaction_details,
        trns_date,
        trns_status,
        voucher_id,
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
