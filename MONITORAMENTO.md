# 📊 Sistema de Monitoramento - Weather Bot

## Visão Geral
Sistema simples e eficaz de observabilidade para o Weather Bot, implementado sem dependências externas complexas.

## 🛠️ Componentes do Sistema

### 1. **Logger Aprimorado** (`logger.js`)
- **Logs estruturados** em JSON
- **Múltiplos níveis**: INFO, WARN, ERROR, DEBUG
- **Cores no console** para melhor visualização
- **Arquivos de log** separados por nível
- **Métricas automáticas** de performance

### 2. **Endpoints de Monitoramento**
- **`/health`** - Status de saúde da aplicação
- **`/metrics`** - Métricas em tempo real
- **`/dashboard`** - Interface web de monitoramento

### 3. **Dashboard Web** (`/dashboard`)
- Interface visual moderna
- Métricas em tempo real
- Atualização automática a cada 30s
- Indicadores visuais de status

### 4. **Monitor CLI** (`monitor.js`)
- Script de linha de comando
- Atualização em tempo real
- Cores e formatação no terminal

## 🚀 Como Usar

### Monitoramento Web
```bash
# Acesse o dashboard
http://localhost:3000/dashboard
```

### Monitoramento CLI
```bash
# Execute o monitor via linha de comando
npm run monitor
```

### Verificar Status
```bash
# Health check
curl http://localhost:3000/health

# Métricas
curl http://localhost:3000/metrics
```

## 📈 Métricas Coletadas

### Métricas de Sistema
- **Uptime**: Tempo online da aplicação
- **Requests**: Total de requisições
- **Error Rate**: Taxa de erro em %
- **Requests/Min**: Requisições por minuto

### Métricas de Negócio
- **Weather Queries**: Consultas climáticas realizadas
- **Session Tracking**: Rastreamento de sessões
- **State Transitions**: Transições de estado

### Métricas de Performance
- **Response Time**: Tempo de resposta das APIs
- **API Latency**: Latência da OpenWeatherMap
- **Error Tracking**: Rastreamento de erros por contexto

## 🎯 Benefícios do Sistema

### Simplicidade
- ✅ **Zero dependências** externas de monitoramento
- ✅ **Implementação nativa** em Node.js
- ✅ **Fácil manutenção** e customização

### Observabilidade
- ✅ **Logs estruturados** para análise
- ✅ **Métricas em tempo real**
- ✅ **Health checks** automáticos
- ✅ **Rastreamento de sessões**

### Visualização
- ✅ **Dashboard web** responsivo
- ✅ **Monitor CLI** para servidores
- ✅ **Cores e indicadores** visuais
- ✅ **Atualização automática**

## 📁 Estrutura de Logs

```
logs/
├── info.log      # Logs informativos
├── error.log     # Logs de erro
├── warn.log      # Logs de aviso
└── debug.log     # Logs de debug (apenas em desenvolvimento)
```

### Formato dos Logs
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "Nova requisição de chat",
  "sessionId": "session_1234567890_abc",
  "state": "ASK_CITY",
  "duration": "150ms"
}
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
NODE_ENV=development  # Habilita logs de debug
PORT=3000            # Porta do servidor
```

### Níveis de Log
- **INFO**: Operações normais
- **WARN**: Situações de atenção
- **ERROR**: Erros que não quebram a aplicação
- **DEBUG**: Informações detalhadas (apenas em desenvolvimento)

## 📊 Dashboard Features

### Cards de Métricas
- **Status do Sistema**: Indicador de saúde
- **Tempo Online**: Uptime da aplicação
- **Total de Requisições**: Contador global
- **Consultas Climáticas**: Métricas de negócio
- **Requisições/Min**: Taxa de throughput
- **Taxa de Erro**: Indicador de qualidade

### Indicadores Visuais
- 🟢 **Verde**: Sistema saudável
- 🟡 **Amarelo**: Atenção necessária
- 🔴 **Vermelho**: Problemas críticos

## 🚨 Alertas Simples

### Health Check
- **Status**: healthy/unhealthy
- **Critério**: Taxa de erro < 10%
- **Ação**: Monitoramento contínuo

### Métricas Críticas
- **Error Rate > 5%**: Sistema com problemas
- **Error Rate > 1%**: Atenção necessária
- **Zero Requests**: Sistema inativo

## 🔄 Automação

### Atualizações Automáticas
- **Dashboard**: A cada 30 segundos
- **Monitor CLI**: A cada 5 segundos
- **Logs**: Em tempo real

### Rotação de Logs
- **Implementação futura**: Rotação automática
- **Limpeza**: Remoção de logs antigos
- **Compressão**: Otimização de espaço

## 🎯 Próximos Passos

### Melhorias Planejadas
1. **Alertas por email** para erros críticos
2. **Gráficos históricos** de métricas
3. **Exportação de dados** para análise
4. **Integração com Slack** para notificações
5. **Métricas de memória** e CPU

### Escalabilidade
- **Múltiplas instâncias**: Agregação de métricas
- **Banco de dados**: Persistência de métricas
- **API externa**: Envio para serviços de monitoramento

## 💡 Dicas de Uso

### Para Desenvolvimento
```bash
# Executar com logs de debug
NODE_ENV=development npm start

# Monitorar em tempo real
npm run monitor
```

### Para Produção
```bash
# Executar normalmente
npm start

# Verificar saúde
curl http://localhost:3000/health
```

### Para Análise
```bash
# Ver logs de erro
tail -f logs/error.log

# Ver todas as métricas
curl http://localhost:3000/metrics | jq
```

Este sistema de monitoramento oferece uma solução completa e simples para observabilidade, sem a complexidade de ferramentas externas pesadas! 🚀
