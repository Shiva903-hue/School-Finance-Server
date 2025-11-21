import db from "../../DataBase/DBConn.js";
import express from 'express';
import { roleCheck } from "../../middleware/auth.js";

const router = express.Router();

router.get("/trns-info",roleCheck(['User','Superviser','Banker']), async (req, res) => {
          try {
            const [rows] = await db.promise().query(
              `SELECT 
              
              t.transaction_id,
                t.transaction_type_id,
                tt.transaction_type,
                t.transaction_details,
                t.trns_date,
                t.trns_status,
                t.voucher_id,
                t.bank_id,
                b.bank_name,
                t.trns_amount
              FROM tbl_transaction_details t
              LEFT JOIN tbl_transaction_type_master tt ON t.transaction_type_id = tt.transaction_type_id
              LEFT JOIN tbl_bank_master b ON t.bank_id = b.bank_id
              ORDER BY t.transaction_id DESC`
            );
            res.json(rows);
          } catch (error) {
            console.error("Error fetching transaction info:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
        });



export default router;