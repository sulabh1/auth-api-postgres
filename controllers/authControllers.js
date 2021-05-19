const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/APPError");
const db = require("./../models");

const signInToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};
const createSendToken = (user, res) => {
  const token = signInToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_In * 3600 * 1000 * 24
    ),

    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.json({
    token,
    user,
  });
};
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
const createResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return resetToken;
};
exports.signUp = catchAsync(async (req, res, next) => {
  let { name, email, password, passwordConfirm } = req.body;
  if (passwordConfirm !== password) {
    return next(
      new AppError("Password and passwordConfirm didnot matched", 401)
    );
  }
  password = await hashPassword(password);

  const user = await db.User.create({
    name,
    email,
    password,
  });
  createSendToken(user, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new APPError("Please provide your Email or password", 400));
  }
  const user = await db.User.findOne({ where: { email } });
  if (
    user ? await verifyPassword(password, user ? user.password : "") : false
  ) {
    createSendToken(user, res);
  }
  return next(new AppError("wrong email or password", 400));
});
// exports.forgetPassword = catchAsync(async (req, res, next) => {
//   const user = await db.User.findOne({ where: { email: req.body.email } });
//   if (!user) return next(APPError("No user found with that email", 404));
//   const resetToken = createResetToken(user);
//   await user.save({ validateBeforeSave: false });

// send mail
//});
// exports.resetPassword = catchAsync(async (req, res, next) => {
//   const hashedPassword = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await db.User.findOne({
//     where:{passwordResetToken: hashedPassword},
//   });

//   if (!user) {
//     return next(new APPError("no user found with that token", 400));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetTokenExpires = undefined;

//   createSendToken(user, res);
// });
