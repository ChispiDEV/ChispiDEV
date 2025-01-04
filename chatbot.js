const messagesDiv = document.getElementById('messages');
const input = document.getElementById('input');
const context = []; //  Array para mantener el historial de conversación

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

    addMessage('Typing...', 'bot');

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Cambia el modelo si es necesario
                messages: context,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response');
        }

        const data = await response.json();
        const botResponse = data.choices[0].message.content.trim();
        addMessage(botResponse, 'bot');
        context.push({ role: "assistant", content: botResponse });
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, there was an error processing your request.', 'bot');
    }
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
