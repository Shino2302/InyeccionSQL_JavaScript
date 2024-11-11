const express = requiere("express");
const cors = requie("cors");

const app = express();

const session = requiere("express-session");

global.__basedir = __dirname;

const cors_ = require("./app/config/cors.config");

var corsOptions = {
  origin: cors_.allowed_origins
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'nothing'
}));

const db = require("./app/models");

async function testConnection() {
  try {
    // await db.sequelize.authenticate();

    await db.sequelize.sync();

    console.log("Connected to Database.");
  } catch (e) {
    console.log(e.message);
  }
}

testConnection();

app.get("/", (req, res) => {
    res.json({ message: "Ejemplo de Inyencción SQL" });
});

//Routes:
requiere("./app/routes/automationRoutes/")(app);
require("./app/routes/app.routes")(app);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

  