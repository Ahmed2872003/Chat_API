import { friendElements } from "../components/Friend.js";

const socket = io(axios.defaults.publicUrl);

const id = JSON.parse(localStorage.getItem("user"))._id;

socket.off("connect").on("connect", () => socket.emit("user-active", id));

socket.off("active-sign").on("active-sign", connectUser);

socket.off("disconnected").on("disconnected", disconnectUser);

function connectUser(id) {
  const friendElement = friendElements.get(id);

  if (!friendElement) return;

  const sign = friendElement.children[0].children[0].children[1];

  if (sign.classList.contains("not-active"))
    sign.classList.remove("not-active");
  sign.classList.add("active");
}

function disconnectUser(id) {
  const friendElement = friendElements.get(id);

  if (!friendElement) return;

  const sign = friendElement.children[0].children[0].children[1];
  if (sign.classList.contains("active")) sign.classList.remove("active");
  sign.classList.add("not-active");
}

export default socket;
