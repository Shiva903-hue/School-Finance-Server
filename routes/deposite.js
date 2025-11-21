import db from "../DataBase/DBConn.js";
import express from "express";
import { roleCheck } from "../middleware/auth.js";

const router = express.Router();

router.post("/deposit",roleCheck(['Banker']), async (req, res) => {
  const {
    Txn_type,
    Bank_id,
    Txn_amount,
    transaction_type_id,
    transaction_date,
    cheque_dd_number,
    rtgs_number
  } = req.body;

   const created_by = req.session.user.user_id;
  try {
    const amount = parseFloat(Txn_amount);

    // Step 1: Validate bank exists
    const [bankRows] = await db.promise().query(
      'SELECT bank_amount FROM tbl_bank_master WHERE bank_id = ?',
      [Bank_id]
    );

    if (bankRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }

    // Step 2: Insert deposit transaction
    const [result] = await db.promise().query(
      "INSERT INTO tbl_self_transaction_details (Txn_type, Bank_id, Txn_amount, User_id,transaction_type_id, transaction_date, cheque_dd_number, rtgs_number) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      [
        Txn_type,
        Bank_id,
        amount,
        created_by,
        transaction_type_id,
        transaction_date,
        cheque_dd_number,
        rtgs_number
      ]
    );

    // Step 3: Add amount to bank balance
    await db.promise().query(
      'UPDATE tbl_bank_master SET bank_amount = bank_amount + ? WHERE bank_id = ?',
      [amount, Bank_id]
    );

    res.status(201).json({ 
      success: true, 
      message: "Deposit successful and bank balance updated", 
      Txn_Id: result.insertId 
    });
  } catch (error) {
    console.error("Error processing deposit:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

export default router;
