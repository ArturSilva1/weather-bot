// Máquina de estados simples
const logger = require('./logger');
const { fetchWeatherByCity } = require('./services/apiClient');

async function runTransition({ sessionId, input = '', state = {} }) {
    const current = state.currentState || 'GREETING'
    const context = state.context || {}
    
    
    logger.info(`Processando transição de estado`, { 
        sessionId, 
        currentState: current, 
        input, 
        context: Object.keys(context).length > 0 ? context : undefined 
    })
    
    
    switch (current) {
    case 'GREETING':
    return {
    nextState: 'ASK_CITY',
    reply: 'Olá! Eu sou o Bot do Clima. Qual cidade você gostaria de consultar?',
    data: { context }
    }
    
    
    case 'ASK_CITY': {
    const city = (input || '').trim()
    if (!city) {
    return { nextState: 'ASK_CITY', reply: 'Desculpe, não entendi. Pode me dizer o nome de uma cidade?' }
    }
    context.city = city
    return { nextState: 'CONFIRM_CITY', reply: `Você quer saber o clima de ${city}, certo? (sim/não)`, data: { context } }
    }
    
    
    case 'CONFIRM_CITY': {
    const normalized = (input || '').toLowerCase()
    if (normalized.startsWith('s')) {
    // Auto-transição para FETCHING
    if (!context.city) return { nextState: 'ASK_CITY', reply: 'Preciso do nome de uma cidade primeiro. Qual é?' }
    const startTime = Date.now();
    try {
        const weather = await fetchWeatherByCity(context.city);
        const duration = Date.now() - startTime;
        
        context.weather = weather;
        logger.weatherQuery(context.city, true, duration);
        
        const reply = `✅ Clima encontrado para ${context.city}!`;
        return { nextState: 'SHOW_RESULTS', reply, data: { context } };
    } catch (err) {
        const duration = Date.now() - startTime;
        logger.weatherQuery(context.city, false, duration);
        logger.error('Erro ao buscar clima', { 
            sessionId, 
            city: context.city, 
            error: err.message,
            duration: `${duration}ms`
        });
        return { nextState: 'SHOW_RESULTS', reply: '❌ Houve um erro ao consultar o clima. Deseja tentar novamente? (sim/não)' };
    }
    }
    if (normalized.startsWith('n')) {
    context.city = undefined
    return { nextState: 'ASK_CITY', reply: 'Tudo bem — qual cidade você quer consultar então?', data: { context } }
    }
    return { nextState: 'CONFIRM_CITY', reply: 'Por favor responda sim ou não.' }
    }
    
    
    case 'FETCHING': {
    if (!context.city) return { nextState: 'ASK_CITY', reply: 'Preciso do nome de uma cidade primeiro. Qual é?' }
    const startTime = Date.now();
    try {
        const weather = await fetchWeatherByCity(context.city);
        const duration = Date.now() - startTime;
        
        context.weather = weather;
        logger.weatherQuery(context.city, true, duration);
        
        const reply = `Em ${context.city}, a temperatura atual é ${weather.temp}°C, com sensação de ${weather.feels_like}°C. Condição: ${weather.description}. Deseja consultar outra cidade? (sim/não)`;
        return { nextState: 'SHOW_RESULTS', reply, data: { context } };
    } catch (err) {
        const duration = Date.now() - startTime;
        logger.weatherQuery(context.city, false, duration);
        logger.error('Erro ao buscar clima', { 
            sessionId, 
            city: context.city, 
            error: err.message,
            duration: `${duration}ms`
        });
        return { nextState: 'SHOW_RESULTS', reply: 'Houve um erro ao consultar o clima. Deseja tentar novamente? (sim/não)' };
    }
    }
    
    
    case 'SHOW_RESULTS': {
    const normalized = (input || '').toLowerCase()
    if (normalized.startsWith('s')) {
    return { nextState: 'ASK_CITY', reply: 'Perfeito — me diga outra cidade então.', data: { context: {} } }
    }
    if (normalized.startsWith('n')) {
    return { nextState: 'END', reply: 'Obrigado! Até a próxima!', data: { context: {} } }
    }
    return { nextState: 'SHOW_RESULTS', reply: 'Responda sim ou não para continuar.', data: { context } }
    }
    
    
    case 'END':
    return { nextState: 'GREETING', reply: 'Reiniciando conversa. Olá de novo! Quer começar? (sim/não)' }
    
    
    default:
    return { nextState: 'GREETING', reply: 'Olá! Vamos começar? Diga "oi".' }
    }
    }
    
    
    module.exports = { runTransition }
