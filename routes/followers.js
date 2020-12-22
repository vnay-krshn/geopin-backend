const express = require('express')
const router = express.Router()
const { pool } = require('../dbConfig');
const bodyParser = require('body-parser')
const cors = require('cors')

router.use(cors())
var jsonParser = bodyParser.json()

// to check whether the user has saved this visitor or not     (checkfollower)
router.get('/check', (req, res) => {
    let userID = req.query.userID
    let visitorID = req.query.visitorId
    let qry = `select exists(select contact_id from followers where user_id='${userID}' and visitor_id='${visitorID}')`
    pool.query(qry,
        (err, results) => {
            if (err) {
                res.send(err)
            } else {
                res.send(results.rows[0].exists)
            }
        }
    )
})


// save this vistor in my contacts  (savefollower)
router.post('/save', jsonParser, (req, res) => {
    let userID = req.body.userID
    let visitorID = req.body.visitorId
    let visitorName = req.body.visitor_name

    let qr = `insert into followers(user_id,visitor_id,visitor_name) values ('${userID}','${visitorID}','${visitorName}')`
    pool.query(qr, (err, results) => {
        if (err) {
            res.send({ message: "error", error: err })
        }
        else {
            res.send({ message: "success", results: results.rows })
        }
    })

})

// get info about user's follower   (followerinfo)
router.get('/info', (req, res) => {
    let userID = req.query.userID
    let qry = `select distinct visitor_id,visitor_name from followers where user_id='${userID}';`
    pool.query(qry, (err, results) => {
      if (err) {
        res.send(err)
      } else {
        res.send(results)
      }
    })
  })


// delete this visitor from my saved contacts    (deletefollower)
router.delete('/delete', (req, res) => {
    let userID = req.query.userID
    let visitorID = req.query.visitorId
    let qry = `delete from followers where user_id=${userID} and visitor_id=${visitorID}`
    pool.query(qry, (err, results) => {
        if (err) {
            res.send(err)
        } else {
            res.send(results)
        }
    })
})

module.exports=router
