// implement your API here
const express = require("express");
const Users = require("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ name: "Ana" });
});

// add user
server.post("/api/users", (req, res) => {
  console.log(req.body);
  if (!req.body.name || !res.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    const newUser = req.body;
    Users.insert(newUser)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res
          .status(500)
          .json({
            errorMessage:
              "There was an error while ssaving the user to the database"
          });
      });
  }
});

const port = 5000;
server.listen(port, () => console.log("Server is running on port", port));
