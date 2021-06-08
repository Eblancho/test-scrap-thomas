const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");

const app = express();

const corsOptions = {
  origin: "http://localhost:5000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const { user } = require("./app/models");
const User = db.user;
db.sequelize.sync().then(() => {
  initial(); // Just use it in development, at the first time execution!. Delete it in production
});



// api routes
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Just use it in development, at the first time execution!. Delete it in production
function initial() {
  User.create({
    id: 4,
    title: "Jean Georges",
    age: "99 ans",
    city: "Marseille",
    url:"libramemoria.com"
  });

  User.create({
    id: 5,
    title: "Roger Alfred",
    age: "64 ans",
    city: "Clermont",
    url:"libramemoria.com"
  });

  User.create({
    id: 6,
    title: "Chloé Jeanne",
    age: "77 ans",
    city: "Lyon",
    url:"libramemoria.com"
  });
}
