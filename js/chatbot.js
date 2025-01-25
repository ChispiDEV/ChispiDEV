// Variables globales
const chatbotPopup = document.getElementById('chatbot-popup');
const chatbotContent = document.getElementById('chatbot-content');
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const toggleChatbotButton = document.getElementById('toggle-chatbot');
const context = []; //  Array para mantener el historial de conversación

// Inicializa el contenido para que esté visible al principio
if (chatbotContent) chatbotContent.style.display = 'flex';

// Toggle chatbot visibility
if (toggleChatbotButton) {
    toggleChatbotButton.addEventListener('click', () => {
        if (chatbotPopup && chatbotPopup.classList.contains('minimized')) {
            chatbotPopup.classList.remove('minimized');
            if (chatbotContent) chatbotContent.style.display = 'flex';
            toggleChatbotButton.textContent = '-';
        } else {
            chatbotPopup.classList.add('minimized');
            if (chatbotContent) chatbotContent.style.display = 'none';
            toggleChatbotButton.textContent = '+';
        }
    });
}

// Agregar un mensaje al chat
function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.textContent = text;
    if (messagesDiv) {
        messagesDiv.appendChild(message);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Función para enviar mensaje
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    context.push({ role: "user", content: userMessage });
    if (chatInput) chatInput.value = '';

    addMessage('Typing...', 'bot');

    try {
        const response = await fetch('https://tyche-chatbot.herokuapp.com/chat', {
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
        if (!data.response) {
            throw new Error('Invalid response from the chatbot API');
        }
            
        const botResponse = data.response.trim();
        addMessage(botResponse, 'bot');
        context.push({ role: "assistant", content: botResponse });
    } catch (error) {
        console.error('Error:', error);
        addMessage('Lo siento, hubo un error procesando tu solicitud.', 'bot');
    }
}

// Opcional: Restaurar contexto del localStorage
window.onload = () => {
    const savedContext = localStorage.getItem('chatContext');
    if (savedContext) {
        const parsedContext = JSON.parse(savedContext);
        context.push(...parsedContext);
        parsedContext.forEach(msg => addMessage(msg.content, msg.role));
    }
};

// Opcional: Guardar contexto en localStorage antes de cerrar la ventana
window.onbeforeunload = () => {
    localStorage.setItem('chatContext', JSON.stringify(context));
};
