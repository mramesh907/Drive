const express = require("express");
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// router.get('/test', (req, res) => {
//     res.send('user test route')
// })
router.get('/register', (req, res) => {
    res.render('register');
})
router.post('/register',
    body('username').trim().isLength({ min: 3 }),
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            });
        }
        // data come from form
        const { username, email, password } = req.body;

        // encrypt password
        const hashPassword = await bcrypt.hash(password, 10)




        const newUser = await userModel.create({ username, email, password: hashPassword })

        res.json(newUser)
        // console.log(req.body);
        // res.send('user register')
    })


router.get('/login', (req, res) => {
    res.render('login')
})
router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data'
            })
        }

        const { username, password } = req.body;

        const user = await userModel.findOne({
            username: username
        })

        if (!user) {
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                message: 'Username or password is incorrect'
            })
        }

        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
        },
            process.env.JWT_SECRET
        )

       res.cookie('token', token)
       res.send('user login')
    })

module.exports = router