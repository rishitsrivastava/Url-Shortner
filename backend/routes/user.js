const express = require("express");
const { User, URL } = require("../db");
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
    try {
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
    } catch(error) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
})

const signinBody = zod.object({
    userName: zod.string().email(),
    password: zod.string()
})

userRouter.post("/signin", async(req, res) => {
    try {
        const {success} = signinBody.safeParse(req.body);
        if(!success) {
            return res.status(411).json({
                message: "Invalid input data"
            })
        }
        const user = await User.findOne({
            userName: req.body.userName
        });

        if(!user) {
            return res.status(411).json({
                error: "Invalid username or password"
            })
        }

        const token = jwt.sign({
            userId : user._id
        }, JWT_Secret);
        res.status(200).json({
            token:token
        })
    }

    catch(error) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
})

userRouter.use(authMiddleware);

userRouter.get("/urls", async (req,res) => {
    try {
        const urls = await URL.find({
            userId: req.user.userId
        });
        res.json(urls)
    }
    catch(error) {
        res.status(500).json({
            error: "Internal server error"
        })
    }
})


module.exports = userRouter;