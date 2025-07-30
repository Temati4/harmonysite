// Harmony Launcher - Основной JavaScript файл

// API Configuration
const API_URL = 'https://harmony-server-production.up.railway.app';
const AUTH_TOKEN_KEY = 'harmony_secure_jwt_token_2024_v1';
const AUTH_USERNAME_KEY = 'harmony_secure_refresh_2024_v1';

// DOM Elements
let header, themeToggle, downloadButtons, themePreviews, floatingShapes;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initThemeManager();
    initHeaderManager();
    initScrollAnimations();
    initSmoothScrolling();
    initDownloadButtons();
    initThemePreviews();
    initFloatingShapes();
    initStatsAnimation();
    initRippleEffect();
    initParallaxEffect();
    initPageLoadAnimation();
    initErrorHandling();
    initKeyboardNavigation();
    initHoverAnimations();
    initAPI();
});

// API Integration
function initAPI() {
    // Fetch user count from API
    fetchPlayerCount();
    
    // Update user count every 30 seconds
    setInterval(fetchPlayerCount, 30000);
}

async function fetchPlayerCount() {
    try {
        const response = await fetch(`${API_URL}/users.json`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Подсчитываем количество пользователей в массиве
            const userCount = Array.isArray(data) ? data.length : 
                            (data.users && Array.isArray(data.users) ? data.users.length : 0);
            updatePlayerCount(userCount);
        } else {
            console.warn('Failed to fetch users:', response.status);
            // Use fallback value
            updatePlayerCount(1250);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        // Use fallback value
        updatePlayerCount(1250);
    }
}

function updatePlayerCount(count) {
    const userStat = document.querySelector('[data-stat="users"] .stat-number');
    if (userStat) {
        const currentCount = parseInt(userStat.textContent.replace(/[^\d]/g, ''));
        if (currentCount !== count) {
            animateNumberChange(userStat, currentCount, count);
        }
    }
}

function animateNumberChange(element, from, to) {
    const duration = 1000;
    const step = (to - from) / (duration / 16);
    let current = from;
    
    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= to) || (step < 0 && current <= to)) {
            current = to;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + '+';
    }, 16);
}

// Управление темой
function initThemeManager() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const header = document.querySelector('.header');
    
    // Загрузка сохраненной темы
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Обработчик переключения темы
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Анимация переключения
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
        
        // Плавное обновление header
        if (header) {
            header.style.transition = 'all 0.3s ease';
        }
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Управление заголовком
function initHeaderManager() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
            window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
        // Добавление тени при скролле
        if (currentScrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Скрытие/показ заголовка при скролле
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInUp');
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами
    const animatedElements = document.querySelectorAll('.feature-card, .theme-preview, .download-method, .community-link');
    animatedElements.forEach(el => observer.observe(el));
}

    // Плавная прокрутка
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                        window.scrollTo({
                    top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }

// Кнопки скачивания
function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('a[href="#download"]');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
                    e.preventDefault();
            
            // Простая прокрутка к секции скачивания
            const targetSection = document.querySelector('#download');
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопки в секции download просто открывают GitHub без анимации
    const downloadSectionButtons = document.querySelectorAll('#download .btn-primary');
    
    downloadSectionButtons.forEach(button => {
        // Убираем все обработчики событий чтобы кнопки работали как обычные ссылки
        button.removeEventListener('click', function(){});
    });
}

// Превью тем
function initThemePreviews() {
    const themePreviews = document.querySelectorAll('.theme-preview');
    
    themePreviews.forEach(preview => {
        preview.addEventListener('click', function() {
            // Удаление активного состояния у всех превью
            themePreviews.forEach(p => p.classList.remove('active'));
            
            // Добавление активного состояния к выбранному
            this.classList.add('active');
            
            // Анимация масштабирования
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
                });
            });
        }

// Фоновые фигуры
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Случайная задержка анимации
        const delay = Math.random() * 20;
        shape.style.animationDelay = `${delay}s`;
        
        // Интерактивность при наведении
        shape.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.filter = 'blur(20px)';
        });
        
        shape.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.filter = 'blur(40px)';
        });
    });
}

// Stats Animation
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target') || stat.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 16);
    });
};

    // Trigger animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
}

// Эффект ripple для кнопок
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Ripple Effect
function initRippleEffect() {
    // Add ripple effect to buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            
            // Check if this is not a download button in the download section
            if (!btn.closest('#download') || !btn.classList.contains('btn-primary')) {
                createRippleEffect(e, btn);
            }
        }
    });
}

// Parallax Effect
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes, .particle-field');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Page Load Animation
function initPageLoadAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Error Handling
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
    });
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            document.querySelectorAll('.modal, .dropdown').forEach(el => {
                el.classList.remove('active');
            });
        }
    });
}

// Hover Animations
function initHoverAnimations() {
    // Feature icons hover effect
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Launcher preview hover effect
    const launcherPreview = document.querySelector('.launcher-preview');
    if (launcherPreview) {
        launcherPreview.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(-2deg) rotateX(2deg) scale(1.02)';
        });
        
        launcherPreview.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
    }
} 