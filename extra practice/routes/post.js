const express = require("express");
const router = express.Router();

router.get("/" , (req , res) => {
    res.send("All posts");
});

router.get("/edit" , (req , res) => {
    res.send("Edit this user");
});

router.get("/update" , (req , res) => {
    res.send("Update this user");
});

router.get("/delete" , (req , res) => {
    res.send("Delete this user");
});

module.exports = router;