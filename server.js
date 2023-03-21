const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const customersRoutes = require("./routes/customers");
const connection = require("./db");

const port = 3005;

app.use(express.json());
app.use(cors());
connection();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/customers", customersRoutes);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
