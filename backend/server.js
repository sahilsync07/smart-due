const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get("/bill-data.json", (req, res) => {
  fs.readFile("bill-data.json", (err, data) => {
    if (err) {
      res.status(200).json([]);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.get("/biller-data.json", (req, res) => {
  fs.readFile("biller-data.json", (err, data) => {
    if (err) {
      res.status(200).json([]);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.put("/bill-data.json", (req, res) => {
  fs.writeFile("bill-data.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      res.status(500).send("Error saving data");
    } else {
      res.send("Data saved");
    }
  });
});

app.put("/biller-data.json", (req, res) => {
  fs.writeFile("biller-data.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      res.status(500).send("Error saving data");
    } else {
      res.send("Data saved");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
