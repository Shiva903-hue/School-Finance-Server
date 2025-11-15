import db from "../../DataBase/DBConn.js";
import express from "express";

const router = express.Router();

//* Route to get all Vendor Reports
router.get("/vendor-report", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
      v.vendor_type_id,
      vt.vendor_type_name,
      v.vendor_name,
      v.vendor_mobile,
      v.vendor_email,
      v.vendor_GST,
      v.vendor_status,
      v.city_id,
      c.city_name,
      v.state_id,
       s.state_name,
      v.vendor_address,
      v.bank_id,
      b.bank_name
      FROM tbl_vendor_details v
       LEFT JOIN tbl_city_master c ON v.city_id = c.city_id
      LEFT JOIN tbl_state_master s ON v.state_id = s.state_id
      LEFT JOIN tbl_bank_master b ON v.bank_id = b.bank_id
      LEFT JOIN tbl_vendor_type_master vt ON v.vendor_type_id = vt.vendor_type_id
      `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching vendor reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//* Route to get peticash report
router.get("/pettycash-report", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
    p.Vendor_name,
    p.Txn_description,
    p.Txn_Amount,
    p.bank_id,
    b.bank_name
FROM tbl_peticash AS p
LEFT JOIN tbl_bank_master AS b
    ON p.bank_id = b.bank_id;

      `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching peticash reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//* Route to get User Info
router.get("/user-report", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
        SELECT 
    u.user_name,
    u.user_mob,
    u.user_email,
    u.user_type_id,
    ut.user_type_name,
    u.user_status
    FROM tbl_user_master AS u
    LEFT JOIN tbl_user_type_master AS ut
    ON u.user_type_id = ut.user_type_id;`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching peticash reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//* Route to get Self Transaction Report
router.get("/self-transaction-report", async (req,res)=>{
              try {
    const [rows] = await db.promise().query(`
    SELECT 
    t.Txn_type,
    b.bank_name,
    t.Txn_amount,
    tt.transaction_type,
    t.transaction_date,
    t.cheque_dd_number,
    t.rtgs_number
FROM 
    tbl_self_transaction_details t
JOIN 
    tbl_bank_master b ON t.Bank_id = b.bank_id
JOIN 
    tbl_transaction_type_master tt ON t.transaction_type_id = tt.transaction_type_id;

      `);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching peticash reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

//* Route to get Purchase Voucher Report
router.get("/purchase-voucher-report", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
        pvd.voucher_entry_date ,
        pvd.voucher_status , 
        pvd.product_name , 
        pvd.voucher_status,
        pvd.product_qty , 
        pvd.product_rate , 
        pvd.product_amount, 
        pvd.vendor_id ,
        vd.vendor_name
          FROM tbl_purchase_voucher_details pvd
          LEFT JOIN tbl_vendor_details vd ON pvd.vendor_id = vd.vendor_id
          `);
    res.status(200).json(rows);
  }catch(error){
    console.error("Error fetching purchase voucher reports:", error);
  }
})
//* Route to get Purchase Voucher Report
router.get("/transaction-voucher-report", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
        tvd.transaction_type_id ,
        tt.transaction_type,
        tvd.transaction_details , 
        tvd.trns_status , 
        tvd.trns_date,
        tvd.voucher_id ,
        tvd.bank_id , 
        b.bank_name,
        tvd.trns_amount
          FROM tbl_transaction_details tvd
          LEFT JOIN tbl_transaction_type_master tt ON tvd.transaction_type_id = tt.transaction_type_id
          LEFT JOIN tbl_bank_master b ON tvd.bank_id = b.bank_id
          `);
    res.status(200).json(rows);
  }catch(error){
    console.error("Error fetching purchase voucher reports:", error);
  }
})
export default router;
