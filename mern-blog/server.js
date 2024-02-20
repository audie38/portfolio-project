require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const sequelize = require("./config/db");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK!");
});

app.get("/api/v1", (req, res) => {
  res.sendFile(path.resolve(path.resolve(), "views", "apiDocs.html"));
});

app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoute"));
app.use("/api/v1/blog", require("./routes/blogRoute"));
app.use("/api/v1/asset", require("./routes/assetRoute"));
app.use("/api/v1/asset/docs", express.static("public/docs"));
app.use("/api/v1/asset/img", express.static("public/uploads"));

app.all("*", (req, res) => {
  res.status(404);
  res.json({ message: "404 Not Found" });
});

app.use(errorHandler);

sequelize
  .sync()
  .then(() => {
    console.log("Connected to DB...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    logEvents(`${err}`, "dbErr.log");
  });
