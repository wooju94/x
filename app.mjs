//서버 시작파일
import express from "express"; //웹서버를 쉽게 만들수 있게 도와줌
import postsRouter from "./router/posts.mjs"; // 게시글 라우터 연걸
import authRouter from "./router/auth.mjs"; // 회원가입/로그인 라우터 연결
import { config } from "./config.mjs"; // 환경변수 읽어오기
import { db } from "./db/database.mjs";


const app = express(); //서버 만들기

app.use(express.json());

app.use("/posts", postsRouter); //posts로 시작하면 postsRouter로 보냄
app.use("/auth", authRouter); // "/auth"로 시작하면 authRouter로 보냄

app.use((req, res, next) => { // 그 외에 없는 페이지 요청하면 404 에러보내기
  res.sendStatus(404);
});

// db.getConnection().then((connection) => console.log(connection))
app.listen(config.host.port) //서버 실행하기