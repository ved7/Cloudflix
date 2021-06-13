const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
const Router = require("./route/routes");
const port = process.env.PORT || 3000;

dotenv.config({ path: "./.env" });
//database stuff
const db = require("./config/key").MONGOURL;
//mongodb connection
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log(err));
//hbs
app.set("view engine", "hbs");
//body-parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//Routers
app.use(Router);
// routes
app.use("/", require("./route/pages"));
app.use("/auth", require("./route/routes"));

app.listen(port, () => console.log(`app listening on port ${port}!`));
