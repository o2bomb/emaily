const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/authRoutes");
const keys = require("./config/keys");

require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();
routes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
