import db from "../../DataBase/DBConn.js";
import express from "express";

const router = express.Router();
router.patch('/update/voucher/:id',  (req, res) => {
  const { id } = req.params;
  const { voucher_status, voucher_entry_date, voucher_description } = req.body;
  
  // Convert ISO to MySQL datetime if needed
  const dbDate = new Date(voucher_entry_date)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  
   db.query(
    'UPDATE tbl_purchase_voucher_details SET voucher_status = ?, voucher_description = ?, voucher_entry_date = ? WHERE voucher_id = ?',
    [voucher_status, voucher_description, dbDate, id]
  );
  
  res.json({ success: true });
});

export default router;