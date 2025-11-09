import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();

router.post("/purchase-voucher", async (req, res) => {
  const {
    voucher_entry_date,
    voucher_status,
    product_name,
    product_qty,
    product_rate,
    product_amount,
    vendor_id
  } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO tbl_purchase_voucher_details
       (
          voucher_entry_date,
    voucher_status,
    product_name,
    product_qty,
    product_rate,
    product_amount,
    vendor_id
  )
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        voucher_entry_date,
        voucher_status,
        product_name,
        product_qty,
        product_rate,
        product_amount,
        vendor_id,
      ]
    );
    res.json({ success: true, message: "Purchase voucher added successfully" });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
