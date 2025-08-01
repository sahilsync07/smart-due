const express = require("express");
const fs = require("fs").promises; // Use promises API for async operations
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// GET /bill-data.json
app.get("/bill-data.json", async (req, res) => {
  try {
    const data = await fs.readFile("bill-data.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read bill data" });
  }
});

// GET /biller-data.json
app.get("/biller-data.json", async (req, res) => {
  try {
    const data = await fs.readFile("biller-data.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read biller data" });
  }
});

// PUT /bill-data.json
app.put("/bill-data.json", async (req, res) => {
  try {
    await fs.writeFile(
      "bill-data.json",
      JSON.stringify(req.body, null, 2),
      "utf8"
    );
    res.send("Data saved");
  } catch (err) {
    res.status(500).send("Error saving bill data");
  }
});

// PUT /biller-data.json
app.put("/biller-data.json", async (req, res) => {
  try {
    await fs.writeFile(
      "biller-data.json",
      JSON.stringify(req.body, null, 2),
      "utf8"
    );
    res.send("Data saved");
  } catch (err) {
    res.status(500).send("Error saving biller data");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
