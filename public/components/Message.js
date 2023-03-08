import timeFormatter from "../js/timeFormatter.js";

const accountOwnerID = JSON.parse(localStorage.getItem("user")).id;

const message = (senderID, msg, time, id) => {
  const msgCon = document.createElement("div");
  const message = document.createElement("p");
  const timeCon = document.createElement("p");

  if (senderID === accountOwnerID) msgCon.setAttribute("class", "special msg");
  else msgCon.setAttribute("class", "reg msg");

  msgCon.setAttribute("id", id);

  message.innerText = msg;

  msgCon.appendChild(message);

  timeCon.innerText = timeFormatter(time).time;

  msgCon.appendChild(timeCon);

  return msgCon;
};

export default message;
