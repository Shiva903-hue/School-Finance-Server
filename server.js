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



const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/dropdown", dropdownrouter);

app.use("/api/auth", authRouter);

app.use("/api/bank", bankRouter);
app.use("/api/vendor", vendorRouter);

app.use("/api/generate", purchaseVoucherRouter);
app.use("/api/request", transactionRouter);
app.use("/api/transaction", petiCashRouter);

app.use("/api", voucherStatusRouter);
app.use("/api", vendorDetailsRouter);

app.use("/bank", banlistRouter);





app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
