# 🤝 Руководство по внесению изменений

Спасибо за интерес к проекту! Мы рады любому вкладу.

## 📋 Как внести изменения

### 1. Fork репозитория

Нажмите кнопку **Fork** на GitHub

### 2. Клонируйте ваш fork

```bash
git clone https://github.com/YOUR_USERNAME/escort-th-ble-app.git
cd escort-th-ble-app/TH_mini_app
```

### 3. Создайте ветку для изменений

```bash
git checkout -b feature/my-new-feature
# или
git checkout -b fix/bug-fix
```

### 4. Установите зависимости

```bash
npm install
```

### 5. Внесите изменения

- Следуйте существующему стилю кода
- Добавляйте комментарии на русском языке
- Используйте TypeScript типы
- Тестируйте изменения локально

### 6. Запустите линтер

```bash
npm run lint
```

### 7. Сделайте коммит

```bash
git add .
git commit -m "feat: Добавил новую функцию"
```

Используйте префиксы:
- `feat:` - новая функциональность
- `fix:` - исправление бага
- `docs:` - изменения в документации
- `style:` - форматирование, отступы
- `refactor:` - рефакторинг кода
- `test:` - добавление тестов
- `chore:` - обновление зависимостей

### 8. Push в ваш fork

```bash
git push origin feature/my-new-feature
```

### 9. Создайте Pull Request

1. Перейдите на GitHub
2. Нажмите **New Pull Request**
3. Опишите ваши изменения
4. Дождитесь ревью

## 💻 Разработка

### Запуск dev-сервера

```bash
npm run dev
```

Приложение откроется на `https://localhost:3000`

### Структура проекта

```
src/
├── components/   # React компоненты
├── lib/         # Библиотеки и API
├── store/       # Zustand stores
├── types/       # TypeScript типы
├── utils/       # Утилиты
└── App.tsx      # Главный компонент
```

### Стиль кода

- **Отступы**: 2 пробела
- **Кавычки**: одинарные `'`
- **Точка с запятой**: не обязательна
- **Комментарии**: на русском языке
- **Именование**: camelCase для переменных, PascalCase для компонентов

### Пример компонента

```tsx
/**
 * Описание компонента
 */

import { useState } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    onAction?.();
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      <button onClick={handleClick}>
        {isActive ? 'Активно' : 'Неактивно'}
      </button>
    </div>
  );
}
```

## 🐛 Сообщение об ошибках

При обнаружении бага создайте Issue с:

- **Описанием** проблемы
- **Шагами** для воспроизведения
- **Ожидаемым** поведением
- **Реальным** поведением
- **Скриншотами** (если возможно)
- **Версией** браузера и ОС

## 💡 Предложения

Есть идея? Создайте Issue с тегом `enhancement`:

- Опишите предложение
- Объясните, почему это полезно
- Приведите примеры использования

## ✅ Чек-лист Pull Request

- [ ] Код следует стилю проекта
- [ ] Нет TypeScript ошибок
- [ ] Линтер проходит без предупреждений
- [ ] Добавлены комментарии к сложному коду
- [ ] Обновлена документация (если нужно)
- [ ] Протестировано на реальном устройстве

## 📞 Связь

- Telegram: [@EscortBLE_bot](https://t.me/EscortBLE_bot)
- Issues: [GitHub Issues](https://github.com/YOUR_REPO/issues)

---

**Спасибо за ваш вклад! 🙏**

