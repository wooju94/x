// 사용자를 만들어주는 페이지
import express from "express"
import * as authController from "../controller/auth.mjs" //로그인 회원가입 처리
import { body } from "express-validator" //입력값 검증 라이브러리
import { validate } from "../middleware/validator.mjs" //커스텀 유효성 검사 미들웨어

const router = express.Router() // 라우터 객체 만들어주기

const validateLogin = [
  body ("userid")
  .trim()
  .isLength({min : 4}).withMessage("아이디는 최소 4자 이상입력")
  .matches(/^[a-z-A-Z0-9]+$/).withMessage("아이디는 영문+숫자만 가능"),
  body("password")
  .trim()
  .isLength({min : 8}).withMessage("비밀번호는 최소 8자 이상"),
  validate, //위 조건들을 검사하고 실패하면 오류 반환
]

//회원가입할 때 추가로 검사할 항목들

const validateSignup = [
  ...validateLogin,  //로그인 검사 조건 포함
  body("name").notEmpty().withMessage("이름을 입력해주세요"),
  body("email").isEmail().withMessage("올바른 이메일 형식이 아닙니다."),
  validate,
]

//POST//auth/sigup 회원가입 처리
router.post("/signup",validateSignup,authController.signup);

//POST/auth/login
router.post("/login",validateLogin,authController.login)

export default router;

/* 흐름 요약  사용자입력(router/auth) > authController.signup 함수호출 
constroller/auth :회원가입 처리            */