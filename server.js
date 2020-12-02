const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(cors())
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

let users = { password: '' }

app.post('/uploadtodb',(req,res)=>{
  console.log(req.body)
  // pool.query(`insert into temp(images) values('${imageFile}')`,(err,results)=>{
  //   if(err){
  //     res.send(err)
  //   }else{
  //     res.send(results)
  //   }
  // })
})

app.get('/getfromdb',(req,res)=>{
  pool.query(`select images from temp where id=1`,(err,results)=>{
    if(err){
      res.send(err)
    }else{
      res.send(results)
    }
  })
})//test

app.post('/register', jsonParser, (req, res) => {
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
      return res.send({ message: "email already exists" })
    }
    hashedPassword = await bcrypt.hash(password, 10)
    let qry2=`insert into users(name, email, password, country, country_icon, phone,country_id,profile_pic) values('${username}','${email}','${hashedPassword}','${country}','${countryIcon}','${phone}','${countryID}','${profilePic}') returning id`
    pool.query(qry2, (err, results) => {
      const payload = {
        user: {
          id: results.rows[0].id
        }
      };
      jwt.sign(payload, "randomString", { expiresIn: 10000 },(err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
       );
    })

  })
})

app.post('/login', jsonParser, (req, res) => {
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
    jwt.sign(
      payload,
      "randomString", {
      expiresIn: 3600
    },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token
        });
      }
    );

  })
})

app.get('/userlogin', auth, async (req, res) => {
  try {
    pool.query(`select * from users where id='${req.user.id}'`, (err, results) => {
      res.json(results.rows[0]);
    })
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
})

function auth(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });
  try {
    const decoded = jwt.verify(token, "randomString");
    console.log(decoded)
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};

app.patch('/update', jsonParser, (req, res) => {
  let username = req.body.name
  let email = req.body.email
  let country = req.body.country
  let countryID = req.body.countryID
  let countryIcon = req.body.countryIcon
  let phone = req.body.phone
  let id = req.body.id
  let profilePic= req.body.profile_pic
    
  let qr = `update users set name = '${username}', email = '${email}', country = '${country}', country_id='${countryID}',country_icon='${countryIcon}', phone='${phone}', profile_pic='${profilePic}' where id='${id}'`
  pool.query(qr, (err, results) => {
    if (err) {
      res.send({ message: "updation failed" , result:err})
    }
    else {
      res.send({ message: "updation success" })
    }
  })

})

app.post('/checkin', jsonParser, (req, res) => {
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

app.patch('/updatefeed', jsonParser, (req, res) => {
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

app.get('/placeinfo', (req, res) => {
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

app.post('/sendsearch', jsonParser, (req, res) => {
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

app.get('/listusers', (req, res) => {
  let coordinates = JSON.parse(req.query.coordinates)
  let qry = `select distinct on(user_id) user_id,date,rating,name,phone,profile_pic,country from users inner join checkin on checkin.user_id=users.id where coordinate ->> 'latitude'='${coordinates.latitude}' and coordinate->>'longitude'= '${coordinates.longitude}'`
  pool.query(qry,
    (err, results) => {
      if (err) {
        res.send(err)
      }
      res.send(results.rows)
    }
  )
})

app.get('/visitorprofile', (req, res) => {
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

app.get('/visitoracitvity', (req, res) => {
  let visitorID = req.query.userID
  let qry = `select distinct on(location) location,user_id,city,review,rating,date,place_id from checkin where user_id='${visitorID}' order by location,place_id desc`
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

app.get('/latestsearch', (req, res) => {
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

app.get('/checkfollower', (req, res) => {
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


app.post('/savefollower', jsonParser, (req, res) => {
  let userID = req.body.userID
  let visitorID = req.body.visitorId

  let qr = `insert into followers(user_id,visitor_id) values ('${userID}','${visitorID}')`
  pool.query(qr, (err, results) => {
    if (err) {
      res.send({ message: "error", error: err })
    }
    else {
      res.send({ message: "success", results: results.rows })
    }
  })

})

app.delete('/deletefollower', (req, res) => {
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

app.get('/followerpic',(req,res)=>{
  let userID= req.query.userID
  let qry = `select distinct on(visitor_id) visitor_id from followers where user_id='${userID}';`
  pool.query(qry,(err,results)=>{
    if(err){
      res.send(err)
    }else{
      res.send(results)
    }
  })
})



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});