const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const app = express();
let billData = [];
let billerData = [];

app.use(express.json());
app.use(cors());

// Load data on startup
const loadData = async () => {
  try {
    const billDataContent = await fs.readFile("bill-data.json", "utf8");
    billData = JSON.parse(billDataContent);
  } catch (err) {
    console.log("No bill-data.json, starting empty");
  }
  try {
    const billerDataContent = await fs.readFile("biller-data.json", "utf8");
    billerData = JSON.parse(billerDataContent);
  } catch (err) {
    console.log("No biller-data.json, starting empty");
  }
};
loadData();

// GET /bill-data.json
app.get("/bill-data.json", (req, res) => {
  res.json(billData);
});

// GET /biller-data.json
app.get("/biller-data.json", (req, res) => {
  res.json(billerData);
});

// PUT /bill-data.json
app.put("/bill-data.json", (req, res) => {
  billData = req.body;
  fs.writeFile("bill-data.json", JSON.stringify(billData, null, 2), "utf8")
    .then(() => res.send("Data saved"))
    .catch(() => res.status(500).send("Error saving bill data"));
});

// PUT /biller-data.json
app.put("/biller-data.json", (req, res) => {
  billerData = req.body;
  fs.writeFile("biller-data.json", JSON.stringify(billerData, null, 2), "utf8")
    .then(() => res.send("Data saved"))
    .catch(() => res.status(500).send("Error saving biller data"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
