//입구에서 신분증 검사하는 가드

import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
import {config} from "../config.mjs"

const AUTH_ERROR = { message: "인증에러" };
export const isAuth = async (req, res, next) => { 
 
  const authHeader = req.get("Authorization");
  console.log(authHeader);

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  } 

  // Bearer sadnlkjnvsknfla(토큰) --> [1] = 토큰
  const token = authHeader.split(" ")[1];
  console.log(token);
  
  //   검증(디코딩)
  jwt.verify(token, config.jwt.secretKey , async (error, decoded) => {
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