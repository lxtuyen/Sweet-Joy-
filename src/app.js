const express = require("express");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "sweetjoy-secret",
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.keyword = "";
  next();
});


app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/products.route"));
app.use("/api/cart", require("./routes/Carts.route"));
app.use("/api/orders", require("./routes/Orders.route"));
app.use("/admin", require("./routes/admin.route"));

app.use("/", require("./routes/view.route"));

module.exports = app;