const users = new Map(/*socket => id*/);

const User = require("../models/user");

const io = require("socket.io");

const userConnect = async function (id) {
  if (!users.has(this)) users.set(this, id);

  this.broadcast.emit("active-sign", id);

  await User.findByIdAndUpdate(id, { active: true });
};

const userDisconnect = async function () {
  const id = users.get(this);

  this.broadcast.emit("disconnected", id);

  await User.findByIdAndUpdate(id, { active: false });

  users.delete(this);
};

module.exports = {
  userConnect,
  userDisconnect,
};
