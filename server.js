const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { runTransition } = require('./stateMachine')
const logger = require('./logger')
require('dotenv').config()


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Rota para o dashboard de monitoramento
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
})

app.post('/chat', async (req, res) => {
    const startTime = Date.now();
    const { sessionId, input, state } = req.body;
    
    try {
        logger.info('Nova requisição de chat', { sessionId, input, state: state?.currentState });
        
        const result = await runTransition({ sessionId, input, state });
        
        const duration = Date.now() - startTime;
        logger.request(sessionId, '/chat', duration);
        
        res.json(result);
    } catch (err) {
        const duration = Date.now() - startTime;
        logger.error('Erro no /chat', { 
            sessionId, 
            input, 
            state: state?.currentState,
            error: err.message,
            duration: `${duration}ms`
        });
        res.status(500).json({ error: 'Erro interno do chatbot' });
    }
})

// Rota de health check
app.get('/health', (req, res) => {
    const health = logger.healthCheck();
    res.json(health);
});

// Rota de métricas
app.get('/metrics', (req, res) => {
    const metrics = logger.getMetrics();
    res.json(metrics);
});

// Middleware para log de todas as requisições
app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info(`${req.method} ${req.path}`, {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent')
        });
    });
    
    next();
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  });
