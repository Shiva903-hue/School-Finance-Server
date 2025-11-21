import express from "express";
import db from "../DataBase/DBConn.js";
import { roleCheck } from "../middleware/auth.js";

const router = express.Router();

router.post("/add",roleCheck(['User']), async (req, res) => {
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

  const created_by = req.session.user.user_id;
  try {
    await db.promise().query(
      `INSERT INTO tbl_vendor_details 
       (
      user_id,
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
       VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)`,
      [created_by,
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


//! DELETE vendor by ID
// router.delete('/:vendor_id', async (req, res) => {
//   const { vendor_id } = req.params;

//   try {
//     // Delete vendor from database
//     const query = 'DELETE FROM tbl_vendor_details WHERE vendor_id = ?';
    
//     const [result] = await db.promise().query(query, [vendor_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Vendor not found' 
//       });
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: 'Vendor deleted successfully' 
//     });
//   } catch (error) {
//     console.error('Error deleting vendor:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to delete vendor', 
//       error: error.message 
//     });
//   }
// });

//* UPDATE vendor by ID
router.put('/:vendor_id',roleCheck(['User']), async (req, res) => {
  const { vendor_id } = req.params;
  const { 
    vendor_name, 
    vendor_mobile, 
    vendor_email, 
    vendor_GST, 
    vendor_address 
  } = req.body;

  try {
    // Validate required fields
    if (!vendor_name || !vendor_mobile || !vendor_address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vendor name, mobile, and address are required' 
      });
    }

    // Update vendor in database
    const query = `
      UPDATE tbl_vendor_details 
      SET 
        vendor_name = ?, 
        vendor_mobile = ?, 
        vendor_email = ?, 
        vendor_GST = ?, 
        vendor_address = ?
      WHERE vendor_id = ?
    `;
    
    const [result] = await db.promise().query(query, [
      vendor_name,
      vendor_mobile,
      vendor_email || null,
      vendor_GST || null,
      vendor_address,
      vendor_id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vendor not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Vendor updated successfully' 
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update vendor', 
      error: error.message 
    });
  }
});


export default router;
