module.exports = (app) => {
    const users = require("../../controllers/users.controller");
   
    var router = require("express").Router();

    router.post("/", users.createUser);
    router.get("/", users.getUsers);

    app.use("/users", router);
}