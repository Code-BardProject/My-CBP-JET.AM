let chartInstance;
let maps = {};
let mapsInitialized = { scooters: false, bikes: false, cars: false, all: false };

const mapCenter = [40.1792, 44.4991];

// Базовые слои для карт
const baseLayers = {
    light: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri',
        maxZoom: 18
    }),
    terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors',
        maxZoom: 17
    })
};

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
}

const createIcon = (emoji, className) => L.divIcon({
    className: 'custom-marker ' + className,
    html: emoji,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const userIcon = createIcon('<i class="fa-solid fa-user" style="font-size:14px;color:white"></i>', 'marker-user');
const vehicleIcon = createIcon('🛴', '');
const bikeIcon = createIcon('🚲', '');
const carIcon = createIcon('🚗', '');
const busyIcon = createIcon('🔒', 'marker-busy');

const scootersData = [
    { id: 'JET Pro #8743', lat: 40.182, lon: 44.502, price: '89₽/10мин', battery: '85%', free: true },
    { id: 'JET Lite #3921', lat: 40.176, lon: 44.495, price: '49₽/10мин', battery: '92%', free: true },
    { id: 'JET Pro #1124', lat: 40.185, lon: 44.508, price: 'Занят до 14:30', battery: '', free: false }
];
const bikesData = [
    { id: 'JET Bike #B-452', lat: 40.181, lon: 44.498, price: '150₽/час', battery: '100%' },
    { id: 'JET MTB #B-231', lat: 40.174, lon: 44.506, price: '200₽/час', battery: '88%' }
];
const carsData = [
    { id: 'Hyundai Solaris #C-456', lat: 40.172, lon: 44.488, price: '2,800₽/день', fuel: '85%' },
    { id: 'KIA Rio #C-789', lat: 40.188, lon: 44.512, price: '2,500₽/день', fuel: '75%' }
];

// Данные для дополнительных слоёв
const camerasData = [
    { id: 'CAM-001', lat: 40.180, lon: 44.500, type: 'Камера контроля скорости' },
    { id: 'CAM-002', lat: 40.178, lon: 44.505, type: 'Камера на перекрёстке' },
    { id: 'CAM-003', lat: 40.185, lon: 44.495, type: 'Камера парковки' },
    { id: 'CAM-004', lat: 40.175, lon: 44.510, type: 'Камера контроля полосы' }
];

const trafficLightsData = [
    { id: 'TL-001', lat: 40.181, lon: 44.498, status: 'green' },
    { id: 'TL-002', lat: 40.179, lon: 44.502, status: 'red' },
    { id: 'TL-003', lat: 40.183, lon: 44.496, status: 'yellow' },
    { id: 'TL-004', lat: 40.177, lon: 44.508, status: 'green' },
    { id: 'TL-005', lat: 40.184, lon: 44.492, status: 'red' }
];

const trafficJamsData = [
    { id: 'JAM-001', lat: 40.180, lon: 44.505, level: 'high', name: 'пр. Маштоца' },
    { id: 'JAM-002', lat: 40.176, lon: 44.498, level: 'medium', name: 'ул. Абовяна' },
    { id: 'JAM-003', lat: 40.182, lon: 44.492, level: 'low', name: 'ул. Сарьяна' }
];

// Иконки для дополнительных слоёв
const cameraIcon = createIcon('📹', 'marker-camera');
const trafficLightGreenIcon = createIcon('🟢', 'marker-traffic-light');
const trafficLightYellowIcon = createIcon('🟡', 'marker-traffic-light');
const trafficLightRedIcon = createIcon('🔴', 'marker-traffic-light');

const trafficJamIcons = {
    high: createIcon('🔴', 'marker-jam-high'),
    medium: createIcon('🟠', 'marker-jam-medium'),
    low: createIcon('🟡', 'marker-jam-low')
};

// Функция добавления кнопки местоположения
function addLocateButton(map, mapId) {
    const container = document.getElementById(mapId);
    if (!container) return;
    
    const btn = document.createElement('button');
    btn.className = 'locate-btn';
    btn.innerHTML = '<i class="fa-solid fa-crosshairs"></i>';
    btn.title = 'Моё местоположение';
    btn.onclick = () => {
        map.setView(mapCenter, 14);
        showToast('📍 Возвращено к местоположению');
    };
    container.style.position = 'relative';
    container.appendChild(btn);
}

// Функция инициализации карты с контролем слоёв
function initMapWithLayers(mapId, zoom) {
    const map = L.map(mapId, { zoomControl: false }).setView(mapCenter, zoom);
    
    // Добавляем слой по умолчанию (светлый)
    baseLayers.light.addTo(map);
    
    // Создаём группы для оверлей-слоёв
    const camerasLayer = L.layerGroup();
    const trafficLightsLayer = L.layerGroup();
    const trafficJamsLayer = L.layerGroup();
    
    // Добавляем камеры
    camerasData.forEach(cam => {
        const popup = `<b>📹 ${cam.id}</b><br>${cam.type}`;
        L.marker([cam.lat, cam.lon], { icon: cameraIcon }).addTo(camerasLayer).bindPopup(popup);
    });
    
    // Добавляем светофоры
    trafficLightsData.forEach(tl => {
        let icon;
        let statusText;
        switch(tl.status) {
            case 'green': icon = trafficLightGreenIcon; statusText = 'Зелёный'; break;
            case 'yellow': icon = trafficLightYellowIcon; statusText = 'Жёлтый'; break;
            case 'red': icon = trafficLightRedIcon; statusText = 'Красный'; break;
        }
        const popup = `<b>🚦 ${tl.id}</b><br>Статус: ${statusText}`;
        L.marker([tl.lat, tl.lon], { icon: icon }).addTo(trafficLightsLayer).bindPopup(popup);
    });
    
    // Добавляем пробки
    trafficJamsData.forEach(jam => {
        const icon = trafficJamIcons[jam.level];
        const levelText = jam.level === 'high' ? 'Сильный' : (jam.level === 'medium' ? 'Средний' : 'Слабый');
        const popup = `<b>🚗 ${jam.id}</b><br>${jam.name}<br>Пробка: ${levelText}`;
        L.marker([jam.lat, jam.lon], { icon: icon }).addTo(trafficJamsLayer).bindPopup(popup);
    });
    
    // Добавляем контрол слоёв (базовые + оверлеи)
    const layerControl = L.control.layers({
        'Карта': baseLayers.light,
        'Спутник': baseLayers.satellite,
        'Рельеф': baseLayers.terrain
    }, {
        '📹 Камеры': camerasLayer,
        '🚦 Светофоры': trafficLightsLayer,
        '🚗 Пробки': trafficJamsLayer
    }, { position: 'topright' }).addTo(map);
    
    // Добавляем кнопку местоположения
    addLocateButton(map, mapId);
    
    return { map, layers: { cameras: camerasLayer, trafficLights: trafficLightsLayer, trafficJams: trafficJamsLayer } };
}

function initScootersMap() {
    if (mapsInitialized.scooters) return;
    const container = document.getElementById('map-scooters');
    if (!container) return;
    
    const result = initMapWithLayers('map-scooters', 14);
    maps.scooters = result.map;
    L.marker(mapCenter, { icon: userIcon }).addTo(maps.scooters).bindPopup('<b>📍 Вы здесь</b>');
    scootersData.forEach(s => {
        const dist = getDistance(mapCenter[0], mapCenter[1], s.lat, s.lon);
        const icon = s.free ? vehicleIcon : busyIcon;
        const popup = `<b>🛴 ${s.id}</b><br>📏 ${dist} км от вас<br>${s.price}<br>🔋 ${s.battery}`;
        L.marker([s.lat, s.lon], { icon: icon }).addTo(maps.scooters).bindPopup(popup);
    });
    mapsInitialized.scooters = true;
}

function initBikesMap() {
    if (mapsInitialized.bikes) return;
    const container = document.getElementById('map-bikes');
    if (!container) return;
    
    const result = initMapWithLayers('map-bikes', 14);
    maps.bikes = result.map;
    L.marker(mapCenter, { icon: userIcon }).addTo(maps.bikes).bindPopup('<b>📍 Вы здесь</b>');
    bikesData.forEach(b => {
        const dist = getDistance(mapCenter[0], mapCenter[1], b.lat, b.lon);
        const popup = `<b>🚲 ${b.id}</b><br>📏 ${dist} км от вас<br>${b.price}<br>🔋 ${b.battery}`;
        L.marker([b.lat, b.lon], { icon: bikeIcon }).addTo(maps.bikes).bindPopup(popup);
    });
    mapsInitialized.bikes = true;
}

function initCarsMap() {
    if (mapsInitialized.cars) return;
    const container = document.getElementById('map-cars');
    if (!container) return;
    
    const result = initMapWithLayers('map-cars', 13);
    maps.cars = result.map;
    L.marker(mapCenter, { icon: userIcon }).addTo(maps.cars).bindPopup('<b>📍 Вы здесь</b>');
    carsData.forEach(c => {
        const dist = getDistance(mapCenter[0], mapCenter[1], c.lat, c.lon);
        const popup = `<b>🚗 ${c.id}</b><br>📏 ${dist} км от вас<br>${c.price}<br>⛽ ${c.fuel}`;
        L.marker([c.lat, c.lon], { icon: carIcon }).addTo(maps.cars).bindPopup(popup);
    });
    mapsInitialized.cars = true;
}

function initAllMap() {
    if (mapsInitialized.all) return;
    const container = document.getElementById('map-all');
    if (!container) return;
    
    const result = initMapWithLayers('map-all', 13);
    maps.all = result.map;
    L.marker(mapCenter, { icon: userIcon }).addTo(maps.all).bindPopup('<b>📍 Вы здесь</b>');
    scootersData.forEach(s => {
        const dist = getDistance(mapCenter[0], mapCenter[1], s.lat, s.lon);
        const icon = s.free ? vehicleIcon : busyIcon;
        L.marker([s.lat, s.lon], { icon: icon }).addTo(maps.all).bindPopup(`🛴 ${s.id}<br>📏 ${dist} км`);
    });
    bikesData.forEach(b => {
        const dist = getDistance(mapCenter[0], mapCenter[1], b.lat, b.lon);
        L.marker([b.lat, b.lon], { icon: bikeIcon }).addTo(maps.all).bindPopup(`🚲 ${b.id}<br>📏 ${dist} км`);
    });
    carsData.forEach(c => {
        const dist = getDistance(mapCenter[0], mapCenter[1], c.lat, c.lon);
        L.marker([c.lat, c.lon], { icon: carIcon }).addTo(maps.all).bindPopup(`🚗 ${c.id}<br>📏 ${dist} км`);
    });
    mapsInitialized.all = true;
}

function initMapByType(type) {
    switch(type) {
        case 'scooters': initScootersMap(); break;
        case 'bikes': initBikesMap(); break;
        case 'cars': initCarsMap(); break;
        case 'all-vehicles': initAllMap(); break;
    }
}

function invalidateAllMaps() {
    setTimeout(() => {
        Object.values(maps).forEach(map => {
            if (map && map.invalidateSize) map.invalidateSize();
        });
    }, 100);
    setTimeout(() => {
        Object.values(maps).forEach(map => {
            if (map && map.invalidateSize) map.invalidateSize();
        });
    }, 300);
}

function initDashboard() {
    initChart();
    startTimer();
    loadUserData();
    console.log('%c🚀 JET Dashboard v4.0', 'color:#00f0ff; font-size:20px; font-weight:700');
}

// Загрузка данных пользователя из localStorage
function loadUserData() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (userName) {
        // Обновляем имя в сайдбаре
        const sidebarName = document.getElementById('sidebar-user-name');
        if (sidebarName) sidebarName.textContent = userName + ' К.';
        
        // Обновляем имя в заголовке
        const headerName = document.getElementById('header-user-name');
        if (headerName) headerName.textContent = userName;
        
        // Обновляем имя в профиле
        const profileName = document.getElementById('profile-user-name');
        if (profileName) profileName.textContent = userName + ' К.';
        
        // Обновляем email в профиле
        if (userEmail) {
            const profileEmail = document.getElementById('profile-user-email');
            if (profileEmail) profileEmail.textContent = userEmail;
            
            const editEmail = document.getElementById('profile-edit-email');
            if (editEmail) editEmail.value = userEmail;
        }
        
        // Обновляем поле редактирования имени
        const editName = document.getElementById('profile-edit-name');
        if (editName) editName.value = userName + ' К.';
    }
}

function initChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0,240,255,0.4)');
    gradient.addColorStop(1, 'rgba(0,240,255,0)');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            datasets: [{
                label: 'Поездки',
                data: [3, 5, 4, 7, 2, 6, 8],
                borderColor: '#00f0ff',
                backgroundColor: gradient,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00f0ff',
                pointBorderColor: '#0a0a0a',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#6b7280' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280' } }
            }
        }
    });
}
function changeChart(period) {
    const data = period === 'week' ? [3, 5, 4, 7, 2, 6, 8] : [18, 22, 25, 30, 28, 35, 42, 38, 45, 50, 48, 55];
    const labels = period === 'week' ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
    showToast('📊 График обновлён');
}
function startTimer() {
    let m = 12, s = 45;
    setInterval(() => {
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 0; s = 0; }
        document.getElementById('timer-m').textContent = m.toString().padStart(2, '0');
        document.getElementById('timer-s').textContent = s.toString().padStart(2, '0');
    }, 1000);
}
function extendRental() {
    showToast('⏱️ Аренда продлена на 10 минут (+50 ₽)');
    updateStatValue(1, -50);
}
function endRental() {
    showToast('✅ Поездка завершена! +75 XP');
    document.querySelector('.rental-status').style.display = 'none';
}
function showOnMap() {
    showToast('📍 Открываем карту...');
}
function copyReferral() {
    navigator.clipboard.writeText('JET-TARLAN-300').then(() => showToast('📋 Реферальный код скопирован!'));
}
function shareAchievement() {
    showToast('🔗 Ссылка на достижение скопирована');
}
function viewAllAchievements() {
    showToast('🏆 Все достижения открыты');
}
function showNotifications() {
    // Создаем модальное окно уведомлений
    let modal = document.getElementById('notifications-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notifications-modal';
        modal.className = 'notifications-modal';
        modal.innerHTML = `
            <div class="notifications-panel" onclick="event.stopPropagation()">
                <div class="notifications-header">
                    <h3><i class="fa-solid fa-bell" style="color: var(--primary);"></i> Уведомления</h3>
                    <button onclick="closeNotifications()" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border:none;border-radius:10px;color:white;cursor:pointer;"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="notifications-list-modal">
                    <div class="notification-item unread" onclick="markRead(this)">
                        <div class="notification-icon-wrap info">🛴</div>
                        <div style="flex:1;">
                            <h4 style="font-size:14px;font-weight:600;margin-bottom:4px;">Самокат ждёт!</h4>
                            <p style="font-size:13px;color:var(--text-gray);">JET Pro #8743 доступен рядом с вами</p>
                            <span style="font-size:11px;color:var(--primary);">2 мин назад</span>
                        </div>
                    </div>
                    <div class="notification-item unread" onclick="markRead(this)">
                        <div class="notification-icon-wrap success">✅</div>
                        <div style="flex:1;">
                            <h4 style="font-size:14px;font-weight:600;margin-bottom:4px;">Поездка завершена</h4>
                            <p style="font-size:13px;color:var(--text-gray);">Вы получили +50 ₽ кэшбэка</p>
                            <span style="font-size:11px;color:var(--text-gray);">вчера</span>
                        </div>
                    </div>
                    <div class="notification-item" onclick="markRead(this)">
                        <div class="notification-icon-wrap warning">🎁</div>
                        <div style="flex:1;">
                            <h4 style="font-size:14px;font-weight:600;margin-bottom:4px;">Новый промокод!</h4>
                            <p style="font-size:13px;color:var(--text-gray);">FIRST15 — первые 15 минут бесплатно</p>
                            <span style="font-size:11px;color:var(--text-gray);">3 дня назад</span>
                        </div>
                    </div>
                </div>
                <button onclick="markAllRead()" style="width:100%;margin-top:16px;padding:12px;background:linear-gradient(135deg,var(--primary),var(--secondary));border:none;border-radius:12px;color:var(--bg-dark);font-weight:600;cursor:pointer;">Отметить все прочитанными</button>
            </div>
        `;
        modal.onclick = closeNotifications;
        document.body.appendChild(modal);
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeNotifications() {
    const modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}
function markRead(item) {
    item.classList.remove('unread');
    item.style.borderLeftColor = 'transparent';
}
function markAllRead() {
    document.querySelectorAll('.notification-item').forEach(item => markRead(item));
    showToast('✅ Все уведомления прочитаны');
    document.querySelector('.badge')?.remove();
    document.querySelector('.nav-badge')?.remove();
}
function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.header-btn i.fa-moon, .header-btn i.fa-sun');
    body.classList.toggle('light-theme');
    if (body.classList.contains('light-theme')) {
        showToast('☀️ Светлая тема активна');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    } else {
        showToast('🌙 Тёмная тема активна');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
    localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
}
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const icon = document.querySelector('.header-btn i.fa-moon');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    }
}
function showSection(section, event) {
    let navItem;
    if (event && event.target) {
        navItem = event.target.closest('.nav-item');
    }
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if (navItem) {
        navItem.classList.add('active');
    } else {
        document.querySelectorAll('.nav-item').forEach(item => {
            const onclick = item.getAttribute('onclick') || '';
            if (onclick.includes("'" + section + "'") || onclick.includes('"' + section + '"')) {
                item.classList.add('active');
            }
        });
    }
    
    document.querySelectorAll('.section-content').forEach(content => content.classList.remove('active'));
    
    const targetSection = document.getElementById('section-' + section);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    const burger = document.getElementById('burger');
    if (burger) burger.checked = false;
    document.querySelector('.sidebar')?.classList.remove('active');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
    
    // Инициализация карты для этой секции (с задержкой для отрисовки DOM)
    setTimeout(() => {
        initMapByType(section);
    }, 50);
    
    // Обновляем размеры всех карт
    setTimeout(() => {
        invalidateAllMaps();
    }, 150);
}

function getSectionName(section) {
    const names = {
        'scooters': 'Самокаты', 'bikes': 'Велосипеды', 'cars': 'Автомобили',
        'all-vehicles': 'Весь транспорт', 'overview': 'Обзор', 'activity': 'Мои поездки',
        'achievements': 'Достижения', 'wallet': 'Кошелёк', 'profile': 'Профиль',
        'notifications': 'Уведомления', 'security': 'Безопасность'
    };
    return names[section] || section;
}
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
function updateStatValue(index, change) {
    const cards = document.querySelectorAll('.stat-value');
    if (cards[index]) {
        let val = parseInt(cards[index].textContent.replace(/[^0-9]/g, '')) || 0;
        cards[index].textContent = (val + change).toLocaleString();
    }
}
function extendBikeRental() { showToast('⏱️ Аренда велосипеда продлена (+150 ₽)'); }
function endBikeRental() { showToast('✅ Аренда велосипеда завершена!'); document.querySelector('.bike-status').style.display = 'none'; }
function extendCarRental() { showToast('⏱️ Аренда авто продлена (+2,500 ₽)'); }
function endCarRental() { showToast('✅ Аренда авто завершена!'); document.querySelector('.car-status').style.display = 'none'; }
function unlockCar() { showToast('🔓 Автомобиль разблокирован!'); }

document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const burgerLabel = document.querySelector('.buttons__burger');
    const sidebar = document.querySelector('.sidebar');
    
    if (!burger || !sidebar) {
        console.warn('Burger или sidebar не найдены');
        return;
    }
    
    // Обработчик изменения чекбокса
    burger.addEventListener('change', function() {
        if (this.checked) {
            sidebar.classList.add('active');
            // Создаем overlay
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.onclick = function() {
                    burger.checked = false;
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                };
                document.body.appendChild(overlay);
            }
            overlay.classList.add('active');
        } else {
            sidebar.classList.remove('active');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.classList.remove('active');
        }
    });
    
    // Клик по самой кнопке бургера (для мобильных)
    if (burgerLabel) {
        burgerLabel.addEventListener('click', function(e) {
            // Для мобильных устройств - принудительно переключаем
            if (window.innerWidth <= 768) {
                e.preventDefault();
                burger.checked = !burger.checked;
                burger.dispatchEvent(new Event('change'));
            }
        });
    }
    
    // Закрытие меню при клике на пункт навигации
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                burger.checked = false;
                sidebar.classList.remove('active');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && burger.checked) {
            burger.checked = false;
            sidebar.classList.remove('active');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.classList.remove('active');
        }
    });
    
    console.log('✅ Бургер-меню инициализировано');
});

initTheme();
window.onload = initDashboard;

// Функция обновления времени
function updateTime() {
    const timeElement = document.getElementById('header-time');
    if (timeElement) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = hours + ':' + minutes;
    }
}

// Обновляем время каждую минуту
setInterval(updateTime, 60000);
updateTime(); // Обновляем сразу при загрузке

// Функция выхода из аккаунта
function logout() {
    showToast('👋 Выход выполнен успешно!');
    // Очищаем данные пользователя
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('theme');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Функция поиска транспорта
function searchTransport(query) {
    if (!query || query.trim() === '') return;
    
    query = query.toLowerCase().trim();
    
    // Данные транспорта для поиска
    const transportData = [
        { id: 'JET Pro #8743', type: 'scooter', name: 'Самокат', section: 'scooters', keywords: ['8743', 'pro', 'самокат', 'jet'] },
        { id: 'JET Lite #3921', type: 'scooter', name: 'Самокат', section: 'scooters', keywords: ['3921', 'lite', 'самокат', 'jet'] },
        { id: 'JET Pro #1124', type: 'scooter', name: 'Самокат', section: 'scooters', keywords: ['1124', 'pro', 'самокат', 'jet'] },
        { id: 'JET Bike #B-452', type: 'bike', name: 'Велосипед', section: 'bikes', keywords: ['b-452', '452', 'bike', 'велосипед', 'jet'] },
        { id: 'JET MTB #B-231', type: 'bike', name: 'Велосипед', section: 'bikes', keywords: ['b-231', '231', 'mtb', 'велосипед', 'jet'] },
        { id: 'Hyundai Solaris #C-456', type: 'car', name: 'Автомобиль', section: 'cars', keywords: ['c-456', '456', 'hyundai', 'солярис', 'авто', 'машина'] },
        { id: 'KIA Rio #C-789', type: 'car', name: 'Автомобиль', section: 'cars', keywords: ['c-789', '789', 'kia', 'рио', 'авто', 'машина'] }
    ];
    
    // Ищем совпадения
    const results = transportData.filter(item => {
        const searchText = query;
        return item.id.toLowerCase().includes(searchText) ||
               item.name.toLowerCase().includes(searchText) ||
               item.keywords.some(k => k.includes(searchText)) ||
               item.type.toLowerCase().includes(searchText);
    });
    
    if (results.length > 0) {
        const result = results[0];
        showToast(`🔍 Найден ${result.name}: ${result.id}`);
        
        // Переходим в соответствующую секцию
        setTimeout(() => {
            showSection(result.section);
        }, 500);
    } else {
        showToast('❌ Транспорт не найден. Попробуйте: самокат, велосипед, авто или номер ID');
    }
}

// Функция закрытия сайдбара для мобильного режима
function closeSidebar() {
    const burger = document.getElementById('burger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (burger) burger.checked = false;
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    
    showToast('📱 Меню закрыто');
}