// implement your API here
const express = require("express");
const Users = require("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ name: "Ana", bio: "Parent" });
});

// add user
server.post("/api/users", (req, res) => {
  if (!req.body.name || !res.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    const newUser = req.body;
    Users.insert(newUser)
      .then(user => {
        res.status(201).json(...user, ...req.body);
      })
      .catch(err => {
        res
          .status(500)
          .json({
            errorMessage:
              "There was an error while saving the user to the database"
          });
      });
  }
});

// get all users
server.get("/api/users", (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json({users})
    })
    .catch(err => {
        res.status(500).json({errorMessage: "The users information could not be retrieved."})
    })
})

// get a user by id
server.get(`api/users/:id`, (req, res) => {
    const {id} = req.params;
    Users.findById(id)
    .then(user => {
    if (user) {
        res
        .status(200).json(user)
    } else {
        res.status(404).json({ errorMessage: "The user with the specified ID does not exist" })
        }
    })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be retrieved."})
        })
    })

// delete a user by id 
server.delete(`/api/users/:id`, (req, res) => {
    Users.remove(req.params.id)// need 404 error when the user can't be found by specified id
    .then(removed => {
        if (removed === 0) {
            res.status(404).json({ errorMessage: "The user with the specified id does not exist."})
        } else {
            res.status(200).json({ message: `Successfully removed ${removed} user`})
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "The user could not be removed"})
    })
})

// update a user with specified id 
server.put(`api/users/:id`, (req, res) => {
if (!req.body.name || !req.body.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user."})
} else {
    Users.update(req.params.id, req.body)
    .then(updated => {
        if (updated === 1) {
            res.status(200).json({id: req.params.id, ...req.body})
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: "The user information could not be modified."})
    })
}
})

const port = 5000;
server.listen(port, () => console.log("Server is running on port", port));
