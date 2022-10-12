const $app = document.getElementById("app");

const keyHash = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const clientSocket = io("http://127.0.0.1:3000");

clientSocket.on("join");

clientSocket.on("status", (data) => {
  const usersState = JSON.parse(data);
  $app.innerText = data;
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  clientSocket.emit(keyHash[key]);
});
