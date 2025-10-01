const express = require('express')
const path = require('path')
const morgan = require('morgan')
const { runTransition } = require('./stateMachine')
const logger = require('./logger')
require('dotenv').config()


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'weather-bot/public')))

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'weather-bot/public', 'index.html'))
})

app.post('/chat', async (req, res) => {
try {
const { sessionId, input, state } = req.body
const result = await runTransition({ sessionId, input, state })
res.json(result)
} catch (err) {
logger.error('Erro no /chat', err)
res.status(500).json({ error: 'Erro interno do chatbot' })
}
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  });
