const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const keys = require("./config/keys");

require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

// Middlewares process all incoming req objects before they are
// received by the routes on the server
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 2592000000, // 30 days
    keys: [keys.cookieKey] // encrypts the cookie
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets, such as
  // main.js or main.css
  app.use(express.static("client/build"));

  // If the route is not recognized, the index.html file
  // is served instead
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
