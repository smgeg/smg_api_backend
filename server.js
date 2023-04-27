const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const customersRoutes = require("./routes/customers");
const coursesRoutes = require("./routes/courses");
const subscriptionsRoutes = require("./routes/subscriptions");
const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const connection = require("./db");

const port = 3005;

app.use(express.json());
app.use(cors());
connection();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ADMIN_URL,
  },
});
io.on("connection", (socket) => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);

// app.post("/users", async (req, res) => {
//   try {
//     const user = await users.create(req.body);
//     res.json(user).status(200);
//     console.log(user);
//   } catch (error) {
//     res.status(500);

//     console.log(error);
//   }
// });

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
