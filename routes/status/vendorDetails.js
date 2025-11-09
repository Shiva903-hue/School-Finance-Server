import express from "express";
import db from "../../DataBase/DBConn.js";

const router = express.Router();

//* get vendor details
router.get("/vendor-info", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT vendor_id, vendor_name, vendor_email, vendor_mobile, vendor_address FROM tbl_vendor_details ORDER BY vendor_id ASC"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No vendor details found" });

    res.json({ success: true, vendorDetails: rows });
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;