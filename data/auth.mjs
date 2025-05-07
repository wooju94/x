import { db } from "../db/database.mjs"
  
  export async function findByUserid(userid){
        return db
        .execute("select * from users where userid=?",[userid])
        .then((result)=>(result[0][0]));
  }
 
  export async function findByid(idx){
    return db
    .execute("select* from users where idx=?", [idx])
    .then((result)=> result[0][0]);
  }
 
  export async function createUser(user) {
    const { userid, password, name, email, url } = user;
    return db
      .execute(
        "insert into users (userid, password, name, email, url) values (?, ?, ?, ?, ?)",
        [userid, password, name, email, url]
      )
      .then((result) => result[0].insertId);
  }
      
    
    // user.push(user) //배열에 사용자 추가
    // return users
  
