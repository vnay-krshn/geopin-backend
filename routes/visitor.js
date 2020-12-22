const express = require('express')
const router = express.Router()
const { pool } = require('../dbConfig');
const cors = require('cors')

router.use(cors())

// get the details for the visitor profile  (visitor profile)
router.get('/profile', (req, res) => {
    let visitorID = req.query.userID
    let qry = `select id,name,phone,country,country_icon,email,profile_pic from users where id='${visitorID}'`
    pool.query(qry,
        (err, results) => {
            if (err) {
                res.send(err)
            }
            res.send(results.rows)
        }
    )
})

// get the places logged by the visitor (visitoractivity)
router.get('/acitvity', (req, res) => {
    let visitorID = req.query.userID
    //let qry = `select distinct on(location) location,user_id,city,review,rating,date,place_id from checkin where user_id='${visitorID}' order by location,place_id desc`
    let qry = `select distinct location,user_id,city,review,rating,date,place_id from checkin where user_id='${visitorID}' order by place_id desc;`
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