const express = require("express");
const app = express();
const PORT = 5003;
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

app.get("/tshirt", (req, res) => {
  res.status(200).send({
    tshirt: "red",
  });
});

app.post("/tshirt/:id", (req, res) => {
  const { id } = req.params;
  const { logo } = req.body;

  if (!logo) {
    return res.status(400).send({
      message: "Please provide a logo",
    });
  }

  res.send({
    tshirt: `${id} shirt with your logo ${logo}`,
  });
});

let arrayF = [];
const array = [
  31.1, 36.4, 20.18, 21.65, 45, 25.93, 24.8, 38.13, 21.67, 45.14, 26.8, 26.21,
  34.87, 34.95, 22.52, 28.4, 42.79, 45.11, 31.53, 43.05, 22.2, 33.14, 45.31,
  21.76, 45, 38.26, 28.44, 34.35, 46.27, 34.62, 31.64, 44.31, 35.34, 41.45,
  43.83, 30.61, 43.7, 35.31, 40.07, 39.48, 44.79, 32.61, 36.74, 20.13, 33.22,
  45.68, 44.88, 22.19, 20.68, 41.59, 40.13, 35.91, 40.41, 29.73, 34.31, 25.25,
  22.69, 34.94, 46.04, 21.37, 29.56, 28.45, 43.43, 25.85, 44.31, 46.87, 23.88,
  20.2, 29.97, 43.69, 30.04, 29.49, 20.66, 40.95, 20.82, 32.05, 30.3, 20.27,
  48.14, 25.89, 29.07, 28.78, 26.65, 42.02, 36.45, 44.29, 23.76, 26.67, 39.94,
  37.81, 21.59, 41.66, 48.03, 36.21, 46.96, 37.19, 21.77, 28.82, 21.44, 35.72,
];
array.map((item) => {
  arrayF.push(item.toFixed(2));
});

app.get("/test", (req, res) => {
  const data = require("./mockStreamChart.json");
  res.json(data[0].TIME_PP_R);
});

app.get("/router_robotNest/event", (req, res) => {
  const data = require("./mockEvent.json");
  const activation = req.query.activation;
  let responseData = data;

  if (activation) {
    responseData = data.filter(
      (event) => event.activation.toString() === activation
    );
  }

  res.json(responseData);
});
app.get("/router_robotNest/device", (req, res) => {
  const data = require("./mockDevice.json");
  res.json(data);
});
app.get("/router_robotNest/status", (req, res) => {
  const data = require("./mockStatus.json");
  res.json(data);
});

app.post("/pp", (req, res) => {
  try {
    const { index } = req.body;
    const indexInt = parseInt(index);
    if (indexInt > 100 || indexInt < 0) {
      res.status(404).send("index too large or too small");
    } else {
      res.send(arrayF[indexInt]);
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
