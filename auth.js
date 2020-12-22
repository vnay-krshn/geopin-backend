const jwt = require('jsonwebtoken')


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
  

  module.exports = { auth };