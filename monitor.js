#!/usr/bin/env node
// monitor.js - Script simples de monitoramento via linha de comando

const fetch = require('node-fetch');

class SimpleMonitor {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            const data = await response.json();
            return data;
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }

    async getMetrics() {
        try {
            const response = await fetch(`${this.baseUrl}/metrics`);
            const data = await response.json();
            return data;
        } catch (error) {
            return { error: error.message };
        }
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
        if (minutes > 0) return `${minutes}m ${secs}s`;
        return `${secs}s`;
    }

    async displayStatus() {
        console.clear();
        console.log('🔍 Weather Bot - Monitor de Sistema\n');
        console.log('═'.repeat(50));
        
        const health = await this.checkHealth();
        const metrics = await this.getMetrics();
        
        // Status do sistema
        const statusIcon = health.status === 'healthy' ? '✅' : '❌';
        const statusColor = health.status === 'healthy' ? '\x1b[32m' : '\x1b[31m';
        console.log(`${statusColor}${statusIcon} Status: ${health.status.toUpperCase()}\x1b[0m`);
        
        if (metrics.uptime) {
            const uptimeSeconds = parseInt(metrics.uptime.replace('s', ''));
            console.log(`⏱️  Uptime: ${this.formatUptime(uptimeSeconds)}`);
        }
        
        console.log(`📊 Requisições: ${metrics.requests || 0}`);
        console.log(`🌤️  Consultas Climáticas: ${metrics.weatherQueries || 0}`);
        console.log(`📈 Req/Min: ${metrics.requestsPerMinute || 0}`);
        
        // Taxa de erro com cores
        const errorRate = metrics.errorRate || 0;
        const errorColor = errorRate > 5 ? '\x1b[31m' : errorRate > 1 ? '\x1b[33m' : '\x1b[32m';
        console.log(`${errorColor}❌ Taxa de Erro: ${errorRate}%\x1b[0m`);
        
        console.log('═'.repeat(50));
        console.log(`🕐 Última atualização: ${new Date().toLocaleTimeString()}`);
        console.log('Pressione Ctrl+C para sair');
    }

    start() {
        console.log('🚀 Iniciando monitor...');
        this.displayStatus();
        
        // Atualizar a cada 5 segundos
        setInterval(() => {
            this.displayStatus();
        }, 5000);
    }
}

// Verificar se está sendo executado diretamente
if (require.main === module) {
    const monitor = new SimpleMonitor();
    monitor.start();
}

module.exports = SimpleMonitor;
