import socket from "../js/socket.js";
import chattingPage from "./Chat-page.js";

const chattingPart = document.getElementById("chatting-part");

const usersCon = document.getElementById("users");

const friendElements = new Map(/*ID => element*/);

const authorization = `Bearer ${localStorage.getItem("token")}`;

const friend = async (name, ID, roomID, status = false) => {
  const userDiv = document.createElement("div");
  const div = document.createElement("div");
  const statusDiv = document.createElement("div");
  const statusSign = document.createElement("span");
  const userImg = document.createElement("img");
  const username = document.createElement("h2");
  const nOfSentMsgCon = document.createElement("span");

  // <i class="fa-solid fa-circle-exclamation"></i>
  userDiv.classList.add("user");

  userDiv.setAttribute("userID", ID);

  userImg.src = "../images/user.png";
  userImg.alt = "user-image";
  userImg.classList.add("profile-img");

  // check if the user active or not
  statusSign.classList.add("status");

  userStatus(statusSign, status);

  statusDiv.appendChild(userImg);
  statusDiv.appendChild(statusSign);

  username.classList.add("name");
  username.append(name);

  nOfSentMsgCon.classList.add("show-num-msg");
  nOfSentMsgCon.innerText = 0;

  div.appendChild(statusDiv);
  div.appendChild(username);

  userDiv.appendChild(div);
  userDiv.appendChild(nOfSentMsgCon);

  // getting chat realtive to that friend
  const chatPage = await chattingPage(name, ID, roomID, userDiv);
  // Showing chat realtive to that friend

  userDiv.onclick = async function (event) {
    // apply chat page for each friend clicked

    chattingPart.style.zIndex = "1";

    // remove previous chat
    if (chattingPart.children[1]) chattingPart.children[1].remove();

    chattingPart.appendChild(chatPage);

    chatPage.children[1].scrollTop = chatPage.children[1].scrollHeight;

    // change messages to read state (in database)
    axios.patch(
      axios.defaults.baseURL + `/room/${roomID}`,
      { read: true },
      {
        headers: {
          authorization,
        },
      }
    );
    // change messages to read state (Realtime)
    socket.emit("mark-latest", roomID);

    swithcer(userDiv);

    nOfSentMsgCon.classList.add("hidden");
    nOfSentMsgCon.innerText = 0;
  };

  friendElements.set(ID, userDiv);

  return userDiv;
};

const userStatus = (statusSign, status) => {
  if (status) {
    statusSign.classList.remove("not-active");
    statusSign.classList.add("active");
  } else {
    statusSign.classList.remove("active");
    statusSign.classList.add("not-active");
  }
};

const swithcer = (targetUser) => {
  // Checking if there's old user with seleceted id
  for (let i = 0; i < usersCon.children.length; i++) {
    const user = usersCon.children[i];
    if (user.getAttribute("id") === "selected") {
      user.removeAttribute("id");
      break;
    }
  }
  targetUser.setAttribute("id", "selected");
};

export { friend, friendElements };
