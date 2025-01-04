const messagesDiv = document.getElementById('messages');
const input = document.getElementById('input');
const context = []; // Array to maintain conversation history

function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.textContent = text;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const userInput = input.value;
    if (!userInput.trim()) return;

    addMessage(userInput, 'user');
    context.push({ role: "user", content: userInput });
    input.value = '';

    // Get a response from the fine-tuned model
    const response = await fetchChatbotResponse(userInput);
    addMessage(response, 'bot');
    context.push({ role: "assistant", content: response });
}

async function fetchChatbotResponse(userInput) {
    const response = await fetch('https://tyche-chatbot.herokuapp.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        body: JSON.stringify({ model: "gpt-3.5-turbo", messages: context, max_tokens: 150 })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Optional: Restore context from localStorage
window.onload = () => {
    const savedContext = localStorage.getItem('chatContext');
    if (savedContext) {
        const parsedContext = JSON.parse(savedContext);
        context.push(...parsedContext);
        parsedContext.forEach(msg => addMessage(msg.content, msg.role));
    }
};

// Optional: Save context to localStorage before closing the window
window.onbeforeunload = () => {
    localStorage.setItem('chatContext', JSON.stringify(context));
};
