// logger.js - Sistema de logging aprimorado com observabilidade
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, 'logs');
        this.ensureLogDir();
        this.metrics = {
            requests: 0,
            errors: 0,
            weatherQueries: 0,
            startTime: Date.now()
        };
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const sessionId = meta.sessionId || 'unknown';
        const state = meta.state || 'unknown';
        
        return {
            timestamp,
            level,
            message,
            sessionId,
            state,
            ...meta
        };
    }

    writeToFile(level, formattedMessage) {
        const logFile = path.join(this.logDir, `${level}.log`);
        const logEntry = JSON.stringify(formattedMessage) + '\n';
        
        fs.appendFile(logFile, logEntry, (err) => {
            if (err) console.error('Erro ao escrever log:', err);
        });
    }

    info(message, meta = {}) {
        const formatted = this.formatMessage('INFO', message, meta);
        
        // Console com cores
        console.log(`\x1b[36m[INFO]\x1b[0m ${formatted.timestamp} | ${formatted.message}`);
        if (meta.sessionId) console.log(`  └─ Session: ${formatted.sessionId} | State: ${formatted.state}`);
        
        // Arquivo
        this.writeToFile('info', formatted);
    }

    error(message, meta = {}) {
        const formatted = this.formatMessage('ERROR', message, meta);
        this.metrics.errors++;
        
        // Console com cores
        console.error(`\x1b[31m[ERROR]\x1b[0m ${formatted.timestamp} | ${formatted.message}`);
        if (meta.sessionId) console.error(`  └─ Session: ${formatted.sessionId} | State: ${formatted.state}`);
        
        // Arquivo
        this.writeToFile('error', formatted);
    }

    warn(message, meta = {}) {
        const formatted = this.formatMessage('WARN', message, meta);
        
        console.warn(`\x1b[33m[WARN]\x1b[0m ${formatted.timestamp} | ${formatted.message}`);
        if (meta.sessionId) console.warn(`  └─ Session: ${formatted.sessionId} | State: ${formatted.state}`);
        
        this.writeToFile('warn', formatted);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
            const formatted = this.formatMessage('DEBUG', message, meta);
            console.log(`\x1b[90m[DEBUG]\x1b[0m ${formatted.timestamp} | ${formatted.message}`);
            this.writeToFile('debug', formatted);
        }
    }

    // Métricas de performance
    request(sessionId, endpoint, duration) {
        this.metrics.requests++;
        this.info(`Request ${endpoint} completed`, {
            sessionId,
            duration: `${duration}ms`,
            endpoint
        });
    }

    weatherQuery(city, success, duration) {
        this.metrics.weatherQueries++;
        const level = success ? 'info' : 'error';
        this[level](`Weather query for ${city}`, {
            city,
            success,
            duration: `${duration}ms`
        });
    }

    // Métricas do sistema
    getMetrics() {
        const uptime = Date.now() - this.metrics.startTime;
        return {
            ...this.metrics,
            uptime: `${Math.floor(uptime / 1000)}s`,
            requestsPerMinute: Math.round((this.metrics.requests / (uptime / 60000)) * 100) / 100,
            errorRate: this.metrics.requests > 0 ? 
                Math.round((this.metrics.errors / this.metrics.requests) * 100) : 0
        };
    }

    // Health check
    healthCheck() {
        const metrics = this.getMetrics();
        const isHealthy = metrics.errorRate < 10; // Menos de 10% de erro
        
        this.info('Health check', {
            healthy: isHealthy,
            errorRate: `${metrics.errorRate}%`,
            uptime: metrics.uptime
        });

        return {
            status: isHealthy ? 'healthy' : 'unhealthy',
            metrics
        };
    }
}

// Instância singleton
const logger = new Logger();

module.exports = logger;
