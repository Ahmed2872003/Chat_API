import createMessage from "../components/Message.js";
import socket from "../js/socket.js";
import { friend, friendElements } from "./Friend.js";

const authorization = `Bearer ${localStorage.getItem("token")}`;

const accountOwnerID = JSON.parse(localStorage.getItem("user"))._id;

const chatPages = new Map();

const clickSound = new Audio(
  "../audio/mixkit-cool-interface-click-tone-2568.mp3"
);
const chatPage = async (friendName, friendID, roomID, friendElement) => {
  const chattingPage = document.getElementById("chatting-part");

  const chatPage = document.createElement("div");
  chatPage.setAttribute("id", "chat-page");
  // Header-part
  const header = document.createElement("header");

  const div = document.createElement("div");

  const backIcon = document.createElement("i");

  // <i class="fa-solid fa-left-long"></i>
  backIcon.classList.add("fa-solid", "fa-left-long", "hidden", "back-icon");

  backIcon.onclick = function () {
    chattingPage.style.zIndex = "-1";
    chattingPage.children[1].remove();
    // close that chat
    friendElement.removeAttribute("id");
  };

  const userImg = document.createElement("img");
  userImg.setAttribute("src", "../images/user.png");
  userImg.setAttribute("alt", "user-img");
  userImg.classList.add("profile-img");

  const h2 = document.createElement("h2");
  h2.innerText = friendName;

  const idCon = document.createElement("p");
  idCon.innerText = `userID: ${friendID}`;

  div.appendChild(backIcon);
  div.appendChild(userImg);
  div.appendChild(h2);

  header.appendChild(div);
  header.appendChild(idCon);

  chatPage.appendChild(header);

  // messages part

  const msgsCon = document.createElement("div");

  /*
  Here we will retrieve all the messages in database
  */

  try {
    const {
      data: {
        data: { messages },
        length,
      },
    } = await axios.get(axios.defaults.baseURL + `/room/${roomID}`, {
      headers: { authorization },
    });

    if (!length) {
      friendElement.children[1].classList.add("hidden");
      msgsCon.append(
        document.createTextNode(
          "No messages have been sent yet" + ", Say Hi to your friend :> "
        )
      );
    } else {
      const unreadMessages = { n: 0 };
      msgsCon.textContent = "";
      for (const {
        senderID,
        _id: msgID,
        content,
        read,
        createdAt,
      } of messages) {
        msgsCon.appendChild(
          createMessage(
            senderID,
            content,
            createdAt,
            msgID,
            read,
            unreadMessages
          )
        );
      }
      if (!unreadMessages.n) friendElement.children[1].classList.add("hidden");
      else
        friendElement.children[1].innerText =
          unreadMessages.n > 99 ? "99+" : unreadMessages.n;
    }
  } catch (err) {
    console.log(err);
  }

  /*
  Here we will retrieve all the messages in database
  */

  msgsCon.setAttribute("id", "msg-con");

  chatPage.appendChild(msgsCon);
  // msg input
  const form = document.createElement("form");
  form.setAttribute("id", "msg-inp-form");

  const msgInput = document.createElement("input");
  msgInput.setAttribute("id", "msg-inp");
  msgInput.type = "text";
  msgInput.name = "message";
  msgInput.required = true;
  msgInput.placeholder = "Type a message here";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";

  const sendIcon = document.createElement("i");
  //   <i class="fa-solid fa-paper-plane"></i>
  sendIcon.classList.add("fa-solid");
  sendIcon.classList.add("fa-paper-plane");

  submitBtn.appendChild(sendIcon);
  // for mobile interact
  submitBtn.addEventListener("click", function () {
    clickSound.play();
    this.style.backgroundColor = "#bcbbbb";
    setTimeout(() => (this.style.backgroundColor = "#e6e6e6"), 100);
  });
  submitBtn.addEventListener("mouseover", function () {
    this.style.backgroundColor = "#bcbbbb";
  });
  submitBtn.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "#e6e6e6";
  });

  form.appendChild(msgInput);
  form.appendChild(submitBtn);

  chatPage.appendChild(form);

  chatPages.set(roomID, chatPage);

  // Send message to be stored on database
  form.onsubmit = async function (e) {
    e.preventDefault();
    const currChat = this.parentElement.children[1];

    const {
      data: { message },
    } = await axios.post(
      axios.defaults.baseURL + "/message",
      { roomID, content: msgInput.value },
      { headers: { authorization } }
    );

    const msgDiv = createMessage(
      accountOwnerID,
      message.content,
      message.createdAt,
      message._id
    );

    if (!currChat.children.length) currChat.innerText = "";
    currChat.appendChild(msgDiv);
    currChat.scrollTop = currChat.scrollHeight;

    // Real time messaging
    socket.emit("startChat", message);

    // Check if the message is read or not
    socket.emit("read", roomID, accountOwnerID);

    // reciever currently active in same room ,so mark message as read
    socket.off("mark-read").on("mark-read", async (rID) => {
      if (roomID === rID) {
        await axios.patch(
          axios.defaults.baseURL + `/message/${message._id}`,
          { read: true },
          { headers: { authorization } }
        );
        const readIcon = msgDiv.children[1].children[1];
        markRead(readIcon);
      }
    });

    msgInput.value = "";
  };

  // Listening for comming message an show it
  socket.off("pushMsg").on("pushMsg", (msg) => {
    const room = chatPages.get(msg.roomID);

    if (!room) return;

    const currChat = room.children[1];

    const { content, senderID, createdAt, _id, roomID } = msg;

    if (!currChat.children.length) {
      currChat.textContent = "";
    }

    const msgDiv = createMessage(senderID, content, createdAt, _id);

    currChat.appendChild(msgDiv);

    currChat.scrollTop = currChat.scrollHeight;
  });

  chatPage.setAttribute("room_id", roomID);
  return chatPage;
};

// check if the reciever active in current room
socket.off("room-active").on("room-active", (roomID, friendID) => {
  if (!chatPages.has(roomID)) return;

  const msgsPage = document.getElementById("chat-page");

  if (msgsPage && msgsPage.getAttribute("room_id") === roomID)
    socket.emit("active", roomID);
  else {
    // Increase unread messages in reciever view (Realtime)
    const firendDiv = friendElements.get(friendID);
    const nOfSentMsgCon = firendDiv.children[1];
    nOfSentMsgCon.innerText =
      nOfSentMsgCon.innerText === "99+"
        ? nOfSentMsgCon.innerText
        : +nOfSentMsgCon.innerText + 1 > 98
        ? "99+"
        : +nOfSentMsgCon.innerText + 1;

    if (nOfSentMsgCon.classList.contains("hidden"))
      nOfSentMsgCon.classList.remove("hidden");

    document.getElementById("users").prepend(firendDiv);
  }
});
// mark all as read (Realtime)
socket.off("start-mark-latest").on("start-mark-latest", (roomID) => {
  const room = chatPages.get(roomID);
  if (!room) return;
  const msgsCon = room.children[1].children;

  for (let i = msgsCon.length - 1; i >= 0; i--) {
    const msgIcon = msgsCon[i].children[1].children[1];
    if (!msgIcon) return;
    if (msgIcon.classList.contains("fa-check-double")) return;
    markRead(msgIcon);
  }
});

// change icon to read state
const markRead = (readIcon) => {
  readIcon.classList.remove("fa-check");
  readIcon.classList.add("fa-check-double");
  readIcon.style.color = "#5cc1e9";
};

export default chatPage;
