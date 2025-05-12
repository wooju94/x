const userSchema = new Mongoose.Schema(
  {
    userid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    url: String
  },
  { versionKey: false }
);

useVirtualId(userSchema);

const User = Mongoose.model("User", userSchema);

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}

export async function findByUserid(userid) {
  return User.findOne({ userid });
}

export async function findByid(id) {
  return User.findById(id);
}
