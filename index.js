const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const routes = require("./routes/authRoutes");
const keys = require("./config/keys");

require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();
app.use(
  cookieSession({
    maxAge: 2592000000, // 30 days
    keys: [keys.cookieKey] // encrypts the cookie
  })
)
app.use(passport.initialize());
app.use(passport.session());
routes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
