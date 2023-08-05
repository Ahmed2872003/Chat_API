import timeFormatter from "./timeFormatter.js";

const authorization = `Bearer ${localStorage.getItem("token")}`;

const editNameBtn = document.getElementById("edit-name");

const editForm = document.getElementById("edit-name-form");

const submitEditBtn = document.getElementById("submitEdit");

const canceltEditBtn = document.getElementById("cancelEdit");

const editNameInput = document.getElementById("edit-name-input");

const usernameCon = document.getElementById("username");

const userIDCon = document.getElementById("userID");

const userCreationTime = document.getElementById("time-creation");

const logoutBtn = document.getElementById("logout-btn");

editNameBtn.onclick = () => {
  canceltEditBtn.parentElement.classList.remove("hidden");
  canceltEditBtn.parentElement.classList.add("show");
};
canceltEditBtn.onclick = () => {
  canceltEditBtn.parentElement.classList.remove("show");
  canceltEditBtn.parentElement.classList.add("hidden");
};

logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.open("../index.html", "_self");
};

editForm.onsubmit = async function (e) {
  e.preventDefault();
  try {
    await axios.patch(
      axios.defaults.baseURL + "/user",
      { name: editNameInput.value },
      { headers: { authorization } }
    );
    const user = JSON.parse(localStorage.getItem("user"));

    user.name = editNameInput.value;

    usernameCon.innerText = editNameInput.value;

    localStorage.setItem("user", JSON.stringify(user));
    editNameInput.value = "";
  } catch (err) {
    console.log(err);
  }
};

export default null;
