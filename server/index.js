// 


import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use Atlas connection string here 👇tDYBCdnvYitxvJKP
const mongoURI = process.env.MONGO_URI


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const dateSchema = new mongoose.Schema({
  datetime: { type: String, required: true }
});
//
const DateLog = mongoose.model("DateLog", dateSchema);

// POST: Save new datetime
app.post("/api/dates", async (req, res) => {
  try {
    const { datetime } = req.body;
    if (!datetime) return res.status(400).json({ error: "Datetime is required" });

    const newLog = new DateLog({ datetime });
    await newLog.save();
    res.json({ message: "Datetime stored successfully", datetime });
  } catch (err) {
    res.status(500).json({ error: "Failed to save datetime" });
  }
});

// GET: Fetch all datetimes
app.get("/api/dates", async (req, res) => {
  try {
    const logs = await DateLog.find().sort({ _id: -1 });
    res.json(logs.map(log => log.datetime));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch datetimes" });
  }
});

app.delete("/api/dates", async (req, res) => {
  try {
    await DateLog.deleteMany({}); // ✅ remove all documents in the collection
    res.json({ message: "All dates deleted from database" });
  } catch (err) {
    console.error("❌ Error deleting dates:", err);
    res.status(500).json({ error: "Failed to delete dates" });
  }
});


const PORT = process.env.port || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
