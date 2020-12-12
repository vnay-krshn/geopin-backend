const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
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
let refreshTokens = []

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

app.post('/refreshtoken', (req, res, next) => {
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

app.get('/userlogin', auth, async (req, res) => {
  try {
    pool.query(`select * from users where id='${req.user.id}'`, (err, results) => {
      res.json(results.rows[0]);
    })
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
})

async function auth(req, res, next) {
  let token = req.header("token");
  // if (!token) return res.status(401).json({ message: "Auth Error" });
  // try {
  //   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  //   console.log(decoded)
  //   req.user = decoded.user;
  //   next();
  // } catch (e) {
  //   console.error(e);
  //   res.status(500).send({ message: "Invalid Token" });
  // }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (payload) {
      req.user = payload.user;
      next();
    } else if (err.message === "jwt expired") {
      return res.json({
        success: false,
        message: "Access token expired"
      });
    } else {
      console.log(err);
      return res
        .status(403)
        .json({ err, message: "User not authenticated" });
    }
  });
};

Date.prototype.addMinutes= function(m) { 
  this.setMinutes(this.getMinutes() + m); 
  return this; 
}

app.post('/forgot', jsonParser, function (req, res) {
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
        let currentDate=(new Date().toISOString()).slice(0,10) + " "+ newDate.toLocaleTimeString().slice(0,8)

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
        res.send({message:'Password reset link has been sent to your mail'});
        done(err, 'done');
      });
    }
  ],
    function (err) {
      res.send(err)
    })
})

app.get('/reset/:token', function (req, res) {
  //User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  let resetpasswordtoken = req.params.token
  current_time=(new Date().toISOString()).slice(0,10) + " "+ (new Date().toLocaleTimeString()).slice(0,8)
  console.log(current_time)
  let qry = `select * from users where resetpasswordtoken='${resetpasswordtoken}' and resetpasswordexpires > '${current_time}'::timestamp`
  pool.query(qry, function (err, results) {
    if(err){
      res.send(err)
    }
    if (!results.rows.length) {
      return res.send({ message: "password expired" })
    }
    res.send({ token: req.params.token });
  })
});

app.post('/reset/:token',jsonParser, function (req, res) {
  async.waterfall([
    function (done) {
      let resetpasswordtoken = req.params.token
      current_time=(new Date().toISOString()).slice(0,10) + " "+ (new Date().toLocaleTimeString()).slice(0,8)
      console.log(current_time)
      let qry = `select * from users where resetpasswordtoken='${resetpasswordtoken}' and resetpasswordexpires > '${current_time}'::timestamp`
      pool.query(qry, async(err, results)=>{
        if(err){
          res.send(err)
        }
        hashedPassword = await bcrypt.hash(req.body.password, 10)
        if (!results.rows.length) {
          return res.send({ message: "password expired" })
        }
      let email = results.rows[0].email
      console.log(email, hashedPassword)
      let qry4 = `update users set password='${hashedPassword}',resetpasswordtoken=null,resetpasswordexpires=null where email='${email}'`   
      pool.query(qry4,(err,results)=>{
        if(err){
          res.send(err)
        }else{
          //res.send(results)
          done(err,email)
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
      res.send({message:'Success! Your password has been changed'});
      done(err);
    });
  }
    ], function (err) {
    res.send(err);
  });
  });

app.patch('/update', jsonParser, (req, res) => {
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

app.get('/followerpic', (req, res) => {
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



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});