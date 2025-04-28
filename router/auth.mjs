//사용자


import express from "express"
import *as authController from "../controller/auth.mjs"
import { body } from "express-validator"
import { validate } from "../middleware/validator.mjs"

const router = express.Router()





const validateLogin = [
    body("userid").trim()
    .isLength({min:4})
    .withMessage("최소 4자이상 입력")
    .matches(/^[a-zA-Z0-9]*%/)
    .withMessage('특수문자는 사용불가'),
    body("password").trim()
    .isLength({min:4})
    .withMessage("최소 8자이상 입력"),
    validate
   ]

   const validateSingup = [
    ...validateLogin, //위에 로그인을 다 통과 하고
    body("name").trim().notEmpty().withMessage("name을 입력"),
    body("eamil").trim().isEmail().withMessage("이메일 형식 확인"),
    validate,
            
   ]

//회원가입
// POST
//http://127.0.0.1:8080/auth/signup
router.post("/signup",validateSingup,authController.signup)
//로그인
//Post//http://127.0.0.1:8080/auth/login
router.post("/login",validateLogin, authController.login)

// 로그인 유지

export default router