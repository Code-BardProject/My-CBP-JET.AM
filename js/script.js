let currentUser = null, orders = [], balance = 1340, savedMoney = 8420, tripsCount = 124, totalKm = 1842, selectedScooter = null, mapInstance = null;
const notifications = [
    { id: 1, title: "Самокат JET Pro рядом!", text: "В 120 м от вас свободен JET Pro #8743", time: "2 мин назад", icon: "🛴" },
    { id: 2, title: "Поездка завершена", text: "Вы заработали +50 ₽ кэшбэка", time: "вчера", icon: "✅" },
    { id: 3, title: "Новая скидка", text: "FIRST15 — первые 15 минут бесплатно!", time: "3 ч назад", icon: "🎟️" }
];
const scootersData = [
    { id: 1, name: "JET Pro #8743", lat: 40.165, lng: 44.295, price: 89, rate: 8.9, speed: "45 км/ч", status: "free", type: "scooter" },
    { id: 2, name: "JET Lite #3921", lat: 40.162, lng: 44.292, price: 49, rate: 4.9, speed: "25 км/ч", status: "free", type: "scooter" },
    { id: 3, name: "JET Pro #1124", lat: 40.170, lng: 44.300, price: 89, rate: 8.9, speed: "45 км/ч", status: "free", type: "scooter" },
    { id: 4, name: "JET Lite #6655", lat: 40.158, lng: 44.288, price: 49, rate: 4.9, speed: "25 км/ч", status: "free", type: "scooter" }
];
const bikesData = [
    { id: 101, name: "JET Bike #B-452", lat: 40.168, lng: 44.298, price: 150, rate: 25, speed: "25 км/ч", status: "free", type: "bike" },
    { id: 102, name: "JET Bike #B-789", lat: 40.160, lng: 44.290, price: 150, rate: 25, speed: "25 км/ч", status: "free", type: "bike" },
    { id: 103, name: "JET MTB #B-231", lat: 40.172, lng: 44.305, price: 200, rate: 35, speed: "30 км/ч", status: "free", type: "bike" }
];
const carsData = [
    { id: 201, name: "KIA Rio #C-789", lat: 40.155, lng: 44.285, price: 2500, rate: 150, speed: "180 км/ч", status: "free", type: "car", fuel: "75%" },
    { id: 202, name: "Hyundai Solaris #C-456", lat: 40.175, lng: 44.310, price: 2800, rate: 170, speed: "190 км/ч", status: "free", type: "car", fuel: "60%" },
    { id: 203, name: "Toyota Camry #C-123", lat: 40.148, lng: 44.280, price: 3500, rate: 220, speed: "210 км/ч", status: "free", type: "car", fuel: "90%" }
];
const discountsData = [
    { id: 1, title: "Первые 15 минут — бесплатно", desc: "Для новых пользователей", code: "FIRST15", discount: "100%" },
    { id: 2, title: "Скидка 40% по промо", desc: "SPRINGJET", code: "SPRINGJET", discount: "40%" },
    { id: 3, title: "Приведи друга", desc: "300 ₽ на счёт", code: "FRIEND300", discount: "300 ₽" },
    { id: 4, title: "Эко-скидка", desc: "-20% за поездки", code: "ECO20", discount: "20%" }
];
function init() { initMap(); renderOrders(); renderDiscounts(); console.log('%c🚀 JET My-CBP JETv3.0 — Pure CSS/JS', 'color:#00f0ff; font-size:18px'); }
function initMap() { 
    const container = document.getElementById('map'); 
    if (!container) return; 
    mapInstance = L.map('map', { center: [40.165, 44.295], zoom: 14 }); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance); 
    
    // Самокаты
    scootersData.forEach(scooter => { 
        const marker = L.marker([scooter.lat, scooter.lng], { 
            icon: L.divIcon({ 
                html: `<div style="width:44px;height:44px;background:linear-gradient(135deg,#00f0ff,#2563eb);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 20px rgba(0,240,255,0.4);border:2px solid white;">🛴</div>`, 
                iconSize: [44, 44] 
            }) 
        }).addTo(mapInstance); 
        marker.bindPopup(`<b style="color:#00f0ff;">${scooter.name}</b><br>🛴 Электросамокат<br>${scooter.speed}<br><span style="color:#10b981;font-weight:600;">${scooter.price} ₽ / 10 мин</span><br><button onclick="quickBook(${scooter.id}, 'scooter')" style="margin-top:8px;padding:10px 16px;background:linear-gradient(135deg,#00f0ff,#2563eb);border:none;border-radius:8px;color:#0a0a0a;font-weight:600;cursor:pointer;width:100%;">Забронировать</button>`); 
    }); 
    
    // Велосипеды
    bikesData.forEach(bike => { 
        const marker = L.marker([bike.lat, bike.lng], { 
            icon: L.divIcon({ 
                html: `<div style="width:44px;height:44px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 20px rgba(139,92,246,0.4);border:2px solid white;">🚲</div>`, 
                iconSize: [44, 44] 
            }) 
        }).addTo(mapInstance); 
        marker.bindPopup(`<b style="color:#8b5cf6;">${bike.name}</b><br>🚲 Велосипед<br>${bike.speed}<br><span style="color:#10b981;font-weight:600;">${bike.price} ₽ / час</span><br><button onclick="quickBook(${bike.id}, 'bike')" style="margin-top:8px;padding:10px 16px;background:linear-gradient(135deg,#8b5cf6,#ec4899);border:none;border-radius:8px;color:white;font-weight:600;cursor:pointer;width:100%;">Забронировать</button>`); 
    }); 
    
    // Автомобили
    carsData.forEach(car => { 
        const marker = L.marker([car.lat, car.lng], { 
            icon: L.divIcon({ 
                html: `<div style="width:48px;height:48px;background:linear-gradient(135deg,#f59e0b,#fbbf24);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 4px 20px rgba(245,158,11,0.4);border:2px solid white;">🚗</div>`, 
                iconSize: [48, 48] 
            }) 
        }).addTo(mapInstance); 
        marker.bindPopup(`<b style="color:#f59e0b;">${car.name}</b><br>🚗 Автомобиль<br>⚡ ${car.speed} | ⛽ ${car.fuel}<br><span style="color:#10b981;font-weight:600;">${car.price} ₽ / день</span><br><button onclick="quickBook(${car.id}, 'car')" style="margin-top:8px;padding:10px 16px;background:linear-gradient(135deg,#f59e0b,#fbbf24);border:none;border-radius:8px;color:#0a0a0a;font-weight:600;cursor:pointer;width:100%;">Забронировать</button>`); 
    }); 
}
function quickBook(id, type) { 
    let vehicle; 
    if (type === 'scooter') vehicle = scootersData.find(s => s.id === id); 
    else if (type === 'bike') vehicle = bikesData.find(b => b.id === id); 
    else if (type === 'car') vehicle = carsData.find(c => c.id === id); 
    if (vehicle) startBooking(vehicle, type); 
}
function navigateTo(sectionId) { const target = document.getElementById(sectionId); if (target) target.scrollIntoView({ behavior: 'smooth' }); }
function setActiveNav(element) { document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active')); element.classList.add('active'); }
function hideModal(modalId) { document.getElementById(modalId).classList.remove('active'); }
function closeModalOnOverlay(event, modalId) { if (event.target.id === modalId) hideModal(modalId); }
function switchModal(type) { 
    if (type === 'login') {
        location.href = 'uderdashbord.html';
    }
}
function performLogin() { 
    const email = document.getElementById('login-email').value; 
    const name = email.split('@')[0]; 
    currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1) + ' К.', email: email, avatar: "👤" }; 
    hideModal('login-modal'); 
    showToast('✅ Вы вошли в аккаунт'); 
    setTimeout(() => { 
        addNotification({ title: "Добро пожаловать!", text: "Ваш баланс обновлён", time: "только что", icon: "👋" }); 
        // Перенаправляем в личный кабинет
        window.location.href = 'uderdashbord.html'; 
    }, 1500); 
}
function performRegister() { 
    const name = document.getElementById('reg-name').value; 
    const email = document.getElementById('reg-email').value; 
    if (!name || !email) { showToast('❌ Заполните все поля'); return; } 
    currentUser = { name: name, email: email, avatar: "👤" }; 
    hideModal('register-modal'); 
    showToast('✅ Аккаунт создан!'); 
    setTimeout(() => { 
        // Перенаправляем в личный кабинет после регистрации
        window.location.href = 'uderdashbord.html'; 
    }, 1500); 
}
function renderOrders() { const container = document.getElementById('orders-list'); if (!currentUser) { container.innerHTML = `<div class="empty-orders"><i class="fa-solid fa-receipt"></i><h3>Войдите, чтобы видеть заказы</h3><p>Авторизуйтесь для доступа к истории поездок</p></div>`; return; } if (orders.length === 0) { container.innerHTML = `<div class="empty-orders"><i class="fa-solid fa-receipt"></i><h3>У вас пока нет заказов</h3><p>Арендуйте самокат, чтобы увидеть его здесь</p></div>`; return; } container.innerHTML = orders.map((order, index) => `<div class="order-card"><div class="order-icon">🛴</div><div class="order-info"><h3>${order.scooter}</h3><p>${order.date} • ${order.time}</p></div><div class="order-status ${order.status}">${order.status === 'active' ? 'Активен' : 'Завершён'}</div><div class="order-price">${order.price} ₽</div>${order.status === 'active' ? `<div class="order-actions"><button class="btn-small btn-complete" onclick="completeOrder(${index})"><i class="fa-solid fa-check"></i> Завершить</button><button class="btn-small btn-cancel" onclick="cancelOrder(${index})"><i class="fa-solid fa-times"></i> Отменить</button></div>` : ''}</div>`).join(''); }
function completeOrder(index) { if (orders[index]) { orders[index].status = 'completed'; savedMoney += 50; renderOrders(); showToast('✅ Поездка завершена! +50 ₽ кэшбэка'); addNotification({ title: "Поездка завершена", text: "Вы заработали кэшбэк!", time: "только что", icon: "🏁" }); } }
function cancelOrder(index) { orders.splice(index, 1); renderOrders(); showToast('❌ Заказ отменён'); }
function renderDiscounts() { const container = document.getElementById('discounts-grid'); container.innerHTML = discountsData.map(discount => `<div class="discount-card"><div class="discount-badge">${discount.discount}</div><h3>${discount.title}</h3><p>${discount.desc}</p><div class="discount-code"><span>${discount.code}</span><button class="btn-copy" onclick="copyCode('${discount.code}')"><i class="fa-solid fa-copy"></i></button></div><button class="btn-apply" onclick="applyDiscount('${discount.code}')">Применить</button></div>`).join(''); }
function copyCode(code) { navigator.clipboard.writeText(code).then(() => showToast(`📋 Код ${code} скопирован`)); }
function applyDiscount(code) { showToast(`🎟️ Промокод ${code} применён!`); }
function startBooking(preselected = null) { if (preselected) selectedScooter = preselected; document.getElementById('booking-modal').classList.add('active'); document.getElementById('payment-step').style.display = 'none'; document.getElementById('continue-btn').style.display = 'block'; document.getElementById('scooters-list').style.display = 'block'; renderScootersList(); }
function renderScootersList() { const container = document.getElementById('scooters-list'); container.innerHTML = scootersData.map(scooter => `<div class="scooter-item ${selectedScooter?.id === scooter.id ? 'selected' : ''}" onclick="selectScooter(${scooter.id})"><div class="scooter-item-info"><div class="scooter-item-icon">🛴</div><div class="scooter-item-details"><h4>${scooter.name}</h4><p>${scooter.speed} • ${scooter.price} ₽/10мин</p></div></div><div class="scooter-item-price">${scooter.price} ₽</div></div>`).join(''); }
function selectScooter(id) { selectedScooter = scootersData.find(s => s.id === id); renderScootersList(); }
function showPaymentStep() { if (!selectedScooter) { showToast('❌ Выберите самокат'); return; } document.getElementById('scooters-list').style.display = 'none'; document.getElementById('payment-step').style.display = 'block'; document.getElementById('continue-btn').style.display = 'none'; document.getElementById('pay-rate').textContent = selectedScooter.rate + ' ₽'; document.getElementById('pay-total').textContent = selectedScooter.price + ' ₽'; document.getElementById('pay-btn-amount').textContent = selectedScooter.price + ' ₽'; }
function processPayment() { if (!selectedScooter) return; hideModal('booking-modal'); const newOrder = { id: "JET-" + Math.floor(100000 + Math.random() * 900000), scooter: selectedScooter.name, status: "active", time: "Сейчас", price: selectedScooter.price, date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }; orders.unshift(newOrder); balance -= selectedScooter.price; tripsCount++; totalKm += Math.floor(Math.random() * 8) + 3; renderOrders(); updateAccountStats(); showToast(`✅ Оплата прошла! ${selectedScooter.name} разблокирован`); setTimeout(() => addNotification({ title: "Самокат разблокирован!", text: `${selectedScooter.name} готов к поездке`, time: "только что", icon: "🔓" }), 1200); selectedScooter = null; }
function showNotifications() { const modal = document.getElementById('notifications-modal'), list = document.getElementById('notifications-list'); list.innerHTML = notifications.map(n => `<div class="notification-item-card"><div class="notification-icon">${n.icon}</div><div class="notification-content"><h4>${n.title}</h4><p>${n.text}</p><div class="notification-time">${n.time}</div></div></div>`).join(''); modal.classList.add('active'); document.getElementById('notification-badge').style.display = 'none'; }
function addNotification(notification) { notifications.unshift(notification); const badge = document.getElementById('notification-badge'); badge.textContent = notifications.length; badge.style.display = 'flex'; showToast(`🔔 ${notification.title}`); }
function showToast(message) { const toast = document.getElementById('toast'); document.getElementById('toast-message').textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
function toggleLocation() { const cities = ['Вагаршапат', 'Ереван', 'Гюмри', 'Ванадзор']; const current = document.getElementById('current-city').textContent; const next = cities[(cities.indexOf(current) + 1) % cities.length]; document.getElementById('current-city').textContent = next; showToast(`📍 Город изменён: ${next}`); }
window.onload = init;
