const dotenv = require("dotenv");
const app = require("./app");
const db = require("./models");

dotenv.config({ path: "./config.env" });
let forSync;

const port = process.env.PORT || 8081;
if (process.env.NODE_ENV === "development") {
  forceSync = true;
}
db.sequelize.sync({ alter: forceSync }).then(() => {
  app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
  });
});
