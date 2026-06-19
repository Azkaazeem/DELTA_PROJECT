const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/post.js");
const session = require("express-session");

app.use(session({secret: "mysecretstring"}));
app.get("/text" , (req,res) => {
    res.send("text successful!");
});

app.listen("8080", () => {
    console.log("app is listening on port 8080");
});