const Moment = new moment();
const socket = io();
const form = document.querySelector("form");
const inp = document.querySelector(".inp");
const message_box = document.querySelector(".messages");
const room_name=document.querySelector("#room-name")
const userList=document.querySelector(".names")

//get username and room name from query(URL)
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


socket.emit("joinRoom", {username, room});

//get room and roomUsers
socket.on("room-info",(roomUsers)=>{
  // outputRoom(room);
  outputRoomUsers(roomUsers);
})

//taking input value
inp.focus();
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = inp.value;

  if (input) {
    inp.value = "";
    inp.focus();

    const msg =input;
    socket.emit("message", msg);

    //function to add the message into the message-box
    //time from moment
    const time = Moment.format("h:mm:a");
    output({ name: "You", time: time, msg: input });
  }
});

socket.on("message", (data) => {
  // console.log(data);

  //function to add the message into the message-box
  output(data);
});

//function to add the message into the message-box
function output(data) {
  const messsage = `
            <div class="person-name">${data.name} <span>${data.time}</span></div>
            <div class="person-message">${data.msg}</div>
            `;
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = messsage;

  message_box.appendChild(div);

  //scroll down
  message_box.scrollTop = message_box.scrollHeight;
}

var time;

function typingDisplay(username) {
  document.querySelector(".typing").innerHTML = `${username} typing...`;
  document.querySelector(".typing").style.display = "block";

  clearTimeout(time);

  time = setTimeout(() => {
    document.querySelector(".typing").style.display = "none";
  }, 2000);
}

inp.addEventListener("keyup", (event) => {
  if (event.keyCode != 13) {
    socket.emit("typing", username);
  }
});

socket.on("typing", (username) => {
  typingDisplay(username);
});


//room and roomUsers adding and deleting list

//assignning room name
// function outputRoom(room){
  room_name.textContent=room
// }

function outputRoomUsers(users){
  userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
  `
}