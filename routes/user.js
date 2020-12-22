const express = require('express')
const router = express.Router()
const { pool } = require('../dbConfig');
const { auth } = require('../auth')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
var jsonParser = bodyParser.json()
let users = { password: '' }
let refreshTokens = []

// user registration
router.post('/register', jsonParser, (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let country = req.body.country
    let countryIcon = req.body.countryIcon
    let countryID = req.body.countryID
    let phone = req.body.phone
    let password = req.body.password
    let profilePic = "https://www.flaticon.com/svg/static/icons/svg/848/848043.svg"

    let qry1 = `select * from users where email='${email}'`
    pool.query(qry1, async (err, results) => {
        if (results.rows.length > 0) {
            return res.send({ message: "Email already exists" })
        }
        hashedPassword = await bcrypt.hash(password, 10)
        let qry2 = `insert into users(name, email, password, country, country_icon, phone,country_id,profile_pic) values('${username}','${email}','${hashedPassword}','${country}','${countryIcon}','${phone}','${countryID}','${profilePic}') returning id`
        pool.query(qry2, (err, results) => {
            const payload = {
                user: {
                    id: results.rows[0].id
                }
            };
            jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 10000 }, (err, token) => {
                if (err) throw err;
                res.status(200).json({ token });
            }
            );
        })

    })
})

//user login
router.post('/login', jsonParser, (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let qry1 = `select * from users where email='${email}'`
    pool.query(qry1, async (err, results) => {
        if (results.rows.length === 0) {
            return res.send({ message: "user does not exist" })
        }
        users.password = results.rows[0].password
        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch) {
            return res.send({ message: "Incorrect Password !" });
        }
        const payload = {
            user: {
                id: results.rows[0].id
            }
        };
        // jwt.sign( payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 },
        //   (err, token) => {
        //     if (err) throw err;
        //     res.status(200).json({ token });
        //   }
        // );
        let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "100s" })
        let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
        refreshTokens.push(refreshToken)
        return res.status(201).json({ token: accessToken, refreshToken: refreshToken })
    })
})

// refresh token
router.post('/refreshtoken', (req, res, next) => {
    const refreshToken = req.header("token")
    // if (refreshToken == null) return res.sendStatus(401)
    // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    //   if (err) return res.sendStatus(403)
    //   console.log(payload)
    //   const accessToken = generateAccessToken(payload)
    //   res.json({ accessToken: accessToken })
    // })
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.json({ message: "Refresh token not found, login again" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (!err) {
            const payloadUser = {
                user: {
                    id: payload.user.id
                }
            };
            const accessToken = jwt.sign(payloadUser, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "100s"
            });
            return res.json({ success: true, accessToken });
        } else {
            return res.json({
                success: false,
                message: "Invalid refresh token"
            });
        }
    });

})

// get the info of the user logged in   (userlogin)
router.get('/userinfo', auth, async (req, res) => {
    try {
        pool.query(`select * from users where id='${req.user.id}'`, (err, results) => {
            res.json(results.rows[0]);
        })
    } catch (e) {
        res.send({ message: "Error in Fetching user" });
    }
})


module.exports=router

