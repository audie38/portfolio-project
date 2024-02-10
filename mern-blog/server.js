require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK!");
});

app.get("/api/v1", (req, res) => {
  res.sendFile(path.resolve(path.resolve(), "views", "apiDocs.html"));
});

app.use("/api/v1/asset/docs", express.static("public/docs"));

app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
