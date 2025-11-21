import db from "../../DataBase/DBConn.js";
import express from "express";
import { roleCheck } from "../../middleware/auth.js";

const router = express.Router();
//*fetch Banl list for Reports
router.get("/list",roleCheck(['User','Admin','Superviser','Banker']), async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
       b.bank_id,
       b.bank_name,
       b.bank_branch,
       b.city_id,
       c.city_name,
       b.state_id,
       s.state_name,
       b.bank_address,
       b.bank_type
      FROM tbl_bank_master b
      LEFT JOIN tbl_city_master c ON b.city_id = c.city_id
      LEFT JOIN tbl_state_master s ON b.state_id = s.state_id
      ORDER BY b.bank_id ASC`
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bank details found" });
    }
    res.json({ success: true, bankDetails: rows });
  } catch (error) {
    console.error("Error fetching bank list:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//* get only banks whose type is self
router.get("/self", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
    bank_id,
    bank_name,
    bank_type,
    bank_amount
FROM 
    tbl_bank_master
WHERE 
    bank_type = 'Self'`
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bank details found" });
    }
    res.json({ success: true, bankDetails: rows });
  } catch (error) {
    console.error("Error fetching bank list:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
