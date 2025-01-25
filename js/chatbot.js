// Variables globales
const chatbotContent = document.getElementById('chatbot-content');
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const context = []; //  Array para mantener el historial de conversación

// Seleccionamos los elementos del DOM
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');

// Manejamos el clic en el botón para mostrar/ocultar el contenedor del chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        const isChatbotVisible = chatbotContainer.style.display === 'block';
        chatbotContainer.style.display = isChatbotVisible ? 'none' : 'block';
    });
}

// Opcional: Configurar el iframe dinámicamente (si necesitas cargar una URL específica)
const chatbotIframe = chatbotContainer.querySelector('iframe');
if (chatbotIframe) {
    chatbotIframe.onload = () => {
        console.log('El chatbot se ha cargado correctamente en el iframe.');
    };
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

    addMessage('Escribiendo...', 'bot');

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
            throw new Error('Error al obtener respuesta del chatbot');
        }

        const data = await response.json();
        if (!data.response) {
            throw new Error('Respuesta inválida de la API del chatbot');
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
