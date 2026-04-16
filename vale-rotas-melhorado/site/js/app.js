/* =====================================================
   VALE ROTAS – app.js
   Sistema de Gerenciamento de Rotas – Ponta da Madeira
   ===================================================== */

'use strict';

// ─── Estado Global ────────────────────────────────────
const state = {
  currentProfile: 'motorista',
  currentScreen: 'login',
  routeSelected: 'otima',
  busPosition: 0.45,   // 0–1 progresso na rota
  busSpeed: 42,
  etaMinutes: 12,
  charts: {},
  animationInterval: null,
  driverHeartbeatInterval: null,
  connectedDrivers: [
    { id: 1, name: 'Rogério Santos Costa', initials: 'RS', route: 'R004 · Gate 2', vehicle: 'PDM-4012', channel: 'Canal Norte', status: 'Em rota', focus: 'Fluxo livre', lastSeen: 'Agora' },
    { id: 2, name: 'Ana Paula Ferreira', initials: 'AP', route: 'Apoio Portaria Norte', vehicle: 'PDM-3078', channel: 'Canal Industrial', status: 'Disponível', focus: 'Monitorando obras', lastSeen: 'Há 1 min' },
    { id: 3, name: 'João Marcos Oliveira', initials: 'JO', route: 'R002 · Gate 1', vehicle: 'PDM-2045', channel: 'Canal Litorânea', status: 'Em rota', focus: 'Pista molhada', lastSeen: 'Há 2 min' },
    { id: 4, name: 'Patrícia Nunes', initials: 'PN', route: 'Suporte BR-135', vehicle: 'PDM-5099', channel: 'Canal Logística', status: 'Apoio', focus: 'Desvio operacional', lastSeen: 'Há 4 min' },
  ],
  communityAlerts: [
    {
      id: 1,
      title: 'Buraco grande próximo à Portaria Norte',
      message: 'Faixa da direita parcialmente comprometida. Reduzir velocidade e antecipar troca de faixa.',
      type: 'danger',
      severityLabel: 'Crítico',
      location: 'Portaria Norte · km 2',
      author: 'Patrícia Nunes',
      impact: 'Desvio recomendado pelo Gate 2',
      timeLabel: 'Há 2 min',
    },
    {
      id: 2,
      title: 'Pista molhada após curva do Porto Industrial',
      message: 'Trecho com baixa aderência. Manter distância maior entre veículos para evitar retenção.',
      type: 'warning',
      severityLabel: 'Atenção',
      location: 'Porto Industrial · curva principal',
      author: 'João Marcos Oliveira',
      impact: 'Velocidade sugerida de 30 km/h',
      timeLabel: 'Há 6 min',
    },
  ],
};

const PROFILES = {
  motorista: { name: 'Carlos Eduardo Silva', avatar: 'CS', screen: 'motorista-screen' },
  passageiro: { name: 'Fernanda Lima', avatar: 'FL', screen: 'passageiro-screen' },
  admin:      { name: 'Administrador', avatar: 'ADM', screen: 'admin-screen' },
};

// ─── Login ─────────────────────────────────────────────
function selectProfile(profile) {
  state.currentProfile = profile;
  document.querySelectorAll('.profile-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.profile-btn[data-profile="${profile}"]`)?.classList.add('active');
}

function doLogin(e) {
  e.preventDefault();
  const matricula = document.getElementById('login-matricula').value.trim();
  const senha = document.getElementById('login-senha').value;
  if (!matricula || senha !== '1234') {
    showToast('Credenciais inválidas. Use senha: 1234', 'error');
    return;
  }
  enterApp(state.currentProfile);
}

function quickLogin(profile) {
  state.currentProfile = profile;
  enterApp(profile);
}

function enterApp(profile) {
  const p = PROFILES[profile];
  if (!p) return;

  // Esconde todas as screens
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // Ativa a screen correta
  document.getElementById(p.screen)?.classList.add('active');

  // Inicia simulação e features específicas
  if (profile === 'motorista') {
    drawMap('map-canvas', 'otima');
    startBusSimulation();
    initMotoristaCommunity();
  } else if (profile === 'passageiro') {
    drawTrackerMap();
    startBusSimulation();
    startETACountdown();
  } else if (profile === 'admin') {
    drawAdminMap();
    setTimeout(initCharts, 100);
  }

  showToast(`Bem-vindo, ${p.name}!`, 'success');
}

function logout() {
  clearInterval(state.animationInterval);
  clearInterval(state.driverHeartbeatInterval);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('login-screen').classList.add('active');
  // Reset forms
  const m = document.getElementById('login-matricula');
  const s = document.getElementById('login-senha');
  if (m) m.value = '';
  if (s) s.value = '';
  showToast('Sessão encerrada com segurança.', 'warning');
}

// ─── Sidebar ───────────────────────────────────────────
function toggleSidebar(context) {
  const sidebar = document.getElementById(`${context}-sidebar`);
  if (sidebar) sidebar.classList.toggle('open');
}

// ─── Tab Navigation ────────────────────────────────────
function showTab(context, tabId, linkEl) {
  // Remove active de todos os tabs do contexto
  document.querySelectorAll(`#${context}-screen .tab-content`)
    .forEach(t => t.classList.remove('active'));
  document.querySelectorAll(`#${context}-screen .nav-item`)
    .forEach(n => n.classList.remove('active'));

  const target = document.getElementById(`tab-${context}-${tabId}`);
  if (target) target.classList.add('active');
  if (linkEl) linkEl.classList.add('active');

  // Atualiza título
  const titleEl = document.getElementById(`${context}-tab-title`);
  if (titleEl && linkEl) {
    const txt = linkEl.querySelector('span')?.textContent || '';
    titleEl.textContent = txt;
  }

  // Fecha sidebar no mobile
  document.getElementById(`${context}-sidebar`)?.classList.remove('open');
}

function showMotoristaTab(tab, el) {
  showTab('motorista', tab, el);
  if (tab === 'rota') drawMap('map-canvas', state.routeSelected);
  if (tab === 'comunidade' || tab === 'alertas' || tab === 'dashboard') initMotoristaCommunity();
  return false;
}

function showPassageiroTab(tab, el) {
  showTab('passageiro', tab, el);
  if (tab === 'rastrear') drawTrackerMap();
  return false;
}

function showAdminTab(tab, el) {
  showTab('admin', tab, el);
  if (tab === 'relatorios') {
    setTimeout(initCharts, 100);
  }
  if (tab === 'overview') {
    setTimeout(() => drawAdminMap(), 100);
  }
  return false;
}


function getSeverityMeta(type) {
  return {
    warning: { icon: 'fa-triangle-exclamation', label: 'Atenção' },
    danger: { icon: 'fa-road-circle-xmark', label: 'Crítico' },
    info: { icon: 'fa-circle-info', label: 'Informativo' },
  }[type] || { icon: 'fa-circle-info', label: 'Informativo' };
}

function initMotoristaCommunity() {
  renderConnectedDrivers();
  renderRoadWatch();
  renderCommunityFeed();
  syncCommunityAlertsToCentral();
  updateMotoristaCommunityKPIs();
  startDriverHeartbeat();
}

function updateMotoristaCommunityKPIs() {
  const totalDrivers = state.connectedDrivers.length;
  const criticalAlerts = state.communityAlerts.filter(alert => alert.type === 'danger').length;
  const latestEvent = state.communityAlerts[0]?.timeLabel || 'agora';

  const map = {
    'network-online-count': totalDrivers,
    'network-issue-count': state.communityAlerts.length,
    'network-banner-count': totalDrivers,
    'community-online-card': totalDrivers,
    'community-critical-card': criticalAlerts,
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  const lastSync = document.getElementById('last-network-sync');
  if (lastSync) lastSync.textContent = 'agora';

  const lastEvent = document.getElementById('community-last-event');
  if (lastEvent) lastEvent.textContent = latestEvent;

  const alertBadge = document.getElementById('sidebar-alert-badge');
  if (alertBadge) alertBadge.textContent = String(state.communityAlerts.length + 2);

  const networkBadge = document.getElementById('motorista-network-badge');
  if (networkBadge) networkBadge.textContent = String(totalDrivers);
}

function renderConnectedDrivers() {
  const list = document.getElementById('connected-drivers-list');
  if (!list) return;

  list.innerHTML = state.connectedDrivers.map(driver => `
    <div class="connected-driver-item">
      <div class="connected-driver-main">
        <div class="driver-avatar">${driver.initials}</div>
        <div>
          <strong>${driver.name}</strong>
          <p>${driver.route} · ${driver.vehicle}</p>
          <div class="driver-tags">
            <span class="driver-tag">${driver.channel}</span>
            <span class="driver-tag">${driver.focus}</span>
          </div>
        </div>
      </div>
      <div class="connected-driver-status">
        <span class="status-pill ${driver.status === 'Disponível' ? 'ativa' : 'em_andamento'}">${driver.status}</span>
        <small>${driver.lastSeen}</small>
      </div>
    </div>
  `).join('');
}

function buildCommunityAlertCard(alert, compact = false) {
  const meta = getSeverityMeta(alert.type);
  if (compact) {
    return `
      <div class="road-watch-item">
        <div class="road-watch-icon ${alert.type}"><i class="fas ${meta.icon}"></i></div>
        <div class="road-watch-body">
          <strong>${alert.title}</strong>
          <p>${alert.message}</p>
          <div class="road-watch-meta">
            <span>${alert.location}</span>
            <span>${alert.author}</span>
            <span>${alert.timeLabel}</span>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="community-feed-item ${alert.type}">
      <div class="community-feed-icon"><i class="fas ${meta.icon}"></i></div>
      <div class="community-feed-content">
        <strong>${alert.title}</strong>
        <p>${alert.message}</p>
        <div class="community-feed-meta">
          <span class="feed-chip">${alert.location}</span>
          <span class="feed-chip">${alert.impact}</span>
          <span class="feed-chip">${alert.author}</span>
          <span class="feed-chip">${alert.timeLabel}</span>
        </div>
      </div>
    </div>
  `;
}

function renderRoadWatch() {
  const list = document.getElementById('road-watch-list');
  if (!list) return;
  const items = state.communityAlerts.slice(0, 3);
  list.innerHTML = items.length
    ? items.map(alert => buildCommunityAlertCard(alert, true)).join('')
    : '<div class="network-empty-state">Nenhum defeito compartilhado até o momento.</div>';
}

function renderCommunityFeed() {
  const feed = document.getElementById('community-alert-feed');
  if (!feed) return;
  feed.innerHTML = state.communityAlerts.length
    ? state.communityAlerts.map(alert => buildCommunityAlertCard(alert)).join('')
    : '<div class="network-empty-state">A rede está estável. Sem novos alertas.</div>';
}

function syncCommunityAlertsToCentral() {
  const container = document.getElementById('community-alerts-container');
  if (!container) return;

  container.innerHTML = state.communityAlerts.map(alert => {
    const meta = getSeverityMeta(alert.type);
    return `
      <div class="alert-item-full ${alert.type} community-item" data-type="${alert.type}" data-source="community">
        <div class="alert-icon"><i class="fas ${meta.icon}"></i></div>
        <div class="alert-body">
          <strong>${alert.title}</strong>
          <p>${alert.message}</p>
          <small><i class="fas fa-radio"></i> ${alert.author} · ${alert.location} · ${alert.timeLabel}</small>
        </div>
        <span class="alert-badge ${alert.type}">${alert.severityLabel}</span>
      </div>
    `;
  }).join('');
}

function openDriverCommunity() {
  const nav = document.getElementById('nav-motorista-comunidade');
  showMotoristaTab('comunidade', nav);
  document.getElementById('issue-location')?.focus();
}

function reportarOcorrencia() {
  document.getElementById('modal-ocorrencia')?.classList.add('open');
}

function prefillRoadIssueForm() {
  const samples = {
    location: 'Av. dos Portugueses, acesso ao km 7',
    type: 'Buraco na pista',
    severity: 'danger',
    impact: 'Reduzir para 20 km/h e usar faixa da esquerda',
    description: 'Buraco fundo na faixa da direita, logo após a curva. Recomendado sinalizar cedo e evitar frenagem brusca para não formar fila.',
  };

  const apply = (prefix) => {
    const location = document.getElementById(`${prefix}issue-location`);
    const type = document.getElementById(`${prefix}issue-type`);
    const severity = document.getElementById(`${prefix}issue-severity`);
    const impact = document.getElementById(`${prefix}issue-impact`);
    const description = document.getElementById(`${prefix}issue-description`);
    if (location) location.value = samples.location;
    if (type) type.value = samples.type;
    if (severity) severity.value = samples.severity;
    if (impact) impact.value = samples.impact;
    if (description) description.value = samples.description;
  };

  apply('');
  apply('quick-');
  showToast('Exemplo preenchido. Ajuste os detalhes e envie o alerta.', 'info');
}

function collectRoadIssue(prefix = '') {
  const location = document.getElementById(`${prefix}issue-location`)?.value.trim();
  const type = document.getElementById(`${prefix}issue-type`)?.value.trim();
  const severity = document.getElementById(`${prefix}issue-severity`)?.value;
  const impact = document.getElementById(`${prefix}issue-impact`)?.value.trim();
  const description = document.getElementById(`${prefix}issue-description`)?.value.trim();

  if (!location || !type || !severity || !impact || !description) {
    showToast('Preencha todos os campos para avisar os outros motoristas.', 'error');
    return null;
  }

  const severityMeta = getSeverityMeta(severity);
  return {
    id: Date.now(),
    title: `${type} em ${location}`,
    message: description,
    type: severity,
    severityLabel: severityMeta.label,
    location,
    author: PROFILES.motorista.name,
    impact,
    timeLabel: 'Agora mesmo',
  };
}

function saveRoadIssue(alert, formSelector, modalId = null) {
  if (!alert) return;
  state.communityAlerts.unshift(alert);
  state.communityAlerts = state.communityAlerts.slice(0, 8);

  if (formSelector) document.querySelector(formSelector)?.reset();
  if (modalId) closeModal(modalId);

  initMotoristaCommunity();
  showToast(`Alerta enviado para ${state.connectedDrivers.length} motoristas. Gargalo prevenido!`, 'warning');
}

function submitRoadIssue(event) {
  event.preventDefault();
  const alert = collectRoadIssue('');
  saveRoadIssue(alert, '#road-issue-form');
}

function submitQuickRoadIssue(event) {
  event.preventDefault();
  const alert = collectRoadIssue('quick-');
  saveRoadIssue(alert, '#quick-road-issue-form', 'modal-ocorrencia');
}

function startDriverHeartbeat() {
  if (state.driverHeartbeatInterval) return;

  state.driverHeartbeatInterval = setInterval(() => {
    const snapshots = ['Agora', 'Há 1 min', 'Há 2 min', 'Há 3 min'];
    state.connectedDrivers = state.connectedDrivers.map((driver, index) => ({
      ...driver,
      lastSeen: snapshots[(index + Math.floor(Date.now() / 12000)) % snapshots.length],
    }));

    const lastSync = document.getElementById('last-network-sync');
    if (lastSync) lastSync.textContent = 'agora';

    renderConnectedDrivers();
  }, 12000);
}

// ─── Mapa Canvas – Motorista ───────────────────────────
function drawMap(canvasId, route) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // Fundo tipo mapa
  drawMapBackground(ctx, W, H);

  // Pontos da rota
  const stops = [
    { x: 80,  y: H - 80, label: 'Terminal',  done: true  },
    { x: 200, y: H - 140, label: 'Cohama',    done: true  },
    { x: 310, y: H - 100, label: 'Cohab Anil',done: true  },
    { x: 420, y: H - 180, label: 'Turu',      current: true },
    { x: 540, y: H - 120, label: 'S.Cristóvão',done: false },
    { x: 660, y: H - 160, label: 'P. Industrial',done: false},
    { x: W - 60, y: H - 80, label: 'Gate 1',  dest: true  },
  ];

  // Rota alternativa 1
  const alt1 = [
    { x: 80,  y: H - 80 },
    { x: 180, y: H - 230 },
    { x: 340, y: H - 260 },
    { x: 500, y: H - 220 },
    { x: 620, y: H - 250 },
    { x: W - 60, y: H - 80 },
  ];
  // Rota alternativa 2
  const alt2 = [
    { x: 80,  y: H - 80 },
    { x: 200, y: H - 60 },
    { x: 380, y: H - 40 },
    { x: 560, y: H - 70 },
    { x: W - 60, y: H - 80 },
  ];

  // Desenha rotas
  if (route === 'otima' || route === 'all') {
    drawRoute(ctx, stops, '#0066CC', 4, true);
  }
  if (route === 'alt1' || route === 'all') {
    drawRoute(ctx, alt1, '#F5A623', 3, false, [8, 6]);
  }
  if (route === 'alt2' || route === 'all') {
    drawRoute(ctx, alt2, '#9CA3AF', 3, false, [8, 6]);
  }

  // Zona de trânsito lento
  drawTrafficZone(ctx, 540, H - 120, 60, 'rgba(231, 76, 60, 0.15)');

  // Paradas
  stops.forEach(stop => {
    if (stop.dest) {
      drawFlag(ctx, stop.x, stop.y, stop.label);
    } else if (stop.current) {
      drawBusMarker(ctx, stop.x, stop.y, stop.label);
    } else {
      drawStop(ctx, stop.x, stop.y, stop.label, stop.done);
    }
  });
}

function drawMapBackground(ctx, W, H) {
  // Gradiente de fundo
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#E8F4FD');
  grad.addColorStop(1, '#EBF5E1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(0,102,204,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Rua decorativa horizontal
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.6);
  ctx.lineTo(W, H * 0.6);
  ctx.stroke();
}

function drawRoute(ctx, points, color, width, animated, dash = []) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash(dash);
  ctx.shadowColor = color;
  ctx.shadowBlur = animated ? 6 : 0;
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(p => {
    const prev = points[points.indexOf(p) - 1];
    const cpx = (prev.x + p.x) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, cpx, (prev.y + p.y) / 2);
    ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
}

function drawStop(ctx, x, y, label, done) {
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fillStyle = done ? '#00A651' : 'white';
  ctx.fill();
  ctx.strokeStyle = done ? '#007A3D' : '#0066CC';
  ctx.lineWidth = 2;
  ctx.stroke();
  drawLabel(ctx, x, y - 16, label, '#374151', '700 11px Inter');
}

function drawBusMarker(ctx, x, y, label) {
  // Pulsação
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,102,204,0.15)';
  ctx.fill();

  // Ícone do ônibus
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 12, 32, 22, 5);
  ctx.fillStyle = '#0066CC';
  ctx.fill();

  // Janelas
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(x - 12, y - 9, 8, 6);
  ctx.fillRect(x + 4, y - 9, 8, 6);

  // Rodas
  ctx.beginPath();
  ctx.arc(x - 8, y + 11, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#1A1D23';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 8, y + 11, 4, 0, Math.PI * 2);
  ctx.fill();

  drawLabel(ctx, x, y - 28, label + ' ← Aqui', '#0066CC', 'bold 11px Inter');
}

function drawFlag(ctx, x, y, label) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#00A651';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.font = 'bold 10px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('✓', x, y + 4);

  drawLabel(ctx, x, y - 18, label, '#007A3D', 'bold 11px Inter');
}

function drawTrafficZone(ctx, cx, cy, r, color) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.font = '10px Inter';
  ctx.fillStyle = '#E74C3C';
  ctx.textAlign = 'center';
  ctx.fillText('⚠ Trânsito', cx, cy + 4);
}

function drawLabel(ctx, x, y, text, color, font) {
  ctx.font = font || '11px Inter';
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// ─── Mapa Rastreador – Passageiro ──────────────────────
function drawTrackerMap() {
  const canvas = document.getElementById('tracker-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  drawMapBackground(ctx, W, H);

  // Rota
  const stops = [
    { x: 80, y: H - 60 },
    { x: 200, y: H - 120 },
    { x: 320, y: H - 90 },
    { x: 440, y: H - 150 },
    { x: 560, y: H - 100 },
    { x: 680, y: H - 130 },
    { x: W - 60, y: H - 60 },
  ];

  drawRoute(ctx, stops, '#E5E7EB', 6, false);

  // Segmento percorrido
  const progress = state.busPosition;
  const progressStops = stops.slice(0, Math.ceil(stops.length * progress) + 1);
  drawRoute(ctx, progressStops, '#00A651', 5, false);

  // Posição atual do ônibus
  const busIdx = Math.floor(progress * (stops.length - 1));
  const busStop = stops[Math.min(busIdx, stops.length - 1)];
  drawBusMarker(ctx, busStop.x, busStop.y, 'PDM-1023');

  // Marcador do passageiro (ponto de embarque)
  const paxStop = stops[2];
  ctx.beginPath();
  ctx.arc(paxStop.x, paxStop.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#F5A623';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
  drawLabel(ctx, paxStop.x, paxStop.y - 18, 'Seu ponto', '#B45309', 'bold 11px Inter');

  // Destino
  const dest = stops[stops.length - 1];
  drawFlag(ctx, dest.x, dest.y, 'Gate 1');

  // Labels das paradas
  const labels = ['Terminal', 'Cohama', 'Turu', 'S.Cristóvão', 'P.Industrial', 'Port.Norte', 'Gate 1'];
  stops.forEach((s, i) => {
    if (i !== busIdx && i !== 2 && i !== stops.length - 1) {
      drawStop(ctx, s.x, s.y, labels[i], i < busIdx);
    }
  });
}

// ─── Mapa Admin ────────────────────────────────────────
function drawAdminMap() {
  const canvas = document.getElementById('admin-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);
  drawMapBackground(ctx, W, H);

  // Múltiplas rotas
  const r1 = [{x:60,y:H-50},{x:160,y:H-100},{x:280,y:H-80},{x:380,y:H-130},{x:W-80,y:H-60}];
  const r2 = [{x:60,y:H-160},{x:150,y:H-200},{x:260,y:H-180},{x:W-80,y:H-60}];
  const r3 = [{x:W/2,y:H-220},{x:W/2+60,y:H-170},{x:W-80,y:H-60}];

  drawRoute(ctx, r1, '#0066CC', 4, false);
  drawRoute(ctx, r2, '#00A651', 4, false);
  drawRoute(ctx, r3, '#F5A623', 3, false, [6,4]);

  // Veículos
  drawBusMarker(ctx, 280, H - 80, 'PDM-1023');
  drawBusMarker(ctx, 150, H - 200, 'PDM-2045');

  // Caminhão
  ctx.fillStyle = '#F5A623';
  ctx.beginPath();
  ctx.roundRect(W/2 + 60 - 14, H - 170 - 12, 28, 20, 4);
  ctx.fill();
  drawLabel(ctx, W/2 + 60, H - 170 - 22, 'PDM-4012', '#B45309', 'bold 10px Inter');

  // Destino
  drawFlag(ctx, W - 80, H - 60, 'Porto PM');
}

// ─── Seleção de Rota (Motorista) ───────────────────────
function selectRoute(route) {
  state.routeSelected = route;

  document.querySelectorAll('.btn-map-ctrl').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-rota-${route === 'otima' ? 'otima' : route}`)?.classList.add('active');

  document.querySelectorAll('.route-option-card').forEach(c => c.classList.remove('active'));
  document.getElementById(`opt-${route === 'otima' ? 'otima' : route}`)?.classList.add('active');

  drawMap('map-canvas', route);
  showToast(`Rota ${route === 'otima' ? 'Ótima' : route === 'alt1' ? 'Alternativa 1' : 'Alternativa 2'} selecionada!`, 'success');
}

// ─── Simulação em Tempo Real ───────────────────────────
function startBusSimulation() {
  if (state.animationInterval) clearInterval(state.animationInterval);

  state.animationInterval = setInterval(() => {
    // Avança posição do ônibus
    state.busPosition = Math.min(1, state.busPosition + 0.002);

    // Atualiza velocidade aleatória
    state.busSpeed = 35 + Math.floor(Math.random() * 20);

    // Atualiza ETA
    state.etaMinutes = Math.max(0, Math.round((1 - state.busPosition) * 45));

    // Atualiza UI do passageiro se visível
    const etaEl = document.getElementById('eta-countdown');
    if (etaEl) etaEl.textContent = state.etaMinutes;

    const speedEl = document.getElementById('bus-speed');
    if (speedEl) speedEl.textContent = state.busSpeed + ' km/h';

    const etaEl2 = document.getElementById('bus-eta');
    if (etaEl2) etaEl2.textContent = `~${state.etaMinutes} min`;

    // Atualiza posição exibida
    const locEl = document.getElementById('bus-location');
    if (locEl) {
      const locs = ['Terminal', 'Cohama', 'Turu', 'S.Cristóvão', 'P.Industrial', 'Gate 1'];
      const idx = Math.floor(state.busPosition * locs.length);
      locEl.textContent = locs[Math.min(idx, locs.length - 1)];
    }

    // Atualiza barra de progresso
    const bar = document.querySelector('.progress-bar-fill');
    if (bar) bar.style.width = (state.busPosition * 100).toFixed(1) + '%';

    // Redesenha mapa se ativo
    const trackerTab = document.getElementById('tab-passageiro-rastrear');
    if (trackerTab?.classList.contains('active')) {
      drawTrackerMap();
    }

    // Reinicia simulação quando chegar ao destino
    if (state.busPosition >= 1) {
      state.busPosition = 0;
    }
  }, 2000);
}

function startETACountdown() {
  setInterval(() => {
    if (state.etaMinutes > 0) {
      const etaEl = document.getElementById('eta-countdown');
      if (etaEl) {
        etaEl.style.transform = 'scale(1.1)';
        setTimeout(() => { etaEl.style.transform = 'scale(1)'; }, 200);
      }
    }
  }, 5000);
}

// ─── Alertas ────────────────────────────────────────────
function filterAlerts(type, el) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');

  const items = document.querySelectorAll('.alert-item-full');
  items.forEach(item => {
    if (type === 'all') {
      item.style.display = '';
    } else if (type === 'community') {
      item.style.display = item.dataset.source === 'community' ? '' : 'none';
    } else {
      item.style.display = item.dataset.type === type ? '' : 'none';
    }
  });
}

// ─── Checklist ─────────────────────────────────────────
function salvarChecklist() {
  const checkboxes = document.querySelectorAll('#checklist-items input[type="checkbox"]');
  const total = checkboxes.length;
  const checked = [...checkboxes].filter(c => c.checked).length;

  if (checked < total) {
    showToast(`⚠ ${total - checked} item(ns) pendente(s). Verificar antes de partir!`, 'warning');
  } else {
    showToast('Checklist completo! Boa viagem! ✓', 'success');
  }
}

// ─── Reportar Ocorrência ────────────────────────────────

// ─── Rota Passageiro ───────────────────────────────────
function calcularRotaPassageiro() {
  const origem = document.getElementById('pax-origem')?.value;
  const destino = document.getElementById('pax-destino')?.value;

  const routeData = {
    'Cohama': { linha: 'R001', onibus: 'PDM-1023', horario: '06:00', tempo: '45 min', vagas: '6' },
    'Cohab Anil': { linha: 'R001', onibus: 'PDM-1023', horario: '06:00', tempo: '40 min', vagas: '6' },
    'Turu': { linha: 'R001', onibus: 'PDM-1023', horario: '06:00', tempo: '35 min', vagas: '6' },
    'Vila Embratel': { linha: 'R002', onibus: 'PDM-2045', horario: '06:30', tempo: '30 min', vagas: '18' },
    'Mauro Fecury': { linha: 'R002', onibus: 'PDM-2045', horario: '06:30', tempo: '25 min', vagas: '18' },
  };

  const route = routeData[origem] || routeData['Cohama'];
  const result = document.getElementById('pax-route-result');
  if (!result) return;

  result.innerHTML = `
    <div class="route-result-card best">
      <div class="result-header">
        <i class="fas fa-star"></i>
        <strong>Melhor opção: ${origem} → ${destino}</strong>
        <span class="badge-best">Recomendada</span>
      </div>
      <div class="result-body">
        <div class="result-row">
          <span><i class="fas fa-bus"></i> Ônibus:</span>
          <strong>Linha ${route.linha} – ${route.onibus}</strong>
        </div>
        <div class="result-row">
          <span><i class="fas fa-clock"></i> Horário:</span>
          <strong>${route.horario} (próximo às 14:00)</strong>
        </div>
        <div class="result-row">
          <span><i class="fas fa-map-pin"></i> Embarque:</span>
          <strong>${origem}</strong>
        </div>
        <div class="result-row">
          <span><i class="fas fa-hourglass-half"></i> Chegada:</span>
          <strong>~${route.tempo}</strong>
        </div>
        <div class="result-row">
          <span><i class="fas fa-users"></i> Disponível:</span>
          <strong>${route.vagas} vagas livres</strong>
        </div>
      </div>
    </div>
  `;

  showToast(`Rota encontrada: ${origem} → ${destino}`, 'success');
}

// ─── Horários Tabs (Passageiro) ─────────────────────────
function showHorarioTab(tab, el) {
  document.querySelectorAll('.horario-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.htab').forEach(b => b.classList.remove('active'));
  document.getElementById(`horario-${tab}`)?.classList.add('active');
  el.classList.add('active');
}

// ─── Modal Nova Rota ────────────────────────────────────
function showNewRouteModal() {
  document.getElementById('modal-nova-rota').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function criarNovaRota() {
  showToast('Nova rota criada com sucesso!', 'success');
  closeModal('modal-nova-rota');
}

// ─── Charts (Admin) ─────────────────────────────────────
function initCharts() {
  // Destrói charts existentes
  Object.values(state.charts).forEach(c => { try { c.destroy(); } catch(e){} });
  state.charts = {};

  // 1. Passageiros por rota
  const ctx1 = document.getElementById('chart-passageiros');
  if (ctx1) {
    state.charts.passageiros = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['R001', 'R002', 'R003', 'R004'],
        datasets: [{
          label: 'Passageiros transportados',
          data: [42, 34, 0, 22],
          backgroundColor: ['#0066CC', '#00A651', '#F5A623', '#6B7280'],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Rotas por dia da semana
  const ctx2 = document.getElementById('chart-rotas-semana');
  if (ctx2) {
    state.charts.semana = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [{
          label: 'Rotas realizadas',
          data: [8, 9, 7, 10, 9, 4, 2],
          borderColor: '#0066CC',
          backgroundColor: 'rgba(0,102,204,0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#0066CC',
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Status da Frota
  const ctx3 = document.getElementById('chart-frota');
  if (ctx3) {
    state.charts.frota = new Chart(ctx3, {
      type: 'doughnut',
      data: {
        labels: ['Em Rota', 'Disponível', 'Manutenção'],
        datasets: [{
          data: [3, 1, 1],
          backgroundColor: ['#0066CC', '#00A651', '#E74C3C'],
          borderWidth: 0,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } }
        }
      }
    });
  }

  // 4. Combustível
  const ctx4 = document.getElementById('chart-combustivel');
  if (ctx4) {
    state.charts.combustivel = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: ['PDM-1023', 'PDM-2045', 'PDM-3078', 'PDM-4012', 'PDM-5099'],
        datasets: [{
          label: 'Nível %',
          data: [75, 60, 90, 45, 30],
          backgroundColor: (ctx) => {
            const v = ctx.parsed.y;
            return v >= 60 ? '#00A651' : v >= 40 ? '#F5A623' : '#E74C3C';
          },
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, grid: { color: '#F3F4F6' },
            ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

// ─── Toast ─────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Polyfill roundRect ────────────────────────────────
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}

// ─── Inicialização ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  console.log('Vale Rotas – Sistema inicializado ✓');
  initMotoristaCommunity();

  // Clicar fora da sidebar fecha ela no mobile
  document.addEventListener('click', (e) => {
    const sidebars = document.querySelectorAll('.sidebar');
    sidebars.forEach(sb => {
      if (sb.classList.contains('open') && !sb.contains(e.target)) {
        const btn = document.querySelector('.menu-toggle');
        if (!btn?.contains(e.target)) sb.classList.remove('open');
      }
    });
  });

  // Atalho de teclado: ESC fecha modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.sidebar.open').forEach(s => s.classList.remove('open'));
    }
  });
});
