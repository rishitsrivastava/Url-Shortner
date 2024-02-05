const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const { authMiddleware } = require("../middleware");
const { JWT_Secret } = require("../config");

const signupBody = zod.object({
    userName : zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

userRouter.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    const person = await User.findOne({
        userName: req.body.userName
    });
    if(!success) {
        return res.status(411).json({
            msg: "Email already taken / Incorrect inputs"
        })
    }
    if(person) {
        return res.status(411).json({
            msg: "user already exists"
        });
    }

    const user = await User.create({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userID = user._id;

    const token = jwt.sign({
        userID
    }, JWT_Secret)

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    userName: zod.string().email(),
    password: zod.string()
})

userRouter.post("/signin", async(req, res) => {
    const {success} = signinBody.safeParse(req.body);
    if(!success) {
        return res.status(411).json({
            message: "email already taken or incorrect inputs"
        })
    }
    const user = await User.findOne({
        userName: req.body.userName,
        password: req.body.password
    });
    if(user) {
        const token = jwt.sign({
            userId : user._id
        }, JWT_Secret);
        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        message: "error while logging in"
    })
})


module.exports = userRouter;