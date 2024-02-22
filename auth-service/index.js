const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
app.use(express.json());
const User = require("../auth-service/User");

const dbUrl =
  "";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dbUrl, connectionParams)
  .then(() => {
    console.info("Connected to Auth DB");
  })
  .catch((e) => {
    console.log("Error", e);
  });

// Register
// Login

app.post("/auth/login", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User doesn't exists" });
  } else {
    // check for password
    if (password !== user.password) {
      return res.json({ message: "Password Incorrect" });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      if (err) console.log(err);
      else {
        return res.json({ token: token });
      }
    });
  }
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    newUser.save();
    return res.json(newUser);
  }
});

app.listen(PORT, () => {
  console.log(`Auth service at ${PORT}`);
});
