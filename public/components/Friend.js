import chattingPage from "./Chat-page.js";

const chattingPart = document.getElementById("chatting-part");

const usersCon = document.getElementById("users");

const loading = document.querySelector("#chatting-part .loading");

const friendElements = new Map(/*ID => element*/);

const friend = (name, ID, roomID, status = false, n_of_msg = 0) => {
  const userDiv = document.createElement("div");
  const div = document.createElement("div");
  const statusDiv = document.createElement("div");
  const statusSign = document.createElement("span");
  const userImg = document.createElement("img");
  const username = document.createElement("h2");
  const nOfSentMsg = document.createElement("span");

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

  nOfSentMsg.classList.add("show-num-msg");
  if (!n_of_msg) {
    nOfSentMsg.classList.add("hidden");
  }
  nOfSentMsg.innerText = n_of_msg;

  div.appendChild(statusDiv);
  div.appendChild(username);

  userDiv.appendChild(div);
  userDiv.appendChild(nOfSentMsg);

  // Setting onclick event for all users

  userDiv.onclick = async function (event) {
    const username = this.children[0].children[1].innerText;
    // remove previous chat
    // apply chat page for each friend clicked

    if (chattingPart.children[1]) chattingPart.children[1].remove();

    loading.classList.remove("hidden");

    chattingPart.style.zIndex = "1";

    const chatPage = await chattingPage(username, ID, roomID, userDiv);

    if (chattingPart.children[1]) chattingPart.children[1].remove();

    chattingPart.appendChild(chatPage);

    chatPage.children[1].scrollTop = chatPage.children[1].scrollHeight;

    loading.classList.add("hidden");

    swithcer(userDiv);
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
