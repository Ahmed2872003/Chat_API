import { friend } from "../components/Friend.js";

import chattingPage from "../components/Chat-page.js";

import timeFormatter from "./timeFormatter.js";

import n from "./profile.js";

// import socket from "../js/socket.js";

const profileBtn = document.getElementById("main-profile-btn");

const profile = document.getElementById("profile");

const closeProfileBtn = document.querySelector(".close-profile");

const searchByNameInp = document.getElementById("search-by-name");

const usersCon = document.getElementById("users");

const filterRes = document.getElementById("users-filter");

const searchBtn = document.getElementById("search-btn");

const searchByNameForm = document.getElementById("s-by-name-form");

const cancelUserAddBtn = document.getElementById("cancelAdd");

const addUserBtn = document.getElementById("add-user-btn");

const idInput = document.getElementById("id-input");

const addUserForm = document.getElementById("add-user-form");

const alert = document.getElementById("alert");
// profile
const usernameCon = document.getElementById("username");

const userIDCon = document.getElementById("userID");

const userCreationTime = document.getElementById("time-creation");
// profile
const welcomePage = document.getElementById("welcome");

const bodyLoading = document.querySelector("body > .loading");
const loading = document.querySelector("#usersCon .loading");

const authorization = `Bearer ${localStorage.getItem("token")}`;

const userDetail = JSON.parse(localStorage.getItem("user"));

// get user details
usernameCon.innerText = userDetail.name;
userIDCon.innerText = userDetail.id;
const timeCreation = timeFormatter(userDetail.createdAt);
userCreationTime.innerText = `${timeCreation.date} ${timeCreation.time}`;

// Get user's rooms from DB
(async () => {
  try {
    bodyLoading.classList.remove("hidden");
    const { data } = await axios.get(axios.defaults.baseURL + "/room", {
      headers: { authorization },
    });

    for (const {
      friend: { name, _id: id, active },
      roomID,
    } of data.rooms) {
      usersCon.appendChild(await friend(name, id, roomID, active));
    }

    bodyLoading.classList.add("hidden");

    if (!data.rooms.length)
      usersCon.append(
        "You have no friends, try adding new friends from plus sign above."
      );
  } catch (err) {
    console.log(err);
  }
})();

// Showing user profile

profileBtn.onclick = () => {
  profile.setAttribute("class", "show-profile");
};
// Closing user profile
closeProfileBtn.onclick = () => {
  profile.removeAttribute("class");
};

// Searching by name
searchByNameForm.onsubmit = function (e) {
  e.preventDefault();
  if (!searchBtn.children[0].classList.contains("hidden")) {
    // make search icon be hidden
    searchBtn.children[0].classList.add("hidden");
    searchBtn.children[1].classList.remove("hidden");

    // Move users to search list
    for (let i = 0; i < usersCon.children.length; i++) {
      const user = usersCon.children[i];
      const username = user.children[0].children[1].innerText.toLowerCase();
      if (username.startsWith(searchByNameInp.value.toLowerCase())) {
        filterRes.appendChild(user);
        i--;
      }
    }
    if (!filterRes.children.length) filterRes.innerText = "No results found";
    filterRes.style.display = "block";
  } else {
    // Get all users back to main list
    if (filterRes.children.length) {
      const users = [...filterRes.children];
      for (const user of users) {
        usersCon.prepend(user);
      }
    }
    // make search results empty
    filterRes.innerText = "";
    filterRes.innerHTML = "";
    filterRes.style.display = "none";
    // make search icon appearing
    searchBtn.children[0].classList.remove("hidden");
    searchBtn.children[1].classList.add("hidden");
  }
};

// Show or hide user add
addUserBtn.onclick = function () {
  if (this.classList.contains("rotate")) {
    this.classList.remove("rotate");
    addUserForm.classList.add("hidden");
    return;
  }

  this.classList.add("rotate");
  addUserForm.classList.remove("hidden");
};

// searching By id

function removeAlert() {
  setTimeout(() => (alert.innerText = ""), 3500);
}

addUserForm.onsubmit = async function (e) {
  e.preventDefault();
  // Check first if this friend is already exist
  for (let i = 0; i < usersCon.children.length; i++) {
    const user = usersCon.children[i];
    if (user.getAttribute("userid") === idInput.value) {
      alert.innerText = "You have added that friend before";
      removeAlert();
      idInput.value = "";
      return;
    }
  }
  if (idInput.value == userDetail.id) {
    alert.innerText = "That id belongs to you";
    removeAlert();
    return;
  }
  // Add frind By id
  try {
    loading.classList.remove("hidden");

    const {
      data: { id, name, active },
    } = await axios.get(axios.defaults.baseURL + `/user/${idInput.value}`, {
      headers: {
        authorization,
      },
    });
    if (!usersCon.children.length) usersCon.textContent = "";

    const {
      data: { roomID },
    } = await axios.post(
      axios.defaults.baseURL + "/room",
      { friendID: id },
      {
        headers: { authorization },
      }
    );
    usersCon.appendChild(await friend(name, id, roomID, active));
    loading.classList.add("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    alert.innerText = err;
    removeAlert();
  }
};
