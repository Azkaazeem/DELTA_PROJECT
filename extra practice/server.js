const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/post.js");

app.listen("8080", () => {
    console.log("app is listening on port 8080");
});

app.get("/" , (req , res) => {
    res.send("User home page");
});

app.use("/user" , user);
app.use("/posts" , post);