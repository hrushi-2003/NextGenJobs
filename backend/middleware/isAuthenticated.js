import Jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        message: "user not authenticted",
        success: false,
      });
    }
    const decode = await Jwt.verify(token,process.env.SECRET_KEY);
    if(!decode){
      res.status(401).json({
        message:"Invalid token",
        success:false
      })
    }
    req.id=decode.userId;
    next();
  } catch (error) {}
};
export default isAuthenticated;
