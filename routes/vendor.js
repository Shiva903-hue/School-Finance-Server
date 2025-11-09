import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const {
    vendor_type_id,
    vendor_name,
    vendor_mobile,
    vendor_email,
    vendor_GST,
    vendor_status,
    city_id,
    state_id,
    vendor_address,
    bank_id,
  } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO tbl_vendor_details 
       (
      vendor_type_id,
      vendor_name,
      vendor_mobile,
      vendor_email,
      vendor_GST,
      vendor_status,
      city_id,
      state_id,
      vendor_address,
      bank_id
  )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vendor_type_id,
        vendor_name,
        vendor_mobile,
        vendor_email,
        vendor_GST,
        vendor_status,
        city_id,
        state_id,
        vendor_address,
        bank_id,
      ]
    );
    res.json({ success: true, message: "Vendor added successfully" });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
