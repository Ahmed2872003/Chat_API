import createMessage from "../components/Message.js";
import socket from "../js/socket.js";

const authorization = `Bearer ${localStorage.getItem("token")}`;

const chatPages = new Map();

const clickSound = new Audio(
  "../audio/mixkit-cool-interface-click-tone-2568.mp3"
);
const chatPage = async (friendName, friendID, roomID, friendElement) => {
  // if it's currently exist
  if (chatPages.has(roomID)) {
    return chatPages.get(roomID);
  }

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
    } = await axios.get(axios.defaults.baseURL + `/message/private/${roomID}`, {
      headers: { authorization },
    });

    if (!length) {
      msgsCon.append(
        document.createTextNode(
          "No messages have been sent yet" + ", Say Hi to your friend :> "
        )
      );
    } else {
      msgsCon.textContent = "";
      for (const {
        senderID,
        _id: msgID,
        content,
        read,
        createdAt,
      } of messages) {
        msgsCon.appendChild(createMessage(senderID, content, createdAt, msgID));
      }
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

  form.onsubmit = async function (e) {
    e.preventDefault();
    const {
      data: {
        message: { _doc: message },
      },
    } = await axios.post(
      axios.defaults.baseURL + "/message",
      { roomID, content: msgInput.value },
      { headers: { authorization } }
    );
    // Real time messaging
    socket.emit("startChat", message);

    msgInput.value = "";
  };

  // Listening for comming message an show it
  socket.off("pushMsg").on("pushMsg", (msg) => {
    if (!chatPages.has(msg.roomID)) return;

    const { content, senderID, createdAt, _id } = msg;

    if (!msgsCon.children.length) {
      msgsCon.textContent = "";
    }

    msgsCon.appendChild(createMessage(senderID, content, createdAt, _id));
    msgsCon.scrollTop = msgsCon.scrollHeight;
  });

  chatPages.set(roomID, chatPage);

  chatPage.setAttribute("room_id", roomID);
  return chatPage;
};

export default chatPage;
