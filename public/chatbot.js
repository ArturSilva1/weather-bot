class WeatherBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.sessionId = this.generateSessionId();
        this.currentState = {};
        
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Focar no input
        this.chatInput.focus();
        
        // Iniciar conversa
        this.startConversation();
    }
    
    async startConversation() {
        try {
            const response = await this.sendToBot('', {});
            this.displayMessage(response.reply, 'bot');
            this.currentState = {
                ...response.data,
                currentState: response.nextState
            };
        } catch (error) {
            this.displayMessage('Desculpe, houve um erro ao iniciar o chatbot. Tente recarregar a página.', 'bot');
            console.error('Erro ao iniciar conversa:', error);
        }
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Exibir mensagem do usuário
        this.displayMessage(message, 'user');
        
        // Limpar input e desabilitar botão
        this.chatInput.value = '';
        this.sendButton.disabled = true;
        
        // Mostrar indicador de digitação
        this.showTypingIndicator();
        
        try {
            const response = await this.sendToBot(message, this.currentState);
            
            // Ocultar indicador de digitação
            this.hideTypingIndicator();
            
            // Exibir resposta do bot
            this.displayMessage(response.reply, 'bot', response.data);
            
            // Atualizar estado
            this.currentState = {
                ...response.data,
                currentState: response.nextState
            };
            
            // Se há dados do clima, exibir informações formatadas
            if (response.data && response.data.context && response.data.context.weather) {
                this.displayWeatherInfo(response.data.context.weather, response.data.context.city);
            }
            
            // Mostrar botões de resposta rápida quando apropriado
            if (this.shouldShowQuickReply(response.reply, response.nextState)) {
                this.displayQuickReplyButtons(['Sim', 'Não']);
            }
            
        } catch (error) {
            this.hideTypingIndicator();
            this.displayMessage('Desculpe, ocorreu um erro. Tente novamente.', 'bot');
            console.error('Erro ao enviar mensagem:', error);
        } finally {
            // Reabilitar botão e focar input
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }
    
    async sendToBot(input, state) {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: this.sessionId,
                input: input,
                state: state
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        return await response.json();
    }
    
    displayMessage(message, sender, data = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Adicionar animação
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.3s, transform 0.3s';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
    
    displayWeatherInfo(weather, city) {
        // Criar uma nova mensagem separada para o card de clima
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = '🤖';
        
        const content = document.createElement('div');
        content.className = 'message-content weather-message';
        
        // Capitalizar primeira letra da descrição
        const capitalizedDescription = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);
        
        // Determinar emoji baseado na temperatura
        let tempEmoji = '🌡️';
        if (weather.temp < 10) tempEmoji = '🥶';
        else if (weather.temp < 20) tempEmoji = '😊';
        else if (weather.temp < 30) tempEmoji = '🌞';
        else tempEmoji = '🔥';
        
        content.innerHTML = `
            <div class="weather-info">
                <div class="weather-header">
                    <h3>${tempEmoji} Clima em ${city}</h3>
                </div>
                <div class="weather-details">
                    <div class="weather-item">
                        <span class="weather-icon">🌡️</span>
                        <div class="weather-text">
                            <span class="weather-label">Temperatura Atual</span>
                            <span class="weather-value">${Math.round(weather.temp)}°C</span>
                        </div>
                    </div>
                    <div class="weather-item">
                        <span class="weather-icon">🤔</span>
                        <div class="weather-text">
                            <span class="weather-label">Sensão Térmica</span>
                            <span class="weather-value">${Math.round(weather.feels_like)}°C</span>
                        </div>
                    </div>
                    <div class="weather-item">
                        <span class="weather-icon">☁️</span>
                        <div class="weather-text">
                            <span class="weather-label">Condição</span>
                            <span class="weather-value">${capitalizedDescription}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        this.chatMessages.appendChild(messageDiv);
        
        // Adicionar animação
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.3s, transform 0.3s';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
        
        // Adicionar mensagem perguntando se quer consultar outra cidade
        setTimeout(() => {
            this.displayMessage('Deseja consultar outra cidade? (sim/não)', 'bot');
            this.displayQuickReplyButtons(['Sim', 'Não']);
        }, 500);
        
        this.scrollToBottom();
    }
    
    shouldShowQuickReply(reply, nextState) {
        // Mostrar botões para perguntas que esperam sim/não
        return (
            (reply.includes('certo?') && reply.includes('(sim/não)')) ||
            (reply.includes('Deseja consultar outra cidade?') && reply.includes('(sim/não)')) ||
            (reply.includes('tentar novamente?') && reply.includes('(sim/não)')) ||
            (reply.includes('responda sim ou não'))
        );
    }
    
    displayQuickReplyButtons(buttons) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'quick-reply-container';
        
        buttons.forEach(buttonText => {
            const button = document.createElement('button');
            button.className = 'quick-reply-button';
            button.textContent = buttonText;
            button.onclick = () => {
                this.chatInput.value = buttonText.toLowerCase();
                this.sendMessage();
                // Remover os botões após clicar
                buttonContainer.remove();
            };
            buttonContainer.appendChild(button);
        });
        
        this.chatMessages.appendChild(buttonContainer);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Inicializar o chatbot quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new WeatherBot();
});
