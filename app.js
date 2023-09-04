require("express-async-errors");

require("dotenv").config();

const express = require("express");

const app = express();

const server = require("http").createServer(app);

const port = process.env.PORT || 5000;

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.PUBLIC_URL,
  },
});

const connectDB = require("./db/connectDB");

const notFound = require("./middleware/notFound");

const errorHandler = require("./middleware/errorHandler");

const authorization = require("./middleware/authorization");

// Listeners
const { userConnect, userDisconnect } = require("./listeners/socketEvents");

// Security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

// Swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// Routers
const authRouter = require("./routes/auth");

const userRouter = require("./routes/user");

const roomsRouter = require("./routes/room");

const msgRouter = require("./routes/message");
const uploadRouter = require("./routes/upload");

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

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);

app.use("/api/v1", authorization);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/upload", uploadRouter);

app.use("/api/v1/room", roomsRouter);

app.use("/api/v1/message", msgRouter);

app.use(notFound);

app.use(errorHandler);

// io connection

io.on("connection", (socket) => {
  socket.on("user-active", userConnect);

  socket.on("disconnect", userDisconnect);

  socket.on("startChat", (msg) => socket.broadcast.emit("pushMsg", msg));

  socket.on("read", (roomID, userID) =>
    socket.broadcast.emit("room-active", roomID, userID)
  );

  socket.on("active", (roomID) => socket.broadcast.emit("mark-read", roomID));

  socket.on("mark-latest", (roomID) =>
    socket.broadcast.emit("start-mark-latest", roomID)
  );
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
