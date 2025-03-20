const express = require("express");
const router = express.Router();

router.get('/index', (req, res, next)=>{
    res.json({message:"This is the index page"});
});

module.exports = router;