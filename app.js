require("express-async-errors");

require("dotenv").config();

const express = require("express");

const app = express();

const server = require("http").createServer(app);

const port = process.env.PORT || 5000;

const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:5000" },
});

const connectDB = require("./db/connectDB");

const notFound = require("./middleware/notFound");

const errorHandler = require("./middleware/errorHandler");

const authorization = require("./middleware/authorization");

const { userConnect, userDisconnect } = require("./listeners/socketEvents");

// Security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

// Routers
const authRouter = require("./routes/auth");

const userRouter = require("./routes/user");

const roomsRouter = require("./routes/room");

const msgRouter = require("./routes/message");

// Middlewares

app.use(express.static("./public"));
app.use("/pages", express.static("./public/pages"));
app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use(xss());

app.use("/api/v1/auth", authRouter);

app.use(authorization);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/room", roomsRouter);

app.use("/api/v1/message", msgRouter);

app.use(notFound);

app.use(errorHandler);

// io connection

io.on("connection", (socket) => {
  socket.on("user-active", userConnect);

  socket.on("disconnect", userDisconnect);

  socket.on("startChat", (msg) => io.sockets.emit("pushMsg", msg));
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected to database");
    server.listen(port, () => console.log(`API is listening on port: ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
