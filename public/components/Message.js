import timeFormatter from "../js/timeFormatter.js";

const accountOwnerID = JSON.parse(localStorage.getItem("user")).id;

const message = (senderID, msg, time, id, read, unreadMessages = {}) => {
  const msgCon = document.createElement("div");
  const message = document.createElement("p");
  const timeCon = document.createElement("p");
  const readState = document.createElement("i");
  const msgState = document.createElement("p");

  if (senderID === accountOwnerID) msgCon.setAttribute("class", "special msg");
  else msgCon.setAttribute("class", "reg msg");

  msgCon.setAttribute("id", id);

  message.innerText = msg;

  msgCon.appendChild(message);

  timeCon.innerText = timeFormatter(time).time;

  msgState.appendChild(timeCon);

  // Check if the message is read or not (stored on database)
  if (senderID === accountOwnerID) {
    if (read) {
      readState.classList.add("fa-solid", "fa-check-double");
      readState.style.color = "#5cc1e9";
    } else {
      readState.classList.add("fa-solid", "fa-check");
      readState.style.color = "#8696a0";
    }

    msgState.appendChild(readState);
  }

  msgState.classList.add("msgState");

  msgCon.appendChild(msgState);

  if (!read && unreadMessages.n != undefined && senderID !== accountOwnerID)
    unreadMessages.n++;

  return msgCon;
};

export default message;
