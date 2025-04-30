import * as postRepository from "../data/post.mjs";

// 모든 포스트 / 해당 아이디에 대한 포스트를 가져오는 함수
// query : key=value값
// 예시) /post?userid=apple --> q:apple 
export async function getPosts(req, res, next) {
  const userid = req.query.userid;
  const data = await (userid
    ? postRepository.getAllByUserid(userid)
    : postRepository.getAll());
  res.status(200).json(data);
}

// params : url안에 포함되는 값
// /post/1 --> 1
// id를 받아 하나의 포스트를 가져오는 함수
export async function getPostId(req, res, next) {
  const id = req.params.id;
  const data = await postRepository.getAllById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.staus(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 포스트를 생성하는 함수
export async function createPost(req, res, next) {
  const { userid, name, text } = req.body;
  const posts = await postRepository.create(userid, name, text);
  res.status(201).json(posts);
}

// 포스트 수정하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const post = await postRepository.update(id, text);
  if (!post) {
    res.status(404).json({ message: `${id}번의 포스트를 찾을 수 없습니다.` });
  } else {
    res.status(200).json(post);
  }
  next();
} 

// 포스트 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  const posts = await postRepository.remove(id);
  res.status(200).json(posts);
}