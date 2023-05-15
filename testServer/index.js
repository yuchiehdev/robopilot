const express = require("express");
const app = express();
const PORT = 5003;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  })
);

app.post("/router_robotNest/webhooktest", async (req, res) => {
  const { webhookUrl, message } = req.body;

  if (!webhookUrl || !message) {
    res.status(400).json({ error: "webhookUrl and message are required" });
    return;
  }

  try {
    const payload = {
      title: message.title,
      text: message.text,
    };

    await axios.post(webhookUrl, payload);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

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
app.get("/router_robotNest/sensor", (req, res) => {
  const device = req.query.device;
  if (device) {
    if (device === "device_kv8000_trayfeeder_A") {
      const data = require("./mockSensorTrayFeederA.json");
      res.json(data);
    } else if (device === "device_kv8000_trayfeeder_B") {
      const data = require("./mockSensorTrayFeederB.json");
      res.json(data);
    } else {
      const data = require("./mockSensor3.json");
      res.json(data);
    }
  }
});
app.get("/router_robotNest/resource", (req, res) => {
  const data = require("./mockResource.json");
  res.json(data);
});
app.get("/router_robotNest/production", (req, res) => {
  const data = require("./mockProduction.json");
  res.json(data);
});
app.get("/router_robotNest/status", (req, res) => {
  const data = require("./mockStatus.json");
  res.json(data);
});

const secretKey =
  "d8gH5kLm9pN12rStU8xWz0cD6eF3gH7k9lMn0bV1cY2tA4sQ7wE8rZ4tA6sD9fG0";

const createAccessToken = (username, permission) => {
  const expiresIn = 10;
  return jwt.sign({ username, permission }, secretKey, { expiresIn });
};
const createRefreshToken = (username, permission) => {
  const expiresIn = 60 * 60 * 24 * 30;
  return jwt.sign({ username, permission }, secretKey, { expiresIn });
};

app.post("/router_robotNest/signin", (req, res) => {
  const { username, password } = req.body;

  // Verify username and password here (for example, check against a database)
  if (username === "admin" && password === "admin") {
    const userInfo = {
      username: "admin",
      company: null,
      department: null,
      employeeID: null,
      group: null,
      local: true,
      mail: null,
      name: "admin",
      password: "admin",
      permission: "Developer",
      title: null,
    };

    const accessToken = createAccessToken(
      userInfo.username,
      userInfo.permission
    );
    const refreshToken = createRefreshToken(
      userInfo.username,
      userInfo.permission
    );
    userInfo.access_token = accessToken;
    userInfo.refresh_token = refreshToken;

    res.json(userInfo);
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/router_robotNest/refreshtoken", (req, res) => {
  const { refresh_token } = req.body;
  const userInfo = {
    username: "admin",
    permission: "Developer",
  };

  const accessToken = createAccessToken(userInfo.username, userInfo.permission);
  const refreshToken = createRefreshToken(
    userInfo.username,
    userInfo.permission
  );
  const response = {};
  response.access_token = accessToken;
  response.refresh_token = refreshToken;
  res.json(response);
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ error: "Missing token in the header" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    // if (err) {
    //   return res.status(403).json({ error: "Invalid token or token expired" });
    // }
    req.decoded = decoded;
    next();
  });
};
app.get("/router_robotNest/validate", authenticateToken, (req, res) => {
  res.json({ username: "admin", permission: "Developer" });
});

app.post("/router_robotNest/dimmcontrol", authenticateToken, (req, res) => {
  if (req.body.action === "ON") {
    res.json({ dimmcontrol: "on" });
  } else {
    res.json({ dimmcontrol: "off" });
  }
});

app.post(
  "/router_ts5000/device_ts5000/reseterror",
  authenticateToken,
  (req, res) => {
    // res.json({
    //   code: "Fail",
    // });
    res.code(500).json({
      code: "Fail",
    });
  }
);

app.get("/router_robotNest/controlstatus", (req, res) => {
  const data = require("./mockControlStatus.json");
  res.json(data);
});

app.get("/router_robotNest/sensor", (req, res) => {
  const data = require("./mockSensor.json");
  res.json(data);
});

const mockAllUserFilePath = path.join(__dirname, "mockAllUser.json");

const updateMockAllUser = (updatedUserData) => {
  const rawData = fs.readFileSync(mockAllUserFilePath, "utf-8");
  const allUsers = JSON.parse(rawData);

  // Find the user to be updated
  const userIndex = allUsers.findIndex(
    (user) => user.username === updatedUserData.username
  );

  // If user is found, update the user data
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...updatedUserData };

    // Write the updated data back to the JSON file
    fs.writeFileSync(mockAllUserFilePath, JSON.stringify(allUsers, null, 2));
  }
};

app.put("/router_robotNest/user", authenticateToken, (req, res) => {
  const updatedUserData = req.body;

  // Validate the updated user data
  if (!updatedUserData.username || !updatedUserData.group) {
    return res
      .status(400)
      .json({ error: "Missing username or group in the request body" });
  }

  // Update the user information in the mockAllUser.json file
  updateMockAllUser(updatedUserData);

  // Sending the updated user data as a response
  res.code(400).json(updatedUserData);
});
app.put("/router_robotNest/usergroup", authenticateToken, (req, res) => {
  const updatedUserData = req.body;
  res.json(updatedUserData);
});
app.get("/router_robotNest/alluser", authenticateToken, (req, res) => {
  const data = require("./mockAllUser.json");
  res.json(data);
});
app.get("/router_robotNest/usergroup", authenticateToken, (req, res) => {
  const data = require("./mockUserGroup.json");
  res.json(data);
});
app.get("/router_robotNest/userevent", authenticateToken, (req, res) => {
  const data = require("./mockUserEvent.json");
  res.json(data);
});
app.put("/router_robotNest/userevent", authenticateToken, (req, res) => {
  const webhook = req.query.webhook;
  if (!webhook || webhook !== "webhook") {
    return res
      .status(400)
      .json({ error: "Missing webhook in the request query" });
  }
  res.json({
    text: "1",
    status_code: 200,
  });
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
