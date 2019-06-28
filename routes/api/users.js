const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv/config");

const router = express.Router();

// User model
const User = require("../../models/User");

// @type     - POST
// @route    - /api/users
// @desc     - Register new user
// @access   - PUBLIC
router.post("/", (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check for existing user:
    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }
            const newUser = new User({ name, email, password });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }
                    newUser.password = hash;

                    // Save user to db
                    newUser
                        .save()
                        .then(user => {
                            // Sign web token
                            jwt.sign(
                                { id: user._id },
                                process.env.jwtSecret,
                                {
                                    expiresIn: 3600
                                },
                                (err, token) => {
                                    if (err) {
                                        throw err;
                                    }
                                    return res.json({
                                        token,
                                        user: {
                                            id: user._id,
                                            name: user.name,
                                            email: user.email
                                        }
                                    });
                                }
                            );
                        })
                        .catch(err =>
                            res
                                .status(500)
                                .json({ msg: "Error saving user to db " + err })
                        );
                });
            });
        })
        .catch(err => {
            throw err;
        });
});

module.exports = router;
