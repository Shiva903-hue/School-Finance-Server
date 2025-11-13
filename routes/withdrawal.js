import db from "../DataBase/DBConn.js";
import express from "express";

const router = express.Router();

router.post("/withdrawal", async (req, res) => {
  const {
    Txn_type,
    Bank_id,
    Txn_amount,
    transaction_type_id,
    transaction_date,
    cheque_dd_number,
    rtgs_number
  } = req.body;

  try {
    const [result] = await db.promise().query(
      "INSERT INTO tbl_self_transaction_details (Txn_type, Bank_id, Txn_amount, transaction_type_id, transaction_date, cheque_dd_number, rtgs_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        Txn_type,
        Bank_id,
        Txn_amount,
        transaction_type_id,
        transaction_date,
        cheque_dd_number,
        rtgs_number
      ]
    );
    res
      .status(201)
      .json({ success: true, message: "Deposit successful", Txn_Id: result.insertId });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

export default router;
