import * as postRepository from "../data/auth.mjs";

export async function signup(req, res, next) {
  try {
    const { userid, password, name, email } = req.body;
    const users = await postRepository.createUser(userid, password, name, email);
    if (users) {
      res.status(201).json(users);
    } else {
      res.status(400).json({ message: "회원가입에 실패했습니다." });
    }
  } catch (error) {
    next(error);  // 에러 미들웨어로 전달
  }
}

export async function login(req, res, next) {
  try {
    const { userid, password } = req.body;
    const user = await postRepository.login(userid, password);
    if (user) {
      res.status(200).json({ message: `${userid}님 로그인 완료!` });
    } else {
      res.status(404).json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요` });
    }
  } catch (error) {
    next(error);
  }
}



export async function me(req,res){
    if (req.session.user){
        res.json(req.session.user)
    } else{
        res.status(401).send("로그인이 필요합니다.")
    }
}

export async function logout(req,res){
    req.session.destroy(()=>{
        res.send("로그아웃 되었습니다.")
    })
};