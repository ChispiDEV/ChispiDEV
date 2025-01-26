// Variables globales
const context = []; //  Array para mantener el historial de conversación

// Seleccionamos los elementos del DOM
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotClose = document.getElementById('close-chatbot');
const messagesDiv = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');

// Manejamos el clic en el botón para mostrar/ocultar el contenedor del chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.style.display = 
        chatbotContainer.style.display === 'none' ? 'block' : 'none';
});

// Cerrar el chatbot al hacer clic en el botón "X"
chatbotClose.addEventListener('click', () => {
    chatbotContainer.style.display = 'none';
});

// Agregar un mensaje al chat
function addMessage(text, sender) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.margin = sender === 'user' ? '5px 0 5px auto' : '5px auto 5px 0';
    message.style.padding = '10px';
    message.style.backgroundColor = sender === 'user' ? '#007bff' : '#f1f1f1';
    message.style.color = sender === 'user' ? 'white' : 'black';
    message.style.borderRadius = '10px';
    message.style.maxWidth = '70%';
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Función para enviar mensaje
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user'); // Muestra el mensaje del usuario
    chatInput.value = '';
    addMessage('Escribiendo...', 'bot'); // Mensaje de "escribiendo"

    try {
        // Petición al backend del chatbot
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
        const botResponse = data.response || 'Lo siento, no entendí eso.';
        addMessage(botResponse, 'bot'); // Mensaje del chatbot
    } catch (error) {
        console.error('Error:', error);
        addMessage('Lo siento, hubo un error procesando tu solicitud.', 'bot');
    }
}

// Enlazar el botón de enviar con la función "sendMessage"
document.querySelector('button[onclick="sendMessage()"]').addEventListener('click', sendMessage);

// Enviar mensaje al presionar "Enter" en el input
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

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
