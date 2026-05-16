# Data Model & ERD

## 1. ER-диаграмма

```mermaid
erDiagram
    CLASS {
        String id PK
        String name
        String icon
    }
    CATEGORY {
        String id PK
        String classId FK
        String name
        String icon
    }
    BRAND {
        String id PK
        String name
        String logo
    }
    PRODUCT {
        String id PK
        String brandId FK
        String categoryId FK
        String name
        String slug
        String description
        Float rating
        Int reviewsCount
        String label
        JSON specs
    }
    VARIANT {
        String id PK
        String productId FK
        String color
        String colorHex
        String storage
        Array images
    }
    SELLER {
        String id PK
        String name
        String url
        String address
        String workingHours
        String phone
        String logo
        Float rating
        Int reviewsCount
        JSON coordinates
    }
    OFFER {
        String id PK
        String productId FK
        String variantId FK
        String sellerId FK
        Int price
        String currency
        String condition
        String warrantyInfo
        String batteryHealth
        String imei
        Array usedImages
        String availability
    }
    USER {
        String id PK
        String email
        String name
        Array favorites
    }

    CLASS ||--o{ CATEGORY : contains
    CATEGORY ||--o{ PRODUCT : categorizes
    BRAND ||--o{ PRODUCT : manufactures
    PRODUCT ||--o{ VARIANT : has
    PRODUCT ||--o{ OFFER : includes
    VARIANT ||--o{ OFFER : defines
    SELLER ||--o{ OFFER : provides
```

## 2. Описание сущностей (Data Dictionary)

*   **CLASS (Класс):** Верхнеуровневая классификация каталога (Связь, Техника, Ремонт).
    *   Жизненный цикл: Active. Управляется глобальным администратором.
*   **CATEGORY (Категория):** Уточняющая классификация внутри класса (Смартфоны, Планшеты).
    *   Жизненный цикл: Active. Тегируется спецификациями.
*   **BRAND (Бренд):** Общий справочник производителей техники (Apple, Samsung).
    *   Жизненный цикл: Active.
*   **PRODUCT (Модель/Товар):** Информационная модель (каталожная сущность), собирательная карточка (например, абстрактный `iPhone 16 Pro`). К ней привязываются конкретные лоты магазинов.
    *   Жизненный цикл: Draft -> Published -> Archived.
*   **VARIANT (Вариант - SKU):** Уникальная модификация (Конфигурация) товара с точки зрения производителя (Память + Цвет). Обуславливает картинки.
    *   Жизненный цикл: Active.
*   **SELLER (Продавец/Магазин):** Мерчант, размещающийся на платформе маркетплейса.
    *   Жизненный цикл: Onboarding -> Active -> Blocked.
*   **OFFER (Предложение):** Конкретный физический товар (локальная цена и наличие) у конкретного `SELLER`. Содержит атрибуты состояния (новый ли/износ батареи/гарантия).
    *   Жизненный цикл: Draft -> Active(IN_STOCK) -> Sold -> Archived.
    *   `condition` ENUM: `NEW`, `USED_EXCELLENT`, `USED_GOOD`, `USED_FAIR`.
*   **USER (Пользователь):** Учетная запись клиента-гостя. Собирает массивы избранных (Favorites).

## 3. Требования к мастер-данным (MDM)
Для корректной работы бизнес-логики интерфейса (особенно агрегирующей фильтрации) критична организация **PIM (Product Information Management)**:
1.  **Жесткое дерево каталога:** От Классов до Категорий не допускается расхождений. Очередь создания лота магазином идет только через выбор из Категорий.
2.  **Справочник Брендов:** Избежание дублей ("apple", "Apple LLC", "Эппл") — выбор из выпадающего словаря.
3.  **Единый Каталог Моделей (Product Registry):** Продавцы (Sellers) не должны создавать свои `Products` напрямую. Они привязывают свои лоты (Offers) к уже существующим `Variants` (SKU). Если SKU не существует — выполняется Workflow проверки и добавления новой модели модераторами платформы. Это превентивно исключает дубликаты моделей на поиске.
