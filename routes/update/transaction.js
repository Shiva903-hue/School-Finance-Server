import db from "../../DataBase/DBConn.js";
import express from "express";
import { roleCheck } from "../../middleware/auth.js";

const router = express.Router();
router.patch('/update/transaction/:id', roleCheck(['Superviser']), (req, res) => {
  const { id } = req.params;
  const {  transaction_details ,trns_status, trns_date} = req.body;

  // Convert ISO to MySQL datetime if needed
  const dbDate = new Date(trns_date)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  
   db.query(
    'UPDATE tbl_transaction_details SET transaction_details = ?, trns_status = ?, trns_date = ? WHERE transaction_id = ?',
    [transaction_details, trns_status, dbDate, id]
  );
  res.json({ success: true });
});

export default router;