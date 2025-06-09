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
const Router = require('./router/router');
const { jwtAccessMiddleware } = require("./middlewares/jwt-access.middleware");
const cors = require('cors');
const router = require("./router/router");

connectDB();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    eq: (a, b) => {
      return a === b;
    }
  }
});

const app = express(); 

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(flash());
app.use(express.static("user-page")); 

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./user-page/views"); 
app.use(session({ secret: "User", resave: false, saveUninitialized: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/user-page', express.static(path.join(__dirname, '/user-page')));



app.use("/", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT}-portda ishlamoqda`);
});
