// CHATBOT SCRIPT 

let agentAvailable = false;
let agentCheckInterval;
let displayedMessages = new Set(); // Armazena os IDs das mensagens exibidas

function toggleChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.classList.toggle('visible');
}

function startChat() {
    const clientName = document.getElementById('clientName').value;
    const clientCpf = document.getElementById('clientCpf').value;

    if (!clientName || !clientCpf) {
        alert("Por favor, insira seu nome e CPF.");
        return;
    }

    document.getElementById('nameForm').style.display = 'none';
    document.getElementById('messageForm').style.display = 'block';

    const chatMessages = document.getElementById('chatMessages');
    const greeting = document.createElement('p');
    greeting.innerText = `Olá, ${clientName}! Como podemos ajudar você hoje?`;
    chatMessages.appendChild(greeting);

    window.clientName = clientName;
    window.clientCpf = clientCpf;

    // Começa a checar se o agente está disponível
    checkForAgent();
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;

    if (!messageText) {
        return;
    }

    const chatMessages = document.getElementById('chatMessages');
    //displayMessage(messageText, 'user');

    messageInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetch('assets/includes/plugin-send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nome: window.clientName, 
            cpf: window.clientCpf, 
            message: messageText 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && !agentAvailable) {
            displayMessage("Aguardando agente de suporte...", 'system');
        }
    })
    .catch(error => console.error('Erro ao enviar mensagem:', error));
}

function checkForAgent() {
    agentCheckInterval = setInterval(() => {
        fetch('assets/includes/check-agent.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: window.clientCpf })
        })
        .then(response => response.json())
        .then(data => {
            if (data.agent) {
                agentAvailable = true;
                displayMessage(`Agente ${data.agent} está disponível para atendimento.`, 'agent');
                clearInterval(agentCheckInterval); // Para de checar o agente
                checkForMessages(); // Começa a checar novas mensagens
            }
        })
        .catch(error => console.error('Erro ao verificar agente:', error));
    }, 5000);
}

function checkForMessages() {
    setInterval(() => {
        fetch('assets/includes/check-messages.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: window.clientCpf })
        })
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                data.messages.forEach(message => {
                    // Verifica se o ID da mensagem já foi exibido
                    if (!displayedMessages.has(message.id)) {
                        displayMessage(message.text, message.sender === 'agent' ? 'agent' : 'user');
                        displayedMessages.add(message.id); // Marca a mensagem como exibida
                    }
                });
            }
        })
        .catch(error => console.error('Erro ao buscar mensagens:', error));
    }, 5000); // Verifica novas mensagens a cada 5 segundos
}

// Função para exibir mensagens na tela com base no remetente
function displayMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.innerText = text;
    messageElement.classList.add('message');

    if (sender === 'user') {
        messageElement.classList.add('user-message');
    } else if (sender === 'agent') {
        messageElement.classList.add('agent-message');
    } else {
        messageElement.classList.add('system-message');
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

