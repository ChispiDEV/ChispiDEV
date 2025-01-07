// Variables globales
const chatbotPopup = document.getElementById('chatbot-popup');
const chatbotContent = document.getElementById('chatbot-content');
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const toggleChatbotButton = document.getElementById('toggle-chatbot');
const context = []; //  Array para mantener el historial de conversación

// Inicializa el contenido para que esté visible al principio
chatbotContent.style.display = 'flex';

// Toggle chatbot visibility
toggleChatbotButton.addEventListener('click', () => {
    if (chatbotPopup.classList.contains('minimized')) {
        chatbotPopup.classList.remove('minimized');
        chatbotContent.style.display = 'flex';
        toggleChatbotButton.textContent = '-';
    } else {
        chatbotPopup.classList.add('minimized');
        chatbotContent.style.display = 'none';
        toggleChatbotButton.textContent = '+';
    }
});

function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.textContent = text;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Función para enviar mensaje
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    context.push({ role: "user", content: userMessage });
    chatInput.value = '';

    addMessage('Typing...', 'bot');

    try {
        const response = await fetch('https://tyche-chatbot-da1d0dc13fc5.herokuapp.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage,
                language: "es"
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch response');
        }

        const data = await response.json();
        if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
            throw new Error('Invalid response from the chatbot API');
        }

        const botResponse = data.choices[0].message.content.trim();
        addMessage(botResponse, 'bot');
        context.push({ role: "assistant", content: botResponse });
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, there was an error processing your request.', 'bot');
    }
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
