const express = require('express')
const router = express.Router()
const { pool } = require('../dbConfig');
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
var jsonParser = bodyParser.json()

// edit user profile
router.patch('/update', jsonParser, (req, res) => {
    let username = req.body.name
    let email = req.body.email
    let country = req.body.country
    let countryID = req.body.countryID
    let countryIcon = req.body.country_icon
    let phone = req.body.phone
    let id = req.body.id
    let profilePic = req.body.profile_pic

    let qr = `update users set name = '${username}', email = '${email}', country = '${country}', country_id='${countryID}',country_icon='${countryIcon}', phone='${phone}', profile_pic='${profilePic}' where id='${id}'`
    pool.query(qr, (err, results) => {
        if (err) {
            res.send({ message: "updation failed", result: err })
        }
        else {
            res.send({ message: "updation success" })
        }
    })

})

// latest search    (latestsearch)
router.get('/recentsearch', (req, res) => {
    let userID = req.query.userID
    let qry = `select location,avg_rating,date,search_id from searches where user_id='${userID}' order by search_id desc`
    pool.query(qry,
        (err, results) => {
            if (err) {
                res.send(err)
            } else {
                res.send(results.rows)
            }
        }
    )
})


module.exports=router