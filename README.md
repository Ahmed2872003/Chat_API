# Chat app

<h3><a href="https://lets-chat-lxxe.onrender.com/api-docs">API Documentation</a></h3>
<h3><a href="https://lets-chat-lxxe.onrender.com">Live Site</a></h3>
<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/106814780/265246364-f61f021f-b04c-4029-9607-4e2e083f47a0.jpg" alt="Application view" />
<img src="https://github.com/Ahmed2872003/Chat_API/assets/106814780/ae7919d8-0c7d-4be2-aa22-82ed4317366b" alt="Application view" />

## Technologies
<span><img src="https://user-images.githubusercontent.com/25181517/192158954-f88b5814-d510-4564-b285-dff7d6400dad.png" alt="HTML" width="50" height="50"/></span>
<span><img src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" alt="CSS" width="50" height="50"/></span>
<span><img src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" width="50" height="50"/></span>
<span><img src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" width="50" height="50"/></span>
<span><img src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" width="50" height="50"/></span>
<span><img src="https://user-images.githubusercontent.com/25181517/182884177-d48a8579-2cd0-447a-b9a6-ffc7cb02560e.png" alt="MongoDB" width="50" height="50"/></span>
<span><img src="https://cdn.icon-icons.com/icons2/2389/PNG/512/socket_io_logo_icon_144874.png" alt="Socket io" width="50" height="50"/></span>
<span><img src="https://user-images.githubusercontent.com/25181517/186711335-a3729606-5a78-4496-9a36-06efcc74f800.png" alt="Swagger" width="50" height="50"/></span>

## Description
  <p>A real-time chat app allows two users to communicate with each other.</p>

## Features
* **User authentication**
* **Private messaging**
* **Real-time messaging**
* **User active**
* **Add friend by his id**

## Setup
1. **Clone the repository:** <br />
    ```
    git clone https://github.com/Ahmed2872003/Chat_API.git
    ```
2. **Navigate to the project directory:** <br />
    ```
    cd Chat_API
    ```
3. **Install the dependencies:** <br />
    ```
    npm install
    ```
4. **Create a .env file in the root directory of the project.**
5. **Add the following environment variables to the .env file:** <br />
    ```
    PUBLIC_URL=http://localhost:5000
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    MESSAGE_KEY=<your-message-key>
    MESSAGE_IV=<your-message-iv>
    ```
    <p><strong>Note: </strong>JWT_SECRET, MESSAGE_KEY, and MESSAGE_IV are diffrent random keys for secure purposes. you can generate from <a href="https://acte.ltd/utils/randomkeygen">here</a> copy Encryption key 256 for all except MESSAGE_IV Basic 16.</p>
6. **Go to public>js>axios.js** <br />
    **replace** <br />
     `axios.defaults.publicUrl = "https://lets-chat-lxxe.onrender.com";`<br />
    **to** <br />
      ```
      axios.defaults.publicUrl = "http://localhost:5000";
      ```
7. **Start the application:** <br />
     ```
     npm start
     ```
   <p>This will start the application and it will be accessible at http://localhost:5000.</p>
