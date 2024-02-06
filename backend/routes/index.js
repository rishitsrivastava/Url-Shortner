const express = require("express");
const userRouter = require("./user");
const url = require("./url")

const router = express.Router();

router.use("/user", userRouter);
router.use("/url", url)

module.exports = router;