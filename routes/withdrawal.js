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
    const amount = parseFloat(Txn_amount);

    // Step 1: Validate bank exists and get current balance
    const [bankRows] = await db.promise().query(
      'SELECT bank_amount FROM tbl_bank_master WHERE bank_id = ?',
      [Bank_id]
    );

    if (bankRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }

    const currentBalance = parseFloat(bankRows[0].bank_amount);

    // Step 2: Check for sufficient funds
    if (amount > currentBalance) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient bank balance',
        currentBalance: currentBalance,
        requestedAmount: amount
      });
    }

    // Step 3: Insert withdrawal transaction
    const [result] = await db.promise().query(
      "INSERT INTO tbl_self_transaction_details (Txn_type, Bank_id, Txn_amount, transaction_type_id, transaction_date, cheque_dd_number, rtgs_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        Txn_type,
        Bank_id,
        amount,
        transaction_type_id,
        transaction_date,
        cheque_dd_number,
        rtgs_number
      ]
    );

    // Step 4: Subtract amount from bank balance
    await db.promise().query(
      'UPDATE tbl_bank_master SET bank_amount = bank_amount - ? WHERE bank_id = ?',
      [amount, Bank_id]
    );

    res.status(201).json({ 
      success: true, 
      message: "Withdrawal successful and bank balance updated", 
      Txn_Id: result.insertId 
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
});

export default router;
