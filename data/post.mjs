
import { db } from "../db/database.mjs";

const SELECT_JOIN = 'select u.userid, u.name, u.url, p.idx, p.useridx, p.text, p.createAt from users as u join posts p on u.idx = p.useridx'
const ORDER_DESC = "order by p.createAt desc";


// 모든 포스트를 리턴
export async function getAll() {
  return db.execute(`${SELECT_JOIN} ${ORDER_DESC}`)
  .then((result)=>result[0]);
}

// 사용자 아이디(userid)에 대한 포스트를 리턴
// 조건을 만족하는 모든 요소를 배열로 리턴
export async function getAllByUserid(userid) {
  return db.execute(`${SELECT_JOIN} where u.userid=? ${ORDER_DESC}`, [userid])
  .then((result)=>result[0])
}

// 글 번호(id)에 대한 포스트를 리턴
// 조건을 만족하는 첫 번째 요소 하나를 리턴
export async function getAllById(idx) {
  return db.execute(`${SELECT_JOIN} where p.idx=?`,[idx])
  .then((result)=>result[0][0])
}

// 포스트 작성
export async function create(text,useridx) {
  return db.execute("insert into posts (useridx,text) values(?,?)",
  [useridx,text])
  .then((result)=> getAllById(result[0].insertId));
   
  };
 
  


// post 변경
export async function update(idx, text) {
    return db
    .execute("update posts set text=? where idx=?",[text,idx])
    .then(()=>getAllById(idx)); 
}

// 포스트 삭제
export async function remove(idx) {
  return db.execute('delete from posts where idx=?',[idx]);
}