import setupSession from './routes/session.js';

import express from "express";
import cors from "cors";
import authRouter from "./authroute/auth.js";
import dropdownrouter from "./routes/derpdown.js";
import bankRouter from "./routes/bank.js";
import vendorRouter from "./routes/vendor.js";
import purchaseVoucherRouter from "./routes/purchaseVoucher.js";
import transactionRouter from "./routes/transaction.js";
import petiCashRouter from "./routes/petiCash.js";
import voucherStatusRouter from "./routes/status/voucherStatus.js";
import vendorDetailsRouter from "./routes/status/vendorDetails.js";
import banlistRouter from "./routes/rerports/banklist.js";
import voucherRouter from "./routes/update/voucher.js";
import depositeRouter from "./routes/deposite.js";
import withdrawalRouter from "./routes/withdrawal.js";
import transactionInfoRouter from "./routes/status/trns-info.js";
import transactionUpdateRouter from "./routes/update/transaction.js"; 
import reportRouter from "./routes/Reports/reports.js";

const app = express();

// SESSION - Must be before routes
setupSession(app);

app.use(express.json());

// CORS: allow your frontend origin 
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));



app.use("/api/dropdown", dropdownrouter);

app.use("/api/auth", authRouter);

app.use("/api/bank", bankRouter);
app.use("/api/vendor", vendorRouter);

app.use("/api/generate", purchaseVoucherRouter);
app.use("/api/request", transactionRouter);
app.use("/api/transaction", petiCashRouter);
app.use("/api", transactionInfoRouter);

app.use("/api", voucherStatusRouter);
app.use("/api", vendorDetailsRouter);

app.use("/bank", banlistRouter);

//*update routes
app.use("/api", voucherRouter);
app.use("/api", transactionUpdateRouter);
app.use("/api", depositeRouter);
app.use("/api", withdrawalRouter);


//* Report Routes 

app.use("/api/reports", reportRouter);


app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
