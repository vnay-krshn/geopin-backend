const express = require('express')
const router = express.Router()
const async = require("async");
const crypto = require("crypto");
const { pool } = require('../dbConfig');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
var jsonParser = bodyParser.json()

Date.prototype.addMinutes = function (m) {
    this.setMinutes(this.getMinutes() + m);
    return this;
}

// update forgot password token and expiry time
router.post('/forgot', jsonParser, function (req, res) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            let email = req.body.email
            let qry1 = `select * from users where email='${email}'`
            pool.query(qry1, async (err, results) => {
                if (results.rows.length === 0) {
                    return res.send({ message: "User does not exist" })
                }

                var newDate = new Date();
                newDate.addMinutes(1);
                let currentDate = (new Date().toISOString()).slice(0, 10) + " " + newDate.toLocaleTimeString().slice(0, 8)

                let qry2 = `update users set resetpasswordtoken='${token}', resetpasswordexpires= '${currentDate}' where email='${email}'`
                pool.query(qry2, async (err) => {
                    done(err, token, email)
                })
            })
        },
        function (token, email, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'cleancode4dev@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: email,
                from: 'cleancode4dev@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://localhost:3000/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.send({ message: 'Password reset link has been sent to your mail' });
                done(err, 'done');
            });
        }
    ],
        function (err) {
            res.send(err)
        })
})

// get forgot password token and check expiry time
router.get('/reset/:token', function (req, res) {
    //User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    let resetpasswordtoken = req.params.token
    current_time = (new Date().toISOString()).slice(0, 10) + " " + (new Date().toLocaleTimeString()).slice(0, 8)
    console.log(current_time)
    let qry = `select * from users where resetpasswordtoken='${resetpasswordtoken}' and resetpasswordexpires > '${current_time}'::timestamp`
    pool.query(qry, function (err, results) {
        if (err) {
            res.send(err)
        }
        if (!results.rows.length) {
            return res.send({ message: "session expired" })
        }
        res.send({ token: req.params.token });
    })
});


// reset password
router.post('/reset/:token', jsonParser, function (req, res) {
    async.waterfall([
        function (done) {
            let resetpasswordtoken = req.params.token
            current_time = (new Date().toISOString()).slice(0, 10) + " " + (new Date().toLocaleTimeString()).slice(0, 8)
            console.log(current_time)
            let qry = `select * from users where resetpasswordtoken='${resetpasswordtoken}' and resetpasswordexpires > '${current_time}'::timestamp`
            pool.query(qry, async (err, results) => {
                if (err) {
                    res.send(err)
                }
                hashedPassword = await bcrypt.hash(req.body.password, 10)
                if (!results.rows.length) {
                    return res.send({ message: "session expired" })
                }
                let email = results.rows[0].email
                console.log(email, hashedPassword)
                let qry4 = `update users set password='${hashedPassword}',resetpasswordtoken=null,resetpasswordexpires=null where email='${email}'`
                pool.query(qry4, (err, results) => {
                    if (err) {
                        res.send(err)
                    } else {
                        //res.send(results)
                        done(err, email)
                    }
                })
            });
        },
        function (email, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'cleancode4dev@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: email,
                from: 'cleancode4dev@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.send({ message: 'Success! Your password has been changed' });
                done(err);
            });
        }
    ], function (err) {
        res.send(err);
    });
});

module.exports=router