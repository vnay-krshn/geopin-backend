const express = require('express')
const router = express.Router()
const { pool } = require('../dbConfig');
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
var jsonParser = bodyParser.json()

// save review and rating    (checkin)
router.post('/save', jsonParser, (req, res) => {
    let coordinates = req.body.coordinates
    let location = req.body.location
    let city = req.body.city
    let review = req.body.review
    let rating = req.body.rating
    let userID = req.body.userID

    if (review === '' && rating === 0) {
        return res.send({ message: "Please enter review and rating", status: 'fail' })
    }
    if (review === '') {
        return res.send({ message: "Please enter review", status: 'fail' })
    }
    if (rating === 0) {
        return res.send({ message: "Please enter rating", status: 'fail' })
    }

    let qr = `insert into checkin(coordinate,location,city,review,rating,user_id) values ('{"latitude":${JSON.stringify(coordinates.latitude)},"longitude":${JSON.stringify(coordinates.longitude)}}','${location}','${city}','${review}','${rating}','${userID}')`
    pool.query(qr, (err, results) => {
        if (err) {
            res.send({ message: "error", error: err })
        }
        else {
            res.send({ message: "success", results: results })
        }
    })

})

// update the review previously posted   (updatefeed)
router.patch('/update', jsonParser, (req, res) => {
    let review = req.body.review
    let rating = req.body.rating
    let userID = req.body.userID
    let coordinates = req.body.coordinates

    if (review === '' && rating === 0) {
        return res.send({ message: "Please enter review and rating", status: 'fail' })
    }
    if (review === '') {
        return res.send({ message: "Please enter review", status: 'fail' })
    }
    if (rating === 0) {
        return res.send({ message: "Please enter rating", status: 'fail' })
    }
    let qr = `update checkin set review = '${review}', rating = '${rating}' where place_id=(select max(place_id) from checkin where user_id='${userID}') and coordinate->>'latitude'= '${JSON.stringify(coordinates.latitude)}' and coordinate->>'longitude'= '${JSON.stringify(coordinates.longitude)}'`
    pool.query(qr, (results) => {
        res.send(results)
    })

})

module.exports=router
