var startPage = document.getElementById('start-page');
var chatPage = document.getElementById('chat-room');
var startForm = document.getElementById('primary-form');
var chatForm = document.getElementById('message-form');
var messageInput = document.getElementById('message');
var messageSpace = document.getElementById('message-space');
var connection = document.getElementById('connecting');

var startButton = document.getElementById('startButton')
var stompClient = null;
var username = null

document.getElementById('startButton').addEventListener('click', (event) => {



    username = document.getElementById('username').value.trim()


    if (username) {
        // startPage.classList.remove('primary')
        // startPage.classList.add('secondary')
        // chatPage.classList.remove('secondary')
        startPage.style.display = 'none'
        chatPage.style.display = 'flex'
        var socket = new SockJS('/ws');
        console.log(socket);
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnect, onError);
        console.log("stompClient");
    }
    event.preventDefault()
})



function onConnect() {
    console.log("on connect");
    stompClient.subscribe('/topic/public', receivedMessage);

    stompClient.send(
        "/app/chat/add",
        {},
        JSON.stringify({
            sender: username,
            type: "JOIN"
        })
    );
    connection.style.display = 'none'
}


function onError() {
    connection.textContent = 'Could not connect to a WebSocket server';
    connection.style.color = 'red';
}

function sendMessage(event) {

    var message = messageInput.value.trim();
    if (message && stompClient) {
        var chatMessage = {
            content: messageInput.value,
            sender: username,
            type: 'CHAT'
        };

        stompClient.send("/app/chat/send", {}, JSON.stringify(chatMessage))
        messageInput.value = '' 
    }
    event.preventDefault()
}

function receivedMessage(payload) {

    var message = JSON.parse(payload.body);
    
    var messageElement = document.createElement('li');


    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    }
    else {

        if (message.sender === username) {

            messageElement.classList.add('my-message')
            
            var avatarElement = document.createElement('i');
            var avatarText = document.createTextNode(message.sender[0])
            avatarElement.appendChild(avatarText)
            avatarElement.style.backgroundColor = 'red'
            messageElement.appendChild(avatarElement);
            

            var usernameElement = document.createElement('span');
            var usernameText = document.createTextNode(message.sender);
            usernameElement.appendChild(usernameText);
            messageElement.appendChild(usernameElement);
            
        } else {

            messageElement.classList.add('other-message')

            var avatarElement = document.createElement('i');
            var avatarText = document.createTextNode(message.sender[0])
            avatarElement.appendChild(avatarText)
            avatarElement.style.backgroundColor = 'red'
            messageElement.appendChild(avatarElement);
            

            var usernameElement = document.createElement('span');
            var usernameText = document.createTextNode(message.sender);
            usernameElement.appendChild(usernameText);
            messageElement.appendChild(usernameElement);
        }
        
    }

    var textElement = document.createElement('p');
    
    var messageText = document.createTextNode(message.content);
    
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageSpace.appendChild(messageElement);
    messageSpace.scrollTop = messageSpace.scrollHeight;
}


chatForm.addEventListener('submit', sendMessage);

