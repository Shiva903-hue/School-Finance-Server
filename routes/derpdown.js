import express from "express";
import db from "../DataBase/DBConn.js";

const router = express.Router();
 
//* Fetch all city from DB
router.get("/city", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM Tbl_city_master"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No cities found" });

    res.json({ success: true, cities: rows });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get all states
router.get("/state", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM tbl_state_master"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No states found" });

    res.json({ success: true, states: rows });

  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get all vendor types */
router.get("/vendor-types", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT vendor_type_id, vendor_type_name FROM tbl_vendor_type_master ORDER BY vendor_type_name ASC"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No vendor types found" });

    res.json({ success: true, vendorTypes: rows });
  } catch (error) {
    console.error("Error fetching vendor types:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get all vendor names */
router.get("/vendor-names", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT vendor_id, vendor_name FROM tbl_vendor_details ORDER BY vendor_name ASC"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No vendor names found" });

    res.json({ success: true, vendorNames: rows });
  } catch (error) {
    console.error("Error fetching vendor types:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get banks types */
router.get("/banks", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT bank_id, bank_name, bank_account_no FROM tbl_bank_master ORDER BY bank_name ASC"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No banks found" });

    res.json({ success: true, banks: rows });
  } catch (error) {
    console.error("Error fetching banks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get voucher ids with vendor names 
router.get("/voucher-ids", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        pv.voucher_id, 
        pv.vendor_id, 
        pv.product_name, 
        pv.product_amount,
        COALESCE(vd.vendor_name, 'Unknown Vendor') as vendor_name
      FROM tbl_purchase_voucher_details pv
      LEFT JOIN tbl_vendor_details vd ON pv.vendor_id = vd.vendor_id
      ORDER BY pv.voucher_id ASC`
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No voucher IDs found" });

    res.json({ success: true, voucherIDs: rows });
  } catch (error) {
    console.error("Error fetching voucher IDs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get transaction types
router.get("/transaction-types", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT transaction_type_id,transaction_type FROM tbl_transaction_type_master ORDER BY transaction_type_id ASC"
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "No transaction types found" });

    res.json({ success: true, transactionTypes: rows });
  } catch (error) {
    console.error("Error fetching transaction types:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;