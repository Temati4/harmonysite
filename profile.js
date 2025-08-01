// ===== КОНСТАНТЫ =====
const API_URL = 'https://harmony-server-production.up.railway.app';
const AUTH_TOKEN_KEY = 'harmony_secure_jwt_token_2024_v1';
const AUTH_USERNAME_KEY = 'harmony_secure_refresh_2024_v1';

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentUser = null;
let currentToken = null;
let refreshToken = null;
let ws = null;
let selectedFriend = null;
let friends = [];
let typingTimeout = null;
let chatSettings = {
    soundNotifications: true,
    messagePreview: true,
    typingIndicator: true,
    readReceipts: true
};

// Эмодзи для мессенджера
const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀',
    '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽',
    '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💌', '💘', '💝', '💖',
    '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛',
    '💚', '💙', '💜', '🖤', '💯', '💢', '💥', '💫', '💦', '💨',
    '🕳️', '💬', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋',
    '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈',
    '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
    '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾',
    '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷',
    '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🦵', '🦶', '👂',
    '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅'
];

// ===== ЭЛЕМЕНТЫ DOM =====
const elements = {
    // Auth
    authSection: document.getElementById('authSection'),
    profileSection: document.getElementById('profileSection'),
    authTabs: document.querySelectorAll('.auth-tab'),
    authForms: document.querySelectorAll('.auth-form'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    
    // Profile
    profileUsername: document.getElementById('profileUsername'),
    profileStatus: document.getElementById('profileStatus'),
    profileDate: document.getElementById('profileDate'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Friends
    friendsList: document.getElementById('friendsList'),
    addFriendBtn: document.getElementById('addFriendBtn'),
    addFriendModal: document.getElementById('addFriendModal'),
    friendUsername: document.getElementById('friendUsername'),
    confirmAddFriend: document.getElementById('confirmAddFriend'),
    cancelAddFriend: document.getElementById('cancelAddFriend'),
    closeAddFriendModal: document.getElementById('closeAddFriendModal'),
    
    // Chat
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendMessageBtn: document.getElementById('sendMessageBtn'),
    chatStatus: document.getElementById('chatStatus'),
    chatTitle: document.getElementById('chatTitle'),
    clearChatBtn: document.getElementById('clearChatBtn'),
    chatSettingsBtn: document.getElementById('chatSettingsBtn'),
    emojiBtn: document.getElementById('emojiBtn'),
    attachBtn: document.getElementById('attachBtn'),
    
    // Modals
    emojiModal: document.getElementById('emojiModal'),
    emojiGrid: document.getElementById('emojiGrid'),
    closeEmojiModal: document.getElementById('closeEmojiModal'),
    chatSettingsModal: document.getElementById('chatSettingsModal'),
    closeChatSettingsModal: document.getElementById('closeChatSettingsModal'),
    cancelChatSettings: document.getElementById('cancelChatSettings'),
    saveChatSettings: document.getElementById('saveChatSettings'),
    
    // Theme
    themeToggle: document.getElementById('themeToggle'),
    
    // Notifications
    notificationContainer: document.getElementById('notificationContainer')
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initThemeManager();
    initAuthTabs();
    initForms();
    initModals();
    initChatInput();
    initEmojiGrid();
    loadChatSettings();
    checkAuthStatus();
});

// ===== УПРАВЛЕНИЕ ТЕМОЙ =====
function initThemeManager() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    elements.themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = elements.themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== УПРАВЛЕНИЕ АВТОРИЗАЦИЕЙ =====
function initAuthTabs() {
    elements.authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Обновляем активные табы
            elements.authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Обновляем активные формы
            elements.authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${targetTab}Form`).classList.add('active');
        });
    });
}

function initForms() {
    // Login form
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
    
    // Register form
    elements.registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister();
    });
    
    // Logout
    elements.logoutBtn.addEventListener('click', handleLogout);
}

async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Сохраняем токены
            localStorage.setItem(AUTH_TOKEN_KEY, data.token);
            localStorage.setItem(AUTH_USERNAME_KEY, data.refreshToken);
            
            currentToken = data.token;
            refreshToken = data.refreshToken;
            currentUser = data.user;
            
            showNotification('Успешный вход!', 'success');
            showProfile();
        } else {
            showNotification(data.error || 'Ошибка входа', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Ошибка соединения', 'error');
    }
}

async function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    
    if (password !== passwordConfirm) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Регистрация успешна! Теперь войдите в аккаунт.', 'success');
            // Переключаемся на форму входа
            document.querySelector('[data-tab="login"]').click();
        } else {
            showNotification(data.error || 'Ошибка регистрации', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Ошибка соединения', 'error');
    }
}

async function handleLogout() {
    try {
        if (currentToken) {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Очищаем данные
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USERNAME_KEY);
    currentToken = null;
    refreshToken = null;
    currentUser = null;
    
    // Закрываем WebSocket
    if (ws) {
        ws.close();
        ws = null;
    }
    
    showNotification('Вы вышли из аккаунта', 'success');
    showAuth();
}

function checkAuthStatus() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const refresh = localStorage.getItem(AUTH_USERNAME_KEY);
    
    if (token && refresh) {
        currentToken = token;
        refreshToken = refresh;
        loadUserProfile();
    } else {
        showAuth();
    }
}

async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            updateProfileDisplay();
            showProfile();
            loadFriends();
            connectWebSocket();
        } else {
            // Токен истёк, пробуем обновить
            if (await refreshAuthToken()) {
                loadUserProfile();
            } else {
                handleLogout();
            }
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showNotification('Ошибка загрузки профиля', 'error');
        showAuth();
    }
}

async function refreshAuthToken() {
    try {
        const response = await fetch(`${API_URL}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(AUTH_TOKEN_KEY, data.token);
            localStorage.setItem(AUTH_USERNAME_KEY, data.refreshToken);
            currentToken = data.token;
            refreshToken = data.refreshToken;
            return true;
        }
    } catch (error) {
        console.error('Refresh token error:', error);
    }
    
    return false;
}

function updateProfileDisplay() {
    if (currentUser) {
        elements.profileUsername.textContent = currentUser.username;
        elements.profileDate.textContent = `Зарегистрирован: ${new Date(currentUser.createdAt).toLocaleDateString()}`;
    }
}

function showAuth() {
    elements.authSection.classList.remove('hidden');
    elements.profileSection.classList.add('hidden');
}

function showProfile() {
    elements.authSection.classList.add('hidden');
    elements.profileSection.classList.remove('hidden');
}

// ===== УПРАВЛЕНИЕ ДРУЗЬЯМИ =====
async function loadFriends() {
    try {
        const response = await fetch(`${API_URL}/friends`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        
        if (response.ok) {
            friends = await response.json();
            renderFriendsList();
        } else {
            showNotification('Ошибка загрузки друзей', 'error');
        }
    } catch (error) {
        console.error('Load friends error:', error);
        showNotification('Ошибка загрузки друзей', 'error');
    }
}

function renderFriendsList() {
    if (friends.length === 0) {
        elements.friendsList.innerHTML = '<div class="no-friends">У вас пока нет друзей</div>';
        return;
    }
    
    elements.friendsList.innerHTML = friends.map(friend => `
        <div class="friend-item" data-friend-id="${friend.friendId}">
            <div class="friend-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="friend-info">
                <div class="friend-name">${friend.username}</div>
                <div class="friend-status">${friend.status === 'accepted' ? 'Друг' : 'Запрос отправлен'}</div>
            </div>
            ${friend.status === 'accepted' ? `
                <div class="friend-actions">
                    <button class="btn btn-sm btn-primary chat-btn" onclick="selectFriend('${friend.friendId}', '${friend.username}')">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="removeFriend('${friend.friendId}')">
                        <i class="fas fa-user-minus"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function addFriend(username) {
    try {
        const response = await fetch(`${API_URL}/friends/request`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Запрос в друзья отправлен', 'success');
            closeModal(elements.addFriendModal);
            loadFriends();
        } else {
            showNotification(data.error || 'Ошибка отправки запроса', 'error');
        }
    } catch (error) {
        console.error('Add friend error:', error);
        showNotification('Ошибка отправки запроса', 'error');
    }
}

async function removeFriend(friendId) {
    if (!confirm('Удалить этого друга?')) return;
    
    try {
        const response = await fetch(`${API_URL}/friends/${friendId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Друг удален', 'success');
            if (selectedFriend === friendId) {
                clearChat();
            }
            loadFriends();
        } else {
            showNotification('Ошибка удаления друга', 'error');
        }
    } catch (error) {
        console.error('Remove friend error:', error);
        showNotification('Ошибка удаления друга', 'error');
    }
}

// ===== УПРАВЛЕНИЕ ЧАТОМ =====
function selectFriend(friendId, friendName) {
    selectedFriend = friendId;
    
    // Обновляем активный друг в списке
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-friend-id="${friendId}"]`).classList.add('active');
    
    // Обновляем заголовок чата
    elements.chatTitle.textContent = `Чат с ${friendName}`;
    
    // Активируем все элементы чата
    elements.chatInput.disabled = false;
    elements.sendMessageBtn.disabled = false;
    elements.clearChatBtn.disabled = false;
    elements.chatSettingsBtn.disabled = false;
    elements.emojiBtn.disabled = false;
    elements.attachBtn.disabled = false;
    
    // Загружаем историю сообщений
    loadChatHistory(friendId);
}

function clearChat() {
    selectedFriend = null;
    elements.chatMessages.innerHTML = '<div class="no-chat"><i class="fas fa-comments"></i><p>Выберите друга для начала чата</p></div>';
    elements.chatInput.disabled = true;
    elements.sendMessageBtn.disabled = true;
    elements.clearChatBtn.disabled = true;
    elements.chatSettingsBtn.disabled = true;
    elements.emojiBtn.disabled = true;
    elements.attachBtn.disabled = true;
    elements.chatTitle.textContent = 'Чат';
    
    // Убираем активный класс
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
    });
}

async function loadChatHistory(friendId) {
    try {
        const response = await fetch(`${API_URL}/messages/${friendId}`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });
        
        if (response.ok) {
            const messages = await response.json();
            renderMessages(messages);
        } else {
            showNotification('Ошибка загрузки сообщений', 'error');
        }
    } catch (error) {
        console.error('Load messages error:', error);
        showNotification('Ошибка загрузки сообщений', 'error');
    }
}

function renderMessages(messages) {
    if (messages.length === 0) {
        elements.chatMessages.innerHTML = '<div class="no-chat"><i class="fas fa-comments"></i><p>Начните разговор первым!</p></div>';
        return;
    }
    
    elements.chatMessages.innerHTML = messages.map(message => {
        const isSent = message.fromId === currentUser.id;
        const time = new Date(message.timestamp).toLocaleTimeString();
        const status = message.status || 'sent';
        
        return `
            <div class="message ${isSent ? 'sent' : 'received'}">
                <div class="message-content">${message.content}</div>
                <div class="message-time">${time}</div>
                ${isSent && chatSettings.readReceipts ? `
                    <div class="message-status ${status}">
                        <i class="fas fa-${status === 'read' ? 'check-double' : 'check'}"></i>
                        <span>${status === 'read' ? 'Прочитано' : status === 'delivered' ? 'Доставлено' : 'Отправлено'}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    // Прокручиваем к последнему сообщению
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function initChatInput() {
    elements.sendMessageBtn.addEventListener('click', sendMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Очистка чата
    elements.clearChatBtn.addEventListener('click', clearChatHistory);
    
    // Вложение файлов
    elements.attachBtn.addEventListener('click', () => {
        showNotification('Функция вложения файлов будет добавлена в следующем обновлении', 'info');
    });
    
    // Индикатор набора текста
    elements.chatInput.addEventListener('input', handleTyping);
}

function initEmojiGrid() {
    elements.emojiGrid.innerHTML = emojis.map(emoji => 
        `<div class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</div>`
    ).join('');
}

function insertEmoji(emoji) {
    const input = elements.chatInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    input.value = text.substring(0, start) + emoji + text.substring(end);
    input.selectionStart = input.selectionEnd = start + emoji.length;
    input.focus();
    
    closeModal(elements.emojiModal);
}

function handleTyping() {
    if (!selectedFriend || !chatSettings.typingIndicator) return;
    
    // Отправляем индикатор набора текста
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'typing',
            to: selectedFriend,
            isTyping: true
        }));
    }
    
    // Очищаем предыдущий таймаут
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Устанавливаем новый таймаут
    typingTimeout = setTimeout(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'typing',
                to: selectedFriend,
                isTyping: false
            }));
        }
    }, 1000);
}

function loadChatSettings() {
    const saved = localStorage.getItem('chatSettings');
    if (saved) {
        chatSettings = { ...chatSettings, ...JSON.parse(saved) };
    }
    
    // Применяем настройки к чекбоксам
    document.getElementById('soundNotifications').checked = chatSettings.soundNotifications;
    document.getElementById('messagePreview').checked = chatSettings.messagePreview;
    document.getElementById('typingIndicator').checked = chatSettings.typingIndicator;
    document.getElementById('readReceipts').checked = chatSettings.readReceipts;
}

function saveChatSettings() {
    chatSettings = {
        soundNotifications: document.getElementById('soundNotifications').checked,
        messagePreview: document.getElementById('messagePreview').checked,
        typingIndicator: document.getElementById('typingIndicator').checked,
        readReceipts: document.getElementById('readReceipts').checked
    };
    
    localStorage.setItem('chatSettings', JSON.stringify(chatSettings));
    showNotification('Настройки чата сохранены', 'success');
}

function clearChatHistory() {
    if (!selectedFriend) return;
    
    if (confirm('Вы уверены, что хотите очистить историю чата?')) {
        elements.chatMessages.innerHTML = '<div class="no-chat"><i class="fas fa-comments"></i><p>История чата очищена</p></div>';
        showNotification('История чата очищена', 'success');
    }
}

function sendMessage() {
    const content = elements.chatInput.value.trim();
    if (!content || !selectedFriend) return;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'message',
            to: selectedFriend,
            content: content
        }));
        
        elements.chatInput.value = '';
    } else {
        showNotification('Соединение потеряно', 'error');
    }
}

// ===== WEB SOCKET =====
function connectWebSocket() {
    if (!currentToken) return;
    
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    ws = new WebSocket(`${wsUrl}?token=${currentToken}`);
    
    ws.onopen = function() {
        console.log('WebSocket connected');
        updateChatStatus(true);
    };
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
            // Новое сообщение
            const message = data.message;
            if (selectedFriend && (message.fromId === selectedFriend || message.toId === selectedFriend)) {
                // Добавляем сообщение в чат
                const messages = Array.from(elements.chatMessages.children).map(el => {
                    if (el.classList.contains('message')) {
                        return {
                            fromId: el.classList.contains('sent') ? currentUser.id : selectedFriend,
                            content: el.querySelector('.message-content').textContent,
                            timestamp: new Date().toISOString(),
                            status: 'sent'
                        };
                    }
                }).filter(Boolean);
                
                messages.push(message);
                renderMessages(messages);
                
                // Звуковое уведомление
                if (chatSettings.soundNotifications) {
                    playNotificationSound();
                }
            }
        } else if (data.type === 'messageConfirmation') {
            // Подтверждение отправки сообщения
            console.log('Message sent:', data.messageId);
        } else if (data.type === 'typing') {
            // Индикатор набора текста
            handleTypingIndicator(data);
        } else if (data.type === 'messageStatus') {
            // Обновление статуса сообщения
            updateMessageStatus(data);
        }
    };
    
    ws.onclose = function() {
        console.log('WebSocket disconnected');
        updateChatStatus(false);
        
        // Пытаемся переподключиться через 5 секунд
        setTimeout(() => {
            if (currentToken) {
                connectWebSocket();
            }
        }, 5000);
    };
    
    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
        updateChatStatus(false);
    };
}

function updateChatStatus(connected) {
    const statusDot = elements.chatStatus.querySelector('.status-dot');
    const statusText = elements.chatStatus.querySelector('span:last-child');
    
    if (connected) {
        statusDot.className = 'status-dot online';
        statusText.textContent = 'Подключен';
    } else {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Отключен';
    }
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initModals() {
    // Add friend modal
    elements.addFriendBtn.addEventListener('click', () => {
        showModal(elements.addFriendModal);
    });
    
    elements.closeAddFriendModal.addEventListener('click', () => {
        closeModal(elements.addFriendModal);
    });
    
    elements.cancelAddFriend.addEventListener('click', () => {
        closeModal(elements.addFriendModal);
    });
    
    elements.confirmAddFriend.addEventListener('click', () => {
        const username = elements.friendUsername.value.trim();
        if (username) {
            addFriend(username);
            elements.friendUsername.value = '';
        }
    });
    
    // Emoji modal
    elements.emojiBtn.addEventListener('click', () => {
        showModal(elements.emojiModal);
    });
    
    elements.closeEmojiModal.addEventListener('click', () => {
        closeModal(elements.emojiModal);
    });
    
    // Chat settings modal
    elements.chatSettingsBtn.addEventListener('click', () => {
        showModal(elements.chatSettingsModal);
    });
    
    elements.closeChatSettingsModal.addEventListener('click', () => {
        closeModal(elements.chatSettingsModal);
    });
    
    elements.cancelChatSettings.addEventListener('click', () => {
        closeModal(elements.chatSettingsModal);
    });
    
    elements.saveChatSettings.addEventListener('click', () => {
        saveChatSettings();
        closeModal(elements.chatSettingsModal);
    });
    
    // Закрытие по клику вне модального окна
    elements.addFriendModal.addEventListener('click', (e) => {
        if (e.target === elements.addFriendModal) {
            closeModal(elements.addFriendModal);
        }
    });
    
    elements.emojiModal.addEventListener('click', (e) => {
        if (e.target === elements.emojiModal) {
            closeModal(elements.emojiModal);
        }
    });
    
    elements.chatSettingsModal.addEventListener('click', (e) => {
        if (e.target === elements.chatSettingsModal) {
            closeModal(elements.chatSettingsModal);
        }
    });
}

function showModal(modal) {
    modal.classList.add('show');
}

function closeModal(modal) {
    modal.classList.remove('show');
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    elements.notificationContainer.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Скрываем через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function playNotificationSound() {
    // Создаем простой звук уведомления
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function handleTypingIndicator(data) {
    if (!chatSettings.typingIndicator) return;
    
    const typingIndicator = elements.chatMessages.querySelector('.typing-indicator');
    
    if (data.isTyping) {
        if (!typingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = `
                <span>${data.fromName || 'Кто-то'} печатает</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            `;
            elements.chatMessages.appendChild(indicator);
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        }
    } else {
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

function updateMessageStatus(data) {
    const messageElement = elements.chatMessages.querySelector(`[data-message-id="${data.messageId}"]`);
    if (messageElement) {
        const statusElement = messageElement.querySelector('.message-status');
        if (statusElement) {
            statusElement.className = `message-status ${data.status}`;
            statusElement.innerHTML = `
                <i class="fas fa-${data.status === 'read' ? 'check-double' : 'check'}"></i>
                <span>${data.status === 'read' ? 'Прочитано' : data.status === 'delivered' ? 'Доставлено' : 'Отправлено'}</span>
            `;
        }
    }
} 