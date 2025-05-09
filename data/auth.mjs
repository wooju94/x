import MongoDb from "mongodb";
import { getUsers } from "../db/database.mjs";
const ObjectID = MongoDb.ObjectId

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((result) => result.insertedId.toString());
}
export async function login(userid, password) {
  const founduser = users.find((user) => user.userid === userid);
  if (founduser) {
    if (founduser.password == password) {
      return founduser;
    } else {
      return { message: "Password Incorrect" };
    }
  } else {
    return { message: "UserId Incorrect" };
  }
}
export async function findByUserid(userid) {
  return getUsers().find({ userid }).next().then(mapOptionalUser);
}
export async function findByid(id) {
  return getUsers().find({_id : new ObjectID(id)}).next().then(mapOptionalUser)
}
function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;}