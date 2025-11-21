import express from "express";
import db from "../DataBase/DBConn.js";
import { roleCheck } from "../middleware/auth.js";

const router = express.Router();

router.get("/check-account/:accountNumber",roleCheck(['User','Admin','Banker','Superviser']), (req, res) => {
  const { accountNumber } = req.params;

  db.query(
    `SELECT bank_id FROM Tbl_bank_master WHERE bank_account_no = ?`,
    [accountNumber],
    (error, results) => {
      if (error) {
        console.error("Error checking account number:", error);
        return res.status(500).json({ 
          exists: false, 
          error: "Failed to check account number" 
        });
      }

      res.json({ 
        exists: results.length > 0,
        message: results.length > 0 
          ? "Account number already exists" 
          : "Account number is available"
      });
    }
  );
});

// Route 2: Add bank with duplicate check
router.post("/add",roleCheck(['User','Admin','Banker','Superviser']), (req, res) => {
  const {
    bank_name,
    bank_account_no,
    bank_ifsc,
    bank_branch,
    city_id,
    state_id,
    bank_address,
    bank_type,
    bank_amount
  } = req.body;
  const created_by = req.session.user.user_id;
  // First, check if account number already exists
  db.query(
    `SELECT bank_id FROM Tbl_bank_master WHERE bank_account_no = ?`,
    [bank_account_no],
    (checkError, existing) => {
      if (checkError) {
        console.error("Error checking account:", checkError);
        return res.status(500).json({ 
          success: false, 
          message: "Server error" 
        });
      }

      // If account number exists, return error
      if (existing.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Account number already exists" 
        });
      }

      // If unique, insert new bank record
      db.query(
        `INSERT INTO Tbl_bank_master 
         (bank_name, bank_account_no, bank_ifsc, bank_branch, city_id, state_id,user_id, bank_address, bank_type, bank_amount)
         VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?)`,
        [bank_name, bank_account_no, bank_ifsc, bank_branch, city_id, state_id,created_by, bank_address, bank_type, bank_amount],
        (insertError, result) => {
          if (insertError) {
            console.error("Error creating bank:", insertError);
            return res.status(500).json({ 
              success: false, 
              message: "Server error" 
            });
          }

          res.json({ 
            success: true, 
            message: "Bank added successfully",
            bank_id: result.insertId
          });
        }
      );
    }
  );
});

 export default router;
