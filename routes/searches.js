const express = require('express')
const router = express.Router()
const { pool } = require('../dbConfig');
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
var jsonParser = bodyParser.json()

// get the information about the place searched
router.get('/placeinfo', (req, res) => {
    let coordinates = JSON.parse(req.query.coordinates)
    let output = {
        count: '',
        rating: ''
    }
    let qry1 = `select count(distinct(user_id)) from checkin where coordinate->>'latitude'= '${coordinates.latitude}' and coordinate->>'longitude'= '${coordinates.longitude}'`
    let qry2 = `select avg(rating) from checkin where coordinate->>'latitude'= '${coordinates.latitude}' and coordinate->>'longitude'= '${coordinates.longitude}'`
    pool.query(qry1,
        (err, results) => {
            if (err) {
                res.send(err)
            }
            output.count = results.rows[0].count
        }
    )
    pool.query(qry2,
        (err, results) => {
            if (err) {
                res.send(err)
            }
            output.rating = results.rows[0].avg
            res.send(output)
        }
    )
})

// save the information of the place searched   (sendsearch)
router.post('/save', jsonParser, (req, res) => {
    let coordinates = req.body.coordinates
    let location = req.body.location
    let city = req.body.city
    let avgRating = req.body.avgRating
    let userID = req.body.userID

    let qr = `insert into searches(coordinate,location,city,user_id,avg_rating) values ('{"latitude":${JSON.stringify(coordinates.latitude)},"longitude":${JSON.stringify(coordinates.longitude)}}','${location}','${city}','${userID}','${avgRating}')`
    pool.query(qr, (err, results) => {
        if (err) {
            res.send({ message: "error", error: err })
        }
        else {
            res.send({ message: "success", results: results })
        }
    })

})

// recent visitors of the place searched   (listusers)
router.get('/userslist', (req, res) => {
    let coordinates = JSON.parse(req.query.coordinates)
    let qry = `select distinct on(user_id) user_id,date,rating,name,phone,profile_pic,country,country_id from users inner join checkin on checkin.user_id=users.id where coordinate ->> 'latitude'='${coordinates.latitude}' and coordinate->>'longitude'= '${coordinates.longitude}'`
    pool.query(qry,
        (err, results) => {
            if (err) {
                res.send(err)
            }
            res.send(results.rows)
        }
    )
})

module.exports=router