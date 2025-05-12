import Mongoose from "mongoose";
import * as postRepository from "../data/post.mjs";
import { text } from "express";
import { useVirtualId } from "../db/database.mjs";

const postSchema = new Mongoose.Schema({

  userid  : {type : String, require : true},
  name: {type : String, require : true},
  url : String,
  text: {type : String, require : true},
  userId: {type : String,require:true},

},
{timestamps : true}
)

useVirtualId(postSchema)

const post = Mongoose.model("post",postSchema)



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
  const data = await postRepository.getById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.staus(404).json({ message: `${id}의 포스트가 없습니다.` });
  }
}

// 포스트를 생성하는 함수
export async function createPost(req, res, next) {
  const { text } = req.body;
  const posts = await postRepository.create(text,req.id);
  res.status(201).json(posts);
}

// 포스트 수정하는 함수
export async function updatePost(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const post = await postRepository.getById(id);
  if(!post){
    return res.status(404).json({message: `${id}의 포스트가 없습니다.`})
  }
  if(post.userId !== req.id){
    return res.sendStatus(403)
  }
    const updated = await postRepository.update(id,text)
  res.status(200).json(updated)
  } 

// 포스트 삭제하는 함수
export async function deletePost(req, res, next) {
  const id = req.params.id;
  const post = await postRepository.getById(id);
  if(!post){
    return res.status(404).json({message: `${id}의 포스트가 없습니다.`})
  }
  if(post.userId !== req.id){
    return res.sendStatus(403)
  }
  await postRepository.remove(id);
  res.sendStatus(204)
}