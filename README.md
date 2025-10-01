# 🌤️ Weather Bot - Chatbot do Clima

Um chatbot interativo desenvolvido em JavaScript que utiliza uma máquina de estados simples para consultar informações do clima através da API OpenWeatherMap.

## 🎯 Características

- **Interface moderna e responsiva** com design elegante
- **Máquina de estados** bem estruturada para controle do fluxo conversacional
- **Integração com API externa** (OpenWeatherMap) para dados reais do clima
- **Tratamento de erros** robusto e logging adequado
- **Experiência do usuário** fluida com indicadores visuais
- **Botões de resposta rápida** para interação facilitada

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Chave de API do OpenWeatherMap (gratuita)

### 1. Instalação

```bash
# Clone ou baixe o projeto
cd weather-bot

# Instale as dependências
npm install
```

### 2. Configuração

1. **Obtenha uma chave da API OpenWeatherMap:**
   - Acesse: https://openweathermap.org/api
   - Crie uma conta gratuita
   - Gere uma API key

2. **Configure as variáveis de ambiente:**
   ```bash
   # Copie o arquivo de exemplo
   cp env.example .env
   
   # Edite o arquivo .env e adicione sua chave
   OPENWEATHER_KEY=sua_chave_api_aqui
   ```

### 3. Execução

```bash
# Inicie o servidor
npm start
```

O servidor estará disponível em: **http://localhost:3000**

## 🎮 Como Usar

1. Abra o navegador e acesse `http://localhost:3000`
2. O chatbot iniciará automaticamente com uma saudação
3. Digite o nome da cidade que deseja consultar
4. Confirme a cidade quando solicitado (pode usar botões ou digitar)
5. Veja as informações do clima em um card elegante
6. Decida se quer consultar outra cidade usando os botões

## 🏗️ Arquitetura do Projeto

```
weather-bot/
├── server.js              # Servidor Express
├── stateMachine.js        # Lógica da máquina de estados
├── logger.js              # Sistema de logging
├── weather-bot/
│   ├── public/
│   │   ├── index.html     # Interface do usuário
│   │   └── chatbot.js     # Lógica do frontend
│   └── services/
│       └── apiClient.js   # Cliente da API OpenWeatherMap
├── package.json           # Dependências e scripts
└── env.example           # Exemplo de configuração
```

## 🔄 Fluxo de Estados

O chatbot segue uma máquina de estados simples:

1. **GREETING** → Saudação inicial
2. **ASK_CITY** → Solicita nome da cidade
3. **CONFIRM_CITY** → Confirma a cidade escolhida (com auto-busca)
4. **SHOW_RESULTS** → Exibe resultados e pergunta se quer continuar
5. **END** → Finaliza ou reinicia conversa

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **API:** OpenWeatherMap
- **Logging:** Morgan (HTTP) + Logger customizado
- **Gerenciamento:** npm

## 📋 Dependências

- `express` - Framework web
- `morgan` - Logger HTTP
- `node-fetch` - Cliente HTTP para API
- `dotenv` - Gerenciamento de variáveis de ambiente

## 🎨 Interface

A interface foi desenvolvida com foco na experiência do usuário:

- **Design responsivo** que funciona em desktop e mobile
- **Animações suaves** para transições de mensagens
- **Indicadores visuais** de digitação
- **Layout moderno** com gradientes e sombras
- **Cards informativos** para dados do clima com design especial
- **Botões de resposta rápida** para facilitar interação

## 🔧 Desenvolvimento

Para contribuir ou modificar o projeto:

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# O servidor reinicia automaticamente com mudanças
```

## 📝 Logs

O sistema possui logging completo:
- Requisições HTTP (via Morgan)
- Transições de estado do chatbot
- Erros de API e tratamento de exceções

## 🚨 Tratamento de Erros

O projeto inclui tratamento robusto de erros:
- Validação de entrada do usuário
- Tratamento de erros da API externa
- Fallbacks para situações de erro
- Mensagens amigáveis ao usuário

## 📄 Licença

Este projeto foi desenvolvido como exemplo de chatbot com máquina de estados simples.

---

**Desenvolvido com ❤️ usando JavaScript puro e boas práticas de desenvolvimento.**
