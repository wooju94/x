/*
Authorization
- 본인의 신원을 증명하는 과정

Authorization 헤더
- http 요청을 보낼때 헤더(Headers)라는 곳에 "추가정보"를 담을 수 있음
- 인증정보를 담는 표준 위치가   Authorization 헤더임

Bearer
- Authorization에 실을 수 있는 방식(타입)중 하나
- Bearer는 토큰 (token)을 가지고 있다는 것 자체로 인증함
Authorization : Bearer <토큰>
*/ 

import jwt, { decode } from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
const AUTH_ERROR = { message: "인증에러" };
export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  }
  const token = authHeader.split(" ")[1];
  // Bearer sadnlkjnvsknfla(토큰) --> [1] = 토큰
  console.log(token);

  //   검증
  jwt.verify(token, "abcdefg1234%^&*", async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log(decoded.id);
    const user = await authRepository.findByid(decoded.id);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("user.id: ", user.id);
    console.log("user.userid :", user.userid);
    req.userid = user.userid;
    next();
  });
};