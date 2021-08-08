const express = require("express");
const User = require("../models/user");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login",[
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
], authController.postLogin);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("សូមបញ្ចូល Email ដែលត្រឹមត្រូវ")
    .custom((value, {req}) => {
      return User.findOne({
        email: value
      })
      .then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            'Email already exists, Please kindly pick a another one. '
          )
        }
      })
    }).normalizeEmail(),


    body("password", "Your password must atleast 5 charactor long with numbers and text.")
    .isLength({min: 5}).isAlphanumeric().trim(),
    body('confirmPassword').trim().custom((value, {req}) => {
      if(value !== req.body.password){
        throw new Error('Passwords have to match!');
      }
      return true;
    })
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
