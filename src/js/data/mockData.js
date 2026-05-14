export const PRODUCTS = [
  { id:'p1', name:'Apple iPhone 17 Pro', slug:'apple-iphone-17-pro', brand:'apple', category:'smartphones', label:'Новинка', rating:4.9, reviewsCount:124, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/14e2f8b9e-dab3-4263-8aa8-9af18ca6742e.png'], specs:{'Экран':'6.3" OLED, 120Hz','Процессор':'Apple A19 Pro','ОЗУ':'8 GB','Камера':'48 MP + 12 MP + 12 MP','Батарея':'3800 mAh','ОС':'iOS 19'}, description:'Apple iPhone 17 Pro — флагманский смартфон с передовой камерой, мощным процессором A19 Pro и инновационным дизайном. Титановый корпус, Always-On дисплей и поддержка всех современных стандартов связи.' },
  { id:'p2', name:'Samsung Galaxy S25 Ultra', slug:'samsung-galaxy-s25-ultra', brand:'samsung', category:'smartphones', label:'Хит', rating:4.8, reviewsCount:89, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1d5f464bb-87e5-4a1e-95b0-66c0a18f289b.png'], specs:{'Экран':'6.9" AMOLED, 120Hz','Процессор':'Snapdragon 8 Gen 4','ОЗУ':'12 GB','Камера':'200 MP + 50 MP + 12 MP + 10 MP','Батарея':'5000 mAh','ОС':'Android 15'}, description:'Samsung Galaxy S25 Ultra — топовый смартфон с S Pen, камерой 200 МП и мощным процессором. Идеален для работы и мультимедиа.' },
  { id:'p3', name:'Xiaomi 15 Pro', slug:'xiaomi-15-pro', brand:'xiaomi', category:'smartphones', label:'', rating:4.7, reviewsCount:56, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1fdc06e62-55f8-4743-a7ed-5e85a6458559.png'], specs:{'Экран':'6.73" AMOLED, 120Hz','Процессор':'Snapdragon 8 Gen 3','ОЗУ':'12 GB','Камера':'50 MP Leica + 50 MP + 50 MP','Батарея':'4880 mAh','ОС':'Android 14, HyperOS'}, description:'Xiaomi 15 Pro с камерой Leica, быстрой зарядкой 120W и премиальным дизайном. Лучшее соотношение цены и качества.' },
  { id:'p4', name:'Apple iPhone 16', slug:'apple-iphone-16', brand:'apple', category:'smartphones', label:'', rating:4.6, reviewsCount:201, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/14e2f8b9e-dab3-4263-8aa8-9af18ca6742e.png'], specs:{'Экран':'6.1" OLED, 60Hz','Процессор':'Apple A18','ОЗУ':'6 GB','Камера':'48 MP + 12 MP','Батарея':'3561 mAh','ОС':'iOS 18'}, description:'Apple iPhone 16 — базовая модель с отличной камерой и производительностью. Идеальный выбор для тех, кто хочет iPhone по доступной цене.' },
  { id:'p5', name:'Samsung Galaxy S24 FE', slug:'samsung-galaxy-s24-fe', brand:'samsung', category:'smartphones', label:'Выгодно', rating:4.5, reviewsCount:134, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1d5f464bb-87e5-4a1e-95b0-66c0a18f289b.png'], specs:{'Экран':'6.7" AMOLED, 120Hz','Процессор':'Exynos 2400e','ОЗУ':'8 GB','Камера':'50 MP + 12 MP + 8 MP','Батарея':'4700 mAh','ОС':'Android 14'}, description:'Samsung Galaxy S24 FE — фан-версия флагмана с отличным экраном и камерой по доступной цене.' },
  { id:'p6', name:'Apple AirPods Pro 3', slug:'apple-airpods-pro-3', brand:'apple', category:'headphones', label:'Новинка', rating:4.9, reviewsCount:78, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/13c99d60f-7673-4ac4-b7f7-2d5496885e22.png'], specs:{'Тип':'Внутриканальные (TWS)','Шумоподавление':'Активное, адаптивное','Время работы':'6ч + 30ч кейс','Подключение':'Bluetooth 5.4','Защита':'IP54'}, description:'Apple AirPods Pro 3 с улучшенным шумоподавлением, пространственным звуком и новым дизайном.' },
  { id:'p7', name:'Apple Watch Series 10', slug:'apple-watch-series-10', brand:'apple', category:'watches', label:'Хит', rating:4.8, reviewsCount:45, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/151fb91eb-9ea7-48e1-be9c-f2b943ced773.png'], specs:{'Экран':'1.9" OLED Always-On','Процессор':'S10 SiP','Защита':'WR50, IP6X','Батарея':'18 часов','Датчики':'SpO2, ЭКГ, температура','ОС':'watchOS 11'}, description:'Apple Watch Series 10 — самые тонкие и лёгкие Apple Watch с передовыми функциями здоровья.' },
  { id:'p8', name:'Samsung Galaxy Tab S10+', slug:'samsung-galaxy-tab-s10-plus', brand:'samsung', category:'tablets', label:'', rating:4.7, reviewsCount:32, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1ba6ad3ba-b937-492c-ba69-145b9e008b2b.png'], specs:{'Экран':'12.4" AMOLED, 120Hz','Процессор':'MediaTek Dimensity 9300+','ОЗУ':'12 GB','Память':'256 GB','Батарея':'10090 mAh','ОС':'Android 14'}, description:'Samsung Galaxy Tab S10+ — мощный планшет для работы и развлечений с большим AMOLED экраном.' },
  { id:'p9', name:'Чехол Spigen Ultra Hybrid iPhone 17', slug:'chekhol-spigen-iphone-17', brand:'spigen', category:'cases', label:'', rating:4.4, reviewsCount:67, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1149c3413-d7cc-4e85-aee2-695436c2b9d6.png'], specs:{'Материал':'Поликарбонат + TPU','Совместимость':'iPhone 17 Pro','Защита':'Военный стандарт MIL-STD 810G','Особенности':'Прозрачный, MagSafe'}, description:'Надёжный прозрачный чехол с воздушными подушками для максимальной защиты.' },
  { id:'p10', name:'Зарядное устройство Anker 65W', slug:'anker-65w-charger', brand:'anker', category:'chargers', label:'Выгодно', rating:4.6, reviewsCount:112, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1149c3413-d7cc-4e85-aee2-695436c2b9d6.png'], specs:{'Мощность':'65W','Порты':'USB-C + USB-A','Технология':'GaN, PD 3.0','Размеры':'Компактный'}, description:'Компактное зарядное устройство GaN с поддержкой быстрой зарядки для всех устройств.' },
  { id:'p11', name:'Xiaomi Redmi Note 14 Pro', slug:'xiaomi-redmi-note-14-pro', brand:'xiaomi', category:'smartphones', label:'Выгодно', rating:4.5, reviewsCount:187, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1fdc06e62-55f8-4743-a7ed-5e85a6458559.png'], specs:{'Экран':'6.67" AMOLED, 120Hz','Процессор':'Dimensity 7300','ОЗУ':'8 GB','Камера':'108 MP + 8 MP + 2 MP','Батарея':'5500 mAh','ОС':'Android 14, HyperOS'}, description:'Xiaomi Redmi Note 14 Pro — доступный смартфон с AMOLED экраном 120Hz и быстрой зарядкой 67W.' },
  { id:'p12', name:'Защитное стекло Nillkin iPhone 17', slug:'nillkin-glass-iphone-17', brand:'nillkin', category:'glass', label:'', rating:4.3, reviewsCount:89, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1149c3413-d7cc-4e85-aee2-695436c2b9d6.png'], specs:{'Материал':'Закалённое стекло 9H','Совместимость':'iPhone 17 Pro','Покрытие':'Олеофобное','Толщина':'0.33 мм'}, description:'Качественное защитное стекло с олеофобным покрытием для защиты экрана iPhone 17 Pro.' },
  { id:'p13', name:'Google Pixel 9 Pro', slug:'google-pixel-9-pro', brand:'google', category:'smartphones', label:'Новинка', rating:4.8, reviewsCount:42, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1d5f464bb-87e5-4a1e-95b0-66c0a18f289b.png'], specs:{'Экран':'6.3" LTPO OLED, 120Hz','Процессор':'Google Tensor G4','ОЗУ':'16 GB','Камера':'50 MP + 48 MP + 48 MP','Батарея':'4700 mAh','ОС':'Android 15'}, description:'Google Pixel 9 Pro с лучшим ИИ на борту и превосходной камерой от Google.' },
  { id:'p14', name:'OnePlus 12', slug:'oneplus-12', brand:'oneplus', category:'smartphones', label:'Хит', rating:4.7, reviewsCount:115, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1fdc06e62-55f8-4743-a7ed-5e85a6458559.png'], specs:{'Экран':'6.82" LTPO AMOLED, 120Hz','Процессор':'Snapdragon 8 Gen 3','ОЗУ':'16 GB','Камера':'50 MP Hasselblad','Батарея':'5400 mAh','ОС':'Android 14'}, description:'Флагман от OnePlus с невероятно быстрым интерфейсом и камерой, настроенной Hasselblad.' },
  { id:'p15', name:'Sony Xperia 1 VI', slug:'sony-xperia-1-vi', brand:'sony', category:'smartphones', label:'', rating:4.5, reviewsCount:38, images:['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/14e2f8b9e-dab3-4263-8aa8-9af18ca6742e.png'], specs:{'Экран':'6.5" OLED, 120Hz','Процессор':'Snapdragon 8 Gen 3','ОЗУ':'12 GB','Камера':'48 MP Exmor T + 12 MP + 12 MP','Батарея':'5000 mAh','ОС':'Android 14'}, description:'Уникальный смартфон для создателей контента с оптическим зумом 85-170 мм.' }
];

export const VARIANTS = [
  { id:'v1', productId:'p1', attributes:{color:'Space Black', storage:'256GB'} },
  { id:'v2', productId:'p1', attributes:{color:'Space Black', storage:'512GB'} },
  { id:'v3', productId:'p1', attributes:{color:'Natural Titanium', storage:'256GB'} },
  { id:'v4', productId:'p2', attributes:{color:'Titanium Gray', storage:'256GB'} },
  { id:'v5', productId:'p2', attributes:{color:'Titanium Black', storage:'512GB'} },
  { id:'v6', productId:'p3', attributes:{color:'Black', storage:'256GB'} },
  { id:'v7', productId:'p4', attributes:{color:'Black', storage:'128GB'} },
  { id:'v8', productId:'p5', attributes:{color:'Blue', storage:'128GB'} },
  { id:'v9', productId:'p6', attributes:{color:'White', storage:'Standard'} },
  { id:'v10', productId:'p7', attributes:{color:'Midnight', storage:'45mm'} },
  { id:'v11', productId:'p8', attributes:{color:'Silver', storage:'256GB'} },
  { id:'v12', productId:'p9', attributes:{color:'Clear', storage:'Standard'} },
  { id:'v13', productId:'p10', attributes:{color:'White', storage:'Standard'} },
  { id:'v14', productId:'p11', attributes:{color:'Blue', storage:'256GB'} },
  { id:'v15', productId:'p12', attributes:{color:'Clear', storage:'Standard'} },
  { id:'v16', productId:'p13', attributes:{color:'Obsidian', storage:'256GB'} },
  { id:'v17', productId:'p14', attributes:{color:'Flowy Emerald', storage:'512GB'} },
  { id:'v18', productId:'p15', attributes:{color:'Black', storage:'256GB'} },
];

export const SELLERS = [
  { id:'s1', name:'MVideo (ЦУМ)', logo:'🏪', rating:4.7, reviewsCount:2340, isVerified:true, phone:'+996 312 111 222', url:'https://example.com/mvideo', lat: 42.8755, lng: 74.6146 },
  { id:'s2', name:'Sulpak (Дордой Плаза)', logo:'🏬', rating:4.5, reviewsCount:1890, isVerified:true, phone:'+996 312 333 444', url:'https://example.com/sulpak', lat: 42.8732, lng: 74.6169 },
  { id:'s3', name:'TechnoHouse (VEFA)', logo:'🏢', rating:4.3, reviewsCount:980, isVerified:true, phone:'+996 312 555 666', url:'https://example.com/technohouse', lat: 42.8573, lng: 74.6000 },
  { id:'s4', name:'iStore KG (Bishkek Park)', logo:'🍎', rating:4.8, reviewsCount:560, isVerified:true, phone:'+996 312 777 888', url:'https://example.com/istore', lat: 42.8752, lng: 74.5878 },
  { id:'s5', name:'Мой телефон (Ошский рынок)', logo:'📱', rating:4.1, reviewsCount:340, isVerified:false, phone:'+996 550 111 222', url:'https://example.com/myphone', lat: 42.8785, lng: 74.5701 },
  { id:'s6', name:'Galaxy Store (Азия Молл)', logo:'⭐', rating:4.4, reviewsCount:670, isVerified:true, phone:'+996 555 333 444', url:'https://example.com/galaxy', lat: 42.8554, lng: 74.5866 },
];

export const OFFERS = [];
let offerId = 1;
function addOffer(productId, variantId, sellerId, condition, price, warranty, batteryHealth, usedImages, imei) {
  OFFERS.push({ id: String(offerId++), productId, variantId, sellerId, condition, price, currency:'сом', availability:'IN_STOCK', warrantyInfo:warranty, batteryHealth: batteryHealth || null, usedImages: usedImages || null, imei: imei || null, targetUrl:SELLERS.find(s=>s.id===sellerId).url, updatedAt:new Date().toISOString() });
}

addOffer('p1','v1','s1','NEW',115000,'Официальная 1 год');
addOffer('p1','v1','s4','NEW',118000,'Официальная 1 год');
addOffer('p1','v1','s2','NEW',112000,'От магазина 6 мес');
addOffer('p1','v1','s3','NEW',110000,'От магазина 3 мес');
addOffer('p1','v1','s5','USED_EXCELLENT',85000,'3 мес',92,['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/14e2f8b9e-dab3-4263-8aa8-9af18ca6742e.png'], '352938192039281');
addOffer('p1','v1','s5','USED_GOOD',78000,'1 мес',85,['https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/14e2f8b9e-dab3-4263-8aa8-9af18ca6742e.png'], '352938192039280');
addOffer('p1','v2','s1','NEW',128000,'Официальная 1 год');
addOffer('p1','v2','s4','NEW',130000,'Официальная 1 год');
addOffer('p1','v3','s1','NEW',115000,'Официальная 1 год');
addOffer('p2','v4','s1','NEW',105000,'Официальная 1 год');
addOffer('p2','v4','s6','NEW',102000,'От магазина 6 мес');
addOffer('p2','v4','s2','NEW',108000,'Официальная 1 год');
addOffer('p2','v4','s5','USED_EXCELLENT',75000,'3 мес',88);
addOffer('p2','v5','s1','NEW',120000,'Официальная 1 год');
addOffer('p3','v6','s1','NEW',55000,'Официальная 1 год');
addOffer('p3','v6','s3','NEW',52000,'От магазина 6 мес');
addOffer('p3','v6','s2','NEW',54000,'Официальная 1 год');
addOffer('p3','v6','s5','USED_GOOD',38000,'1 мес',82);
addOffer('p4','v7','s1','NEW',75000,'Официальная 1 год');
addOffer('p4','v7','s4','NEW',78000,'Официальная 1 год');
addOffer('p4','v7','s3','NEW',72000,'От магазина 3 мес');
addOffer('p4','v7','s5','USED_EXCELLENT',55000,'3 мес',90);
addOffer('p4','v7','s5','USED_GOOD',48000,'1 мес',80);
addOffer('p5','v8','s1','NEW',42000,'Официальная 1 год');
addOffer('p5','v8','s6','NEW',40000,'От магазина 6 мес');
addOffer('p5','v8','s2','NEW',44000,'Официальная 1 год');
addOffer('p6','v9','s1','NEW',25000,'Официальная 1 год');
addOffer('p6','v9','s4','NEW',27000,'Официальная 1 год');
addOffer('p6','v9','s2','NEW',24000,'От магазина 6 мес');
addOffer('p7','v10','s1','NEW',45000,'Официальная 1 год');
addOffer('p7','v10','s4','NEW',48000,'Официальная 1 год');
addOffer('p7','v10','s2','NEW',43000,'От магазина 6 мес');
addOffer('p8','v11','s1','NEW',65000,'Официальная 1 год');
addOffer('p8','v11','s6','NEW',62000,'От магазина 6 мес');
addOffer('p9','v12','s1','NEW',2500,'От магазина 6 мес');
addOffer('p9','v12','s2','NEW',2200,'От магазина 3 мес');
addOffer('p9','v12','s3','NEW',2800,'От магазина 3 мес');
addOffer('p10','v13','s1','NEW',3500,'От магазина 6 мес');
addOffer('p10','v13','s2','NEW',3200,'От магазина 3 мес');
addOffer('p10','v13','s3','NEW',3800,'От магазина 3 мес');
addOffer('p11','v14','s1','NEW',22000,'Официальная 1 год');
addOffer('p11','v14','s3','NEW',20000,'От магазина 6 мес');
addOffer('p11','v14','s5','USED_GOOD',15000,'1 мес',87);
addOffer('p12','v15','s1','NEW',800,'От магазина 3 мес');
addOffer('p12','v15','s2','NEW',600,'От магазина 3 мес');
addOffer('p12','v15','s3','NEW',900,'От магазина 3 мес');
addOffer('p13','v16','s6','NEW',95000,'Официальная 1 год');
addOffer('p13','v16','s2','NEW',98000,'От магазина 6 мес');
addOffer('p14','v17','s3','NEW',82000,'От магазина 6 мес');
addOffer('p14','v17','s1','NEW',85000,'Официальная 1 год');
addOffer('p15','v18','s3','NEW',110000,'Официальная 1 год');

export const REVIEWS = [
  { productId:'p1', author:'Айбек М.', date:'2024-12-15', rating:5, pros:'Отличная камера, быстрая зарядка, красивый дизайн', cons:'Цена высоковата', comment:'Лучший iPhone, который у меня был. Камера просто невероятная!' },
  { productId:'p1', author:'Нургуль К.', date:'2024-12-10', rating:4, pros:'Производительность, экран', cons:'Батарея могла бы быть больше', comment:'Очень доволен покупкой, телефон работает быстро.' },
  { productId:'p1', author:'Данияр Т.', date:'2024-12-05', rating:5, pros:'Всё!', cons:'Нет', comment:'Перешёл с Android, не жалею ни секунды.' },
  { productId:'p2', author:'Бакыт Ж.', date:'2024-12-12', rating:5, pros:'Камера 200МП, S Pen, большой экран', cons:'Тяжеловат', comment:'Лучший Android смартфон на рынке.' },
  { productId:'p2', author:'Айсулуу А.', date:'2024-12-08', rating:4, pros:'Экран, камера, S Pen', cons:'Долго заряжается', comment:'Отличный телефон для работы и развлечений.' },
  { productId:'p3', author:'Эрлан С.', date:'2024-12-14', rating:5, pros:'Цена/качество, камера Leica', cons:'Нет', comment:'За эти деньги — лучший смартфон.' },
  { productId:'p3', author:'Мээрим Б.', date:'2024-12-09', rating:4, pros:'Быстрая зарядка, дизайн', cons:'Нет NFC в некоторых версиях', comment:'Очень доволен, рекомендую!' },
  { productId:'p6', author:'Чынгыз Н.', date:'2024-12-13', rating:5, pros:'Шумоподавление, звук', cons:'Цена', comment:'Лучшие наушники, которые я использовал.' },
  { productId:'p7', author:'Алина Д.', date:'2024-12-11', rating:5, pros:'Дизайн, функции здоровья', cons:'Батарея на 1 день', comment:'Обожаю свои часы! Очень удобные.' },
  { productId:'p4', author:'Тимур К.', date:'2024-12-07', rating:4, pros:'Камера, производительность', cons:'60Hz экран', comment:'Хороший базовый iPhone.' },
];

export const CLASSES = [
  { id: 'devices', name: 'Устройства', icon: '📱' },
  { id: 'accessories', name: 'Аксессуары', icon: '🎧' },
  { id: 'services', name: 'Услуги', icon: '🛠️' },
  { id: 'parts', name: 'Запчасти', icon: '⚙️' }
];

export const CATEGORIES = [
  { id:'smartphones', name:'Телефоны', icon:'📱', classId: 'devices', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/14e2f8b9e-dab3-4263-8aa8-9af18ca6742e.png' },
  { id:'tablets', name:'Планшеты', icon:'📟', classId: 'devices', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1ba6ad3ba-b937-492c-ba69-145b9e008b2b.png' },
  { id:'watches', name:'Часы', icon:'⌚', classId: 'accessories', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/151fb91eb-9ea7-48e1-be9c-f2b943ced773.png' },
  { id:'headphones', name:'Наушники', icon:'🎧', classId: 'accessories', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/13c99d60f-7673-4ac4-b7f7-2d5496885e22.png' },
  { id:'chargers', name:'Зарядки', icon:'🔌', classId: 'accessories', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1149c3413-d7cc-4e85-aee2-695436c2b9d6.png' },
  { id:'cases', name:'Чехлы', icon:'🛡️', classId: 'accessories', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1149c3413-d7cc-4e85-aee2-695436c2b9d6.png' },
  { id:'glass', name:'Защитные стёкла', icon:'🔲', classId: 'accessories', image:'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1149c3413-d7cc-4e85-aee2-695436c2b9d6.png' },
];

export const BRANDS = [
  { id:'apple', name:'Apple', icon:'🍎' },
  { id:'samsung', name:'Samsung', icon:'' },
  { id:'xiaomi', name:'Xiaomi', icon:'' },
  { id:'google', name:'Google', icon:'' },
  { id:'oneplus', name:'OnePlus', icon:'' },
  { id:'sony', name:'Sony', icon:'' },
  { id:'spigen', name:'Spigen', icon:'🛡️' },
  { id:'anker', name:'Anker', icon:'⚡' },
  { id:'nillkin', name:'Nillkin', icon:'🔲' },
];

export const USERS = [
  {
    id: 'u1',
    level: 1, // Phone only
    phone: '+996555123456',
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    inn: '',
    passport: '',
    city: '',
    history: { purchases: [], contacts: [], browsing: [], chats: [] },
    survey: {}
  },
  {
    id: 'u2',
    level: 2, // Verification Level 2 (FIO + Email)
    phone: '+996777123456',
    name: 'Иван',
    surname: 'Иванов',
    patronymic: 'Иванович',
    email: 'ivanov@example.com',
    inn: '',
    passport: '',
    city: 'Бишкек',
    history: {
      purchases: [{ id: 'p1', date: '2026-01-10', price: 90000 }],
      contacts: [],
      browsing: ['p1', 'p2'],
      chats: []
    },
    survey: {
      currentPhone: 'apple',
      preferredBrands: ['apple'],
      wearWatch: true,
      wearCase: true,
      wearScreenProtector: true,
      wearHeadphones: true
    }
  },
  {
    id: 'u3',
    level: 3, // Verification level 3 (Passport data)
    phone: '+996500123456',
    name: 'Айбек',
    surname: 'Асанов',
    patronymic: 'Асанович',
    email: 'asanov@example.com',
    inn: '12345678901234',
    passport: 'ID123456',
    passportPhotoFront: 'yes',
    passportPhotoBack: 'yes',
    passportSelfie: 'yes',
    city: 'Ош',
    history: {
      purchases: [],
      contacts: [{ sellerId: 's1', date: '2026-05-10' }],
      browsing: ['p3'],
      chats: [{ sellerId: 's1', messages: [{ sender: 'u3', text: 'Есть в наличии?' }, { sender: 's1', text: 'Да, есть.' }] }]
    },
    survey: {
      currentPhone: 'samsung',
      preferredBrands: ['samsung', 'xiaomi'],
      wearWatch: false,
      wearCase: true,
      wearScreenProtector: false,
      wearHeadphones: true
    }
  }
];
