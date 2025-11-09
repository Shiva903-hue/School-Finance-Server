import express from "express";
import db from "../../DataBase/DBConn.js";

const router = express.Router();

router.get("/voucher-details", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        v.voucher_id,
        v.voucher_entry_date,
        v.voucher_status,
        v.product_name,
        v.product_qty,
        v.product_rate,
        v.product_amount,
        v.vendor_id,
        d.vendor_name
      FROM tbl_purchase_voucher_details AS v
      JOIN tbl_vendor_details AS d ON v.vendor_id = d.vendor_id
      ORDER BY v.voucher_id DESC`
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No voucher details found" });
    }

    res.json({ success: true, voucherDetails: rows });
  } catch (error) {
    console.error("Error fetching voucher details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
