# API Contracts

## 1. Получение товаров каталога
**Endpoint:** `GET /api/v1/products`
**Trigger:** Инициализация страницы Каталога во View = `products`, применение любого фильтра боковой панели.
**Request Payload (Query Params):**
```json
{
  "category": "smartphones",
  "brand": "apple",
  "priceMin": 50000,
  "priceMax": 100000,
  "condition": "new",
  "sort": "price_asc",
  "limit": 24,
  "page": 1
}
```
**Response Payload (200 OK):**
```json
{
  "data": [
    {
      "id": "p1",
      "name": "Apple iPhone 16 Pro",
      "slug": "apple-iphone-16-pro",
      "brand": { "id": "apple", "name": "Apple" },
      "category": { "id": "smartphones", "name": "Смартфоны" },
      "label": "Хит",
      "rating": 4.9,
      "reviewsCount": 254,
      "images": ["https://.../img.png"],
      "minPrice": 95000,
      "offersCount": 12
    }
  ],
  "meta": {
    "totalCount": 150,
    "currentPage": 1,
    "totalPages": 7
  }
}
```
**Error Codes:**
*   **400 Bad Request:** Ошибка валидации типа данных Query (например String вместо Int). Пользователю выводится: "Сбой параметров фильтрации поиска".
*   **500 Internal Server Error:** Текст: "Сервис временно недоступен. Мы уже работаем над исправлением."

## 2. Получение предложений (Offers)
**Endpoint:** `GET /api/v1/offers`
**Trigger:** Инициализация страницы Каталога во View = `offers`, а также загрузка предложений внутри `Product Page`.
**Request Payload (Query Params):**
```json
{
  "productId": "p1",
  "variantId": "v1",
  "sellerId": "s1",
  "condition": "all",
  "sort": "price_asc",
  "limit": 50
}
```
**Response Payload (200 OK):**
```json
{
  "data": [
    {
      "id": "o1",
      "price": 95000,
      "currency": "KGS",
      "condition": "NEW",
      "warrantyInfo": "1 год от продавца",
      "availability": "IN_STOCK",
      "product": { "id": "p1", "name": "Apple iPhone 16 Pro" },
      "variant": { "id": "v1", "storage": "256GB", "color": "Титановый черный" },
      "seller": { "id": "s1", "name": "iStore", "rating": 4.8 }
    }
  ]
}
```
**Error Codes:**
*   **404 Not Found:** При пустой выдаче по фильтрам отдается HTTP-код 200 с пустым массивом `data: []`, 404 использовать только если запрашивался несуществующий лот напрямую по ID.

## 3. Детализация Модели (Деталка)
**Endpoint:** `GET /api/v1/products/{slug}`
**Trigger:** Клик по карточке модели в каталоге, прямой переход по ссылке.
**Response Payload (200 OK):**
```json
{
  "id": "p1",
  "name": "Apple iPhone 16 Pro",
  "slug": "apple-iphone-16-pro",
  "description": "Флагман на процессоре A18 Pro...",
  "specs": {
    "Экран": "6.1\" Super Retina XDR, 120Hz",
    "Процессор": "Apple A18 Pro",
    "ОЗУ": "8 GB"
  },
  "variants": [
    {
      "id": "v1",
      "color": "Black Titanium",
      "colorHex": "#303030",
      "storage": "256GB",
      "images": ["https://.../1.jpg"]
    }
  ]
}
```
**Error Codes:**
*   **404 Not Found:** Текст для UI: "К сожалению, этот товар не найден или был удален из каталога платформы."

## 4. Добавление в Избранное (Favorites)
**Endpoint:** `POST /api/v1/favorites`
**Trigger:** Клик(тоггл) по иконке "Лайк" на карточке товара/предложения.
**Request Payload (Body JSON):**
```json
{
  "referenceType": "OFFER", 
  "referenceId": "o1"
}
```
**Response Payload (200 OK):**
```json
{
  "status": "success",
  "message": "Успешно добавлено в избранное"
}
```
**Error Codes:**
*   **401 Unauthorized:** Текст: "Для добавления в избранное необходимо выполнить вход."
*   **409 Conflict:** "Товар уже находится в списке избранного." (Опционально можно настроить эндпоинт как UPSERT/Toggle).
