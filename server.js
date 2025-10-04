const express = require("express");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const { create } = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const connectDB = require("./database/db");
const { jwtAccessMiddleware } = require("./middlewares/jwt-access.middleware");
const cors = require("cors");
const router = require("./router/router");
connectDB();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    eq: (a, b) => a === b,
    json: (ctx) => JSON.stringify(ctx || {}),
    formatCurrency: (val) => {
      if (!val && val !== 0) return '';
      return new Intl.NumberFormat('uz-UZ').format(val) + " so'm";
    }
  },
});

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentPath = req.path
  next()
})

app.use(express.static("user-page"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use('/user-page/views', express.static(path.join(__dirname, 'views')))
app.use("/user-page", express.static(path.join(__dirname, "/user-page")));

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./user-page/views");

app.use(
  session({
    name: 'connect.sid',
    secret: "User",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});
