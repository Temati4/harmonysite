// Harmony Launcher - Основной JavaScript файл

// DOM элементы
const elements = {
    // Убираем все элементы статистики
};

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    init();
    
    // Анимация статистики
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        statsObserver.observe(heroSection);
    }
    
    // Эффект ripple для кнопок
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
            const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
            
            // Проверяем, что это не кнопка скачивания в секции download
            if (!btn.closest('#download') || !btn.classList.contains('btn-primary')) {
                createRippleEffect(e, btn);
            }
        }
    });
    
    // Параллакс эффект для фоновых фигур
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }, 10);
    });
    
    // Анимация загрузки страницы
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Обработка ошибок
    window.addEventListener('error', function(e) {
        console.error('Произошла ошибка:', e.error);
    });
    
    // Поддержка клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Закрытие модальных окон или других элементов
        }
    });
    
    // Анимация иконок возможностей
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
                });
            });

    // Анимация превью лаунчера
    const launcherPreview = document.querySelector('.launcher-preview');
    if (launcherPreview) {
        launcherPreview.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02)';
        });
        
        launcherPreview.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg)';
        });
    }
    
    // Анимация серверов в превью
    const serverItems = document.querySelectorAll('.server-item');
    serverItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('slideInRight');
    });
});

// Инициализация всех компонентов
function init() {
    initThemeManager();
    initHeaderManager();
    initScrollAnimations();
    initSmoothScrolling();
    initDownloadButtons();
    initThemePreviews();
    initFloatingShapes();
    initRippleEffects();
    initParallaxEffect();
    initPageLoadAnimation();
    initErrorHandling();
    initKeyboardNavigation();
    initHoverAnimations();
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

// Анимация статистики
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = stat.textContent;
        const isNumber = !isNaN(parseInt(target));
        
        if (isNumber) {
            const finalValue = parseInt(target);
            let currentValue = 0;
            const increment = finalValue / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(currentValue) + (target.includes('K') ? 'K+' : '');
            }, 30);
        }
    });
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