# 🚌 Vale Rotas – Sistema de Gerenciamento de Rotas
## Unidade Ponta da Madeira | São Luís –
link do site https://machado1henrique13-svg.github.io/meu-site/

## 📋 Sobre o Projeto

Aplicativo web responsivo para gerenciamento inteligente de rotas de transporte na **Vale S.A., unidade de Ponta da Madeira**. O sistema atende três perfis de usuário: **motoristas** (ônibus e caminhões), **passageiros** e **administradores**.

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação
- Tela de login com seleção de perfil (Motorista / Passageiro / Admin)
- Acesso rápido para demonstração (sem senha real)
- Senha de demonstração: `1234`

### 🚗 Painel do Motorista
- Dashboard com estatísticas em tempo real (distância, tempo, passageiros, combustível)
- Visualização da rota ativa com status das paradas (concluídas, atual, pendentes)
- **Mapa interativo** com Canvas (renderizado em JavaScript puro)
- **3 opções de rota**: Ótima, Alternativa 1 e Alternativa 2
- Instruções de navegação turn-by-turn
- Painel do veículo (KM, combustível, capacidade, revisão)
- **Checklist pré-viagem** interativo
- Central de alertas (trânsito, clima, manutenção) com filtros
- Histórico de rotas realizadas

### 👥 Painel do Passageiro
- Dashboard com ETA em tempo real (countdown animado)
- Rastreamento ao vivo do ônibus na rota
- Barra de progresso da viagem
- Busca de rota personalizada por ponto de embarque e destino
- Grade de horários (manhã, tarde, noite)
- Próximas partidas com status

### 🛠️ Painel do Administrador
- KPIs da frota (ônibus em rota, passageiros, rotas ativas, manutenção)
- Mapa da frota em tempo real com múltiplas rotas
- Status de todas as rotas ativas
- Gerenciamento de rotas (tabela com ações de editar/cancelar)
- Gerenciamento da frota (5 veículos: PDM-1023, 2045, 3078, 4012, 5099)
- Lista de motoristas com status
- **Relatórios com 4 gráficos** (Chart.js): passageiros por rota, rotas/semana, status da frota, combustível
- Modal para criação de nova rota

### 🎨 Design
- Identidade visual Vale (azul #0066CC, verde #00A651)
- Interface 100% responsiva (mobile, tablet, desktop)
- Sidebar colapsável
- Animações e micro-interações
- Toast notifications
- Simulação de movimento do ônibus em tempo real

---

## 🗂️ Estrutura de Arquivos

```
index.html              ← App principal (tela única, SPA)
css/
  style.css             ← Estilos completos com variáveis CSS
js/
  app.js                ← Lógica JavaScript (mapa, simulação, charts)
README.md
```

---

## 🗄️ Banco de Dados (RESTful Table API)

### Tabelas criadas:

| Tabela | Campos | Registros |
|--------|--------|-----------|
| `rotas` | id, nome, tipo, origem, destino, distancia_km, tempo_estimado, status, horario_partida, paradas, veiculo_id, motorista_id | 4 |
| `motoristas` | id, nome, matricula, cnh, categoria_cnh, veiculo_atual, rota_atual, status, telefone, turno | 4 |
| `veiculos` | id, placa, modelo, tipo, capacidade, status, motorista_id, ultima_revisao, km_atual, combustivel | 5 |
| `passageiros` | id, nome, matricula, setor, ponto_embarque, rota_preferencial, turno, telefone | 3 |

---

## 🛣️ URIs e Rotas do Sistema

| URL | Descrição |
|-----|-----------|
| `index.html` | Aplicativo completo (tela inicial: login) |
| `index.html#motorista` | (via JS) Painel do motorista |
| `index.html#passageiro` | (via JS) Painel do passageiro |
| `index.html#admin` | (via JS) Painel do administrador |
| `tables/rotas` | API REST – Rotas |
| `tables/motoristas` | API REST – Motoristas |
| `tables/veiculos` | API REST – Veículos |
| `tables/passageiros` | API REST – Passageiros |

---

## 🔧 Tecnologias Utilizadas

- **HTML5** – Estrutura semântica SPA
- **CSS3** – Custom properties, Grid, Flexbox, animações
- **JavaScript ES6+** – Canvas API, simulação GPS, Chart.js
- **Chart.js** – Gráficos interativos (CDN)
- **Font Awesome 6** – Ícones (CDN)
- **Google Fonts (Inter)** – Tipografia
- **Vale Table API** – Persistência de dados

---

## 🚀 Funcionalidades Futuras (Sugeridas)

- [ ] Integração com GPS real via Geolocation API
- [ ] Notificações push (Service Worker)
- [ ] Integração com Google Maps / OpenStreetMap
- [ ] Sistema de ocorrências com upload de fotos
- [ ] Chat entre motorista e supervisão
- [ ] QR Code para check-in de passageiros
- [ ] Relatórios exportáveis em PDF
- [ ] Autenticação real com JWT
- [ ] App nativo (React Native / Flutter)
- [ ] Integração com sistemas SAP da Vale

---

## 📱 Compatibilidade

| Dispositivo | Suporte |
|-------------|---------|
| Desktop (1200px+) | ✅ Completo |
| Tablet (768px–1199px) | ✅ Adaptado |
| Mobile (< 768px) | ✅ Responsivo |

---

© 2026 Vale S.A. – Todos os direitos reservados  
Sistema desenvolvido para a Unidade de Ponta da Madeira, São Luís – MA


## 🚦 Melhoria aplicada na área do motorista
- Rede colaborativa de motoristas com indicador de conexões ativas
- Feed compartilhado de defeitos na estrada, bloqueios e pista molhada
- Novo painel “Rede Motoristas” com lista de condutores online e canal por rota
- Formulário para notificar buracos, obras, veículos parados e outros riscos
- Modal rápido no dashboard para alertar os demais motoristas e evitar gargalos
- Filtro “Colaborativos” na central de alertas para visualizar avisos enviados pelos colegas
