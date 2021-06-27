const express = require("express");
const router = express.Router();
const filePath = `${__dirname}/../users.json`;

const fs = require("fs");

const bufferFile = fs.readFileSync(filePath);
const data = bufferFile.toString();
// /users Route
router.get("/", (req, res) => {
  res.send(data);
});

// create new user
router.post("/", (request, response) => {
  // get the request body
  const newPerson = request.body;
  // convert the file json to js
  const list = JSON.parse(data);

  // adding new item in the list
  list.push({ id: Date.now(), ...newPerson });
  console.log("new list file ", list);
  // convert json
  const newList = JSON.stringify(list);
  // write new array of user file users.json
  fs.writeFile(
    filePath,
    newList,
    (err) => err && new Error("something while writing the file ")
  );
  response.send(" new user added successfully");
});

// get one user by Id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  const list = JSON.parse(data);
  // here we need to find the user
  const user = list.find((el) => el.id === parseInt(id, 10));

  if (!user) {
    throw new Error("user not found");
  }

  res.send({ user });
});
// delete
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const list = JSON.parse(data);

  const filteredList = list.filter((user) => user.id != id);

  const newList = JSON.stringify(filteredList);

  fs.writeFile(filePath, newList, (err) => err && new Error("oups"));
  res.send({ message: "user delete sucessfully", userId: id });
});

// update
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  const list = JSON.parse(data);

  const updatedList = list.map((user) =>
    user.id == id ? { ...user, ...updatedUser } : user
  );

  const newListToWrite = JSON.stringify(updatedList);
  fs.writeFile(filePath, newListToWrite, (err) => err && new Error("upsssi"));
  res.send({
    message: "user updated successfully ",
    modification: updatedUser,
  });
});

module.exports = router;
