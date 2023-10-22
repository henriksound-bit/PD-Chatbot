
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

    const table = document.getElementById("pump-settings-table");

    // Add Column Button
    document.getElementById("add-column-btn").addEventListener("click", function() {
    let columns = table.getElementsByTagName("th").length; // Number of columns

    // Clone the header and append
    let originalHeader = table.querySelector("thead tr th:last-child");
    let clonedHeader = originalHeader.cloneNode(true);
    table.querySelector("thead tr").appendChild(clonedHeader);

    // Clone each cell in the column and append
    let rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) { // Starting from 1 to skip the header
        let originalCell = rows[i].querySelector("td:last-child");
        let clonedCell = originalCell.cloneNode(true);
        rows[i].appendChild(clonedCell);
    }
    });


    // Remove Column Button
    document.getElementById("remove-column-btn").addEventListener("click", function() {
        if (table.rows[0].cells.length > 2) {  // Ensure there's always at least the label column and one editable column
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(-1);  // Delete the last cell of each row
            }
        }
    });

});

document.getElementById('pump-settings-form').addEventListener('submit', function(e) {
    const tableRows = document.querySelectorAll('#pump-settings-table tbody tr');
    const data = {};

    tableRows.forEach(row => {
        const key = row.querySelector('td:first-child').textContent.trim();
        const value = row.querySelector('td:last-child').textContent.trim();
        data[key] = value;
    });

    // Add the data to a hidden input before submitting
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'data';
    hiddenInput.value = JSON.stringify(data);
    this.appendChild(hiddenInput);
});


