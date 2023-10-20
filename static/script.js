
let displayText = '';  // The text that will be shown in the chat window
let charIndex = 0;  // To keep track of which character to display next

function displayNextChar(responseText, callback) {
    let displayText = '';
    let charIndex = 0;

    function appendNextChar() {
        if (charIndex < responseText.length) {
            displayText += responseText[charIndex];
            let botMessage = document.querySelector(".bot-message:last-child");
            botMessage.textContent = displayText;
            charIndex++;
            setTimeout(appendNextChar, 50);
        } else if (callback) {
            callback();
        }
    }

    appendNextChar();
}

// Send user message to server and get response
function sendUserMessage(event) {
    if (event) event.preventDefault();

    const userInput = document.querySelector(".chat-input input").value;
    console.log("User input:", userInput);
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "message user-message";
    userMessageDiv.textContent = userInput;
    document.querySelector(".chat-messages").appendChild(userMessageDiv);

    document.querySelector(".chat-input input").value = '';

    const botMessageDiv = document.createElement("div");
    botMessageDiv.className = "message bot-message";
    document.querySelector(".chat-messages").appendChild(botMessageDiv);

    fetch("/get", {
        method: "POST",
        body: new URLSearchParams({ "msg": userInput }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => {
        console.log("Server response:", response);
        return response.json();
    })
    .then(data => {
        console.log("Server data:", data);
        const botResponse = data.response;
        displayNextChar(botResponse);
    })
    .catch(error => {
        console.error("Error fetching response:", error);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector(".chat-input button").addEventListener("click", sendUserMessage);
    document.querySelector(".chat-input input").addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            sendUserMessage(e);
        }
    });
});


