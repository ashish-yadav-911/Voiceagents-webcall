const varification = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    console.log("Bearer Token:", token);
    next();
  } else {
    console.error("Authorization header missing or invalid");
  }
};

module.exports = varification;
