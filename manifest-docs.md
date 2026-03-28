# My-CBP JET — PWA Manifest Комментарии

## Основная информация о приложении

- **name**: Полное название приложения при установке — "My-CBP JET — Прокат электросамокатов"
- **short_name**: Короткое название для иконки на рабочем столе — "My-CBP JET"
- **description**: Описание при установке — объясняет, что это сервис аренды электросамокатов в Вагаршапате
- **start_url**: Стартовая страница при открытии приложения — "/" (главная страница)
- **display**: Режим отображения — "standalone" (как нативное приложение без адресной строки)
- **background_color**: Фон заставки при загрузке — "#0a0a0a" (тёмный цвет)
- **theme_color**: Цвет статус-бара и заголовка — "#00f0ff" (циан/бирюзовый)
- **orientation**: Ориентация экрана — "portrait" (портретная)
- **scope**: Область действия PWA — "/" (весь сайт)
- **lang**: Язык приложения — "ru" (русский)
- **dir**: Направление текста — "ltr" (слева направо)
- **categories**: Категории в магазинах — ["travel", "navigation", "transportation"] (путешествия, навигация, транспорт)

## Иконки приложения (icons)

Каждая иконка использует 🛴 (электросамокат) в SVG формате:
- **72×72**: Маленькие экраны, Android автоматический выбор
- **96×96**: Средние экраны, используется в лаунчерах
- **128×128**: Chrome Web Store, Firefox Marketplace
- **144×144**: Windows tiles, Microsoft Store
- **152×152**: iPad, iOS устройства
- **192×192**: Android, Chrome PWA иконка
- **384×384**: Ретина дисплеи, 2x масштаб
- **512×512**: Splash screen, высокое разрешение
- **type**: "image/svg+xml" — SVG формат для чёткости на любых экранах
- **purpose**: "maskable any" — адаптируется под разные формы иконок (круглые, квадратные)

## Скриншоты для Google Play / App Store (screenshots)

- **narrow**: Вертикальный скриншот 750×1334 для мобильных (iPhone, Android)
- **wide**: Горизонтальный скриншот 1920×1080 для планшетов и десктопов
- **form_factor**: narrow/wide — определяет где показывать скриншот

## Связанные приложения (related_applications)

Ссылки на будущие нативные приложения:
- **play**: Google Play Store (com.mycbp.jet)
- **itunes**: Apple App Store (ID XXXXXXXX)
- **prefer_related_applications**: true — предлагать установить нативное приложение если есть

## Ярлыки быстрого доступа (shortcuts)

Быстрые действия при долгом нажатии на иконку:

### Карта самокатов
- **name**: Полное название — "Карта самокатов"
- **short_name**: Короткое — "Карта"
- **description**: Что делает — "Открыть карту с самокатами"
- **url**: Куда ведёт — "/#map" (главная с картой)
- **icon**: 🛴 SVG иконка 96×96

### Личный кабинет
- **name**: Полное название — "Личный кабинет"
- **short_name**: Короткое — "Профиль"
- **description**: Что делает — "Перейти в личный кабинет"
- **url**: Куда ведёт — "/login.html"
- **icon**: 🛴 SVG иконка 96×96

## Для чего нужен manifest.json?

1. **PWA установка** — позволяет "Добавить на главный экран" как приложение
2. **Иконки** — задаёт иконки для всех размеров экранов
3. **Splash screen** — показывает фон и логотип при загрузке
4. **Standalone режим** — работает без адресной строки браузера
5. **Offline работа** — Service Worker может кэшировать ресурсы
6. **App Store** — Google Play и Microsoft Store могут упаковать PWA
7. **Ярлыки** — быстрые действия с главного экрана







{
    // Полное название приложения (отображается при установке PWA и в списке приложений)//
    "name": "My-CBP JET — Прокат электросамокатов",
    
    // Короткое название для иконки на рабочем столе (не более 12 символов)
    "short_name": "My-CBP JET",
    
    // Описание: что делает приложение (видно при установке и в App Store)
    "description": "Сервис аренды электросамокатов в Вагаршапате. Быстрая аренда от 5 минут, скорость до 45 км/ч.",
    
    // Стартовая страница при открытии приложения с иконки (корень сайта)
    "start_url": "/",
    
    // Режим отображения: standalone = без адресной строки браузера, как нативное приложение
    "display": "standalone",
    
    // Фон заставки при загрузке приложения (тёмный цвет фона)
    "background_color": "#0a0a0a",
    
    // Цвет темы (статус-бар, заголовок окна) - циан/бирюзовый бренд-цвет
    "theme_color": "#00f0ff",
    
    // Ориентация экрана: portrait = портретная (вертикальная)
    "orientation": "portrait",
    
    // Область действия PWA: / = весь сайт в пределах домена
    "scope": "/",
    
    // Язык приложения по умолчанию: ru = русский
    "lang": "ru",
    
    // Направление текста: ltr = слева направо
    "dir": "ltr",
    
    // Категории для App Store и Google Play: путешествия, навигация, транспорт
    "categories": ["travel", "navigation", "transportation"],
    
    // Иконки приложения: разные размеры для разных устройств и экранов
    "icons": [
        {
            // Источник: inline SVG с эмодзи 🛴 (самокат)
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "72x72",        // Для старых Android (4.0-5.0)
            "type": "image/svg+xml", // Формат: SVG вектор
            "purpose": "maskable any" // Адаптируется под круглые/квадратные формы
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "96x96",        // Для лаунчеров Android и списков
            "type": "image/svg+xml",
            "purpose": "maskable any"
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "128x128",      // Для Chrome Web Store и Firefox Marketplace
            "type": "image/svg+xml",
            "purpose": "maskable any"
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "144x144",      // Для Windows tiles и Microsoft Store
            "type": "image/svg+xml",
            "purpose": "maskable any"
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "152x152",      // Для iPad и iOS устройств
            "type": "image/svg+xml",
            "purpose": "maskable any"
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "192x192",      // Основная иконка Android PWA
            "type": "image/svg+xml",
            "purpose": "maskable any"
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "384x384",      // Ретина дисплеи 2x масштаб
            "type": "image/svg+xml",
            "purpose": "maskable any"
        },
        {
            "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
            "sizes": "512x512",      // Splash screen и высокое разрешение
            "type": "image/svg+xml",
            "purpose": "maskable any"
        }
    ],
    
    // Скриншоты для Google Play, App Store и preview при установке
    "screenshots": [
        {
            "src": "/images/screenshot-narrow.png", // Вертикальный скриншот
            "sizes": "750x1334",                    // Размер iPhone
            "type": "image/png",
            "form_factor": "narrow"                 // Для мобильных телефонов
        },
        {
            "src": "/images/screenshot-wide.png",  // Горизонтальный скриншот
            "sizes": "1920x1080",                   // Full HD
            "type": "image/png",
            "form_factor": "wide"                  // Для планшетов и десктопов
        }
    ],
    
    // Связанные нативные приложения (если есть в Google Play / App Store)
    "related_applications": [
        {
            // Google Play Store - будущее приложение Android
            "platform": "play",
            "url": "https://play.google.com/store/apps/details?id=com.mycbp.jet",
            "id": "com.mycbp.jet"
        },
        {
            // Apple App Store - будущее приложение iOS
            "platform": "itunes",
            "url": "https://apps.apple.com/app/mycbp-jet/idXXXXXXXX"
        }
    ],
    
    // Предлагать установить нативное приложение, если оно есть (вместо PWA)
    "prefer_related_applications": true,
    
    // Ярлыки быстрого доступа при долгом нажатии на иконку
    "shortcuts": [
        {
            "name": "Карта самокатов",              // Полное название действия
            "short_name": "Карта",                  // Короткое название (до 12 символов)
            "description": "Открыть карту с самокатами", // Описание действия
            "url": "/#map",                         // URL для перехода (главная с картой)
            "icons": [{                             // Иконка для ярлыка 🛴
                "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
                "sizes": "96x96"
            }]
        },
        {
            "name": "Личный кабинет",               // Полное название действия
            "short_name": "Профиль",                // Короткое название
            "description": "Перейти в личный кабинет",  // Описание действия
            "url": "/login.html",                   // URL для перехода
            "icons": [{                             // Иконка для ярлыка 🛴
                "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛴</text></svg>",
                "sizes": "96x96"
            }]
        }
    ]
}
