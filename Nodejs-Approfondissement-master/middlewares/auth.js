const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw new UnauthorizedError("Token manquant");
    }
    
    const decoded = jwt.verify(token, config.secretJwtToken);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError("Utilisateur non trouvé");
    }
    
    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      age: user.age
    };
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError("Token invalide"));
    }
  }
};
