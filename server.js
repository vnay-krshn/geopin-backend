const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors')
require("dotenv").config();
const app = express();

const checkin = require('./routes/checkin')
const followers = require('./routes/followers')
const password = require('./routes/password')
const searches = require('./routes/searches')
const user = require('./routes/user')
const userprofile = require('./routes/userprofile')
const visitor = require('./routes/visitor')

app.use('/checkin',checkin)
app.use('/followers',followers)
app.use('/password',password)
app.use('/searches',searches)
app.use('/user',user)
app.use('/userprofile',userprofile)
app.use('/visitor',visitor)

const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(cors())
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});