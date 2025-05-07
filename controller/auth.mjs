// /* 1.회원가입
// ✔ 아이디 중복체크 > 비밀번호 암호화 > 사용자 저장 > 토큰 발급
//   2.로그인
// ✔ 아이디확인 > 비밀번호 비교 > 토큰 발급
// */ 

// import * as authRepository from "../data/auth.mjs" //사용자 정보 저장 조회
// import bcrypt from "bcrypt" // 비밀번호 암호화
// import jwt from "jsonwebtoken" //토큰 발급
// import { config } from "../config.mjs" //환경변수

// const secretKey = config.jwt.secretKey
// const jwtExpiresInSec = config.jwt.expiresInSec
// const bcryptSaltRounds = config.bcrypt.saltRounds

// //jwt 토큰을 만드는 함수

// async function createJwtToken(idx){
//   return jwt.sign ({idx}, secretKey,{expiresIn : jwtExpiresInSec })
// }

// //회원 가입
// export async function signup(req,res,next){
//   const {userid,password,name,email,url} = req.body;


// // 아이디 중복확인
// const found =  await authRepository.findByUserid(userid)
// if (found) {
//   return res.status(409).json({message : "이미 존재하는 아이디입니다."})

// }

// //비밀번호 암호화
// const hashed = await bcrypt.hash(password,bcryptSaltRounds)

// //사용자 저장
// const user = await authRepository.createUser({userid,password:hashed,name,email,url})

// //토큰발급 
// const token = await createJwtToken(user.idx)

// //응답 보내기
// res.status(201).json({token,userid})
// }

// //로그인 
// export async function login(req,res){
//   const {userid,password} = req.body

// //아이디로 사용자 찾기
// const user = await authRepository.findByUserid(userid)
// if(!user){
//   return res.status(401).json({message : "아이디가 없습니다."})
// }
// // 비밀번호 비교
// const isValid = await bcrypt.compare(password, user.password)
// if(!isValid){
//   return res.status(401).json({message : "비밀번호가 틀렸습니다."})

// }
// // 토큰발급
// const token = await createJwtToken(user.id)

// // 응답 보내기
// res.status(200).json({token,userid})

// }



// /* 흐름도

// [HTML 폼 입력]
//    ↓
// [router/auth.mjs - /signup]  
//    ↓
// [controller/auth.mjs - signup 함수]
//    ↓
// [사용자 저장 + 토큰 발급]
//    ↓
// [응답으로 token, userid 전달]

// [HTML 로그인 폼]
//    ↓
// [router/auth.mjs - /login]
//    ↓
// [controller/auth.mjs - login 함수]
//    ↓
// [비번 확인 + 토큰 발급]
//    ↓
// [응답으로 token, userid 전달]


// */ 
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";
const secretKey = config.jwt.secretKey;
const bcryptSaltRounds = config.bcrypt.saltRounds;
const jwtExpiresInDays = config.jwt.expiresInSec;

async function createJwtToken(idx) {
  return jwt.sign({ idx }, secretKey, { expiresIn: jwtExpiresInDays });
}
export async function signup(req, res, next) {
  const { userid, password, name, email, url } = req.body;
  // 회원 중복 체크
  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res
      .status(409)
      .json({ message: `${userid}과 동일한 아이디가 이미 존재합니다.` });
  }
  const hashed = bcrypt.hashSync(password, bcryptSaltRounds);
  // 객체로 보내기 위해 {}로 감싸줘야한다.
  const users = await authRepository.createUser({
    userid,
    password: hashed,
    name,
    email,
    url,
  });
  const token = await createJwtToken(users.idx);
  console.log(token);
  if (users) {
    res.status(201).json({ message: "회원가입 완료!", token, userid });
  }
}

export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    res.status(402).json(`${userid} 아이디를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(402).json({ message: "아이디 또는 비밀번호 확인" });
  }

  const token = await createJwtToken(user.idx);
  res.status(200).json({ token, userid });
}


export async function verify(req, res, next) {
  const id = req.id;
  if (id) {
    res.status(200).json(id);
  } else {
    res.status(401).json({ message: "사용자 인증 실패" });
  }
}


export async function me(req, res, next) {
  const user = await authRepository.findByid(req.id);
  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  res.status(200).json({ token: req.token, userid: user.userid });
}