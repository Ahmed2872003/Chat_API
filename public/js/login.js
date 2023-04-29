const alert = document.getElementById("alert");

const alertMsg = document.getElementById("alertMessage");

const switchBtn = document.getElementById("switchBtn");

const authForm = document.getElementById("authForm");

const explainMethod = document.getElementById("explain");

const submitBtn = document.querySelector("button[type=submit]");

const passInput = document.querySelector("input[name=password]");

const typeSwitchBtn = document.getElementById("typeSwitcher");

// converte to register

switchBtn.onclick = () => {
  if (submitBtn.innerText === "Register") {
    authForm.removeChild(authForm.children[0]);
    authForm.removeChild(authForm.children[0]);
    switchBtn.innerText = "Register";
    explainMethod.innerText = "New member?";
    submitBtn.innerText = "Login";
    return;
  }
  //   creating name input
  const registerInp = document.createElement("input");
  const label = document.createElement("label");
  registerInp.type = "text";
  registerInp.name = "name";
  registerInp.id = "nameInp";
  authForm.prepend(registerInp);
  label.setAttribute("for", "nameInp");
  label.append(document.createTextNode("name"));
  authForm.prepend(label);
  //   switch statements
  switchBtn.innerText = "Login";
  explainMethod.innerText = "Member?";
  submitBtn.innerText = "Register";
};

// show OR hide pass
typeSwitchBtn.onclick = () => {
  if (passInput.type === "password") {
    passInput.type = "text";
  } else {
    passInput.type = "password";
  }
};

// auto login when user logged in before
window.addEventListener("load", async () => {
  const token = localStorage.getItem("token");

  if (token && localStorage.getItem("user")) {
    try {
      await axios.post(
        axios.defaults.baseURL + "/auth",
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      window.open("../pages/home.html", "_self");
    } catch (err) {
      console.log(err);
    }
  }
});

// post information

authForm.onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(authForm);
  const information = {};
  //  Getting data from form
  for (const [prop, val] of formData.entries()) {
    information[prop] = val;
  }
  try {
    const {
      data: { token, user },
    } = await axios.post(
      axios.defaults.baseURL +
        `/auth/${submitBtn.innerText === "Register" ? "signup" : "login"}`,
      information
    );
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    window.open("../pages/home.html", "_self");
  } catch (err) {
    showAlertMsg(err.response.data.msg);
  }
};

const showAlertMsg = (msg) => {
  alertMsg.innerText = msg;
  alert.style.display = "block";
  setTimeout(() => (alert.style.display = "none"), 2000);
};
