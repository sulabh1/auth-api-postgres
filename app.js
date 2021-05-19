const express = require("express");
const morgan = require("morgan");
const globalErrHandler = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV) {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/users", require("./routes/userRoutes"));
app.all("*", (req, res, next) => {
  next(new APPError(`cannot find ${req.originalUrl} on this server`));
});
app.use(globalErrHandler);

module.exports = app;
