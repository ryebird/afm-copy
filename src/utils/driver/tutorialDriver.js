import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startTutorial = () => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    opacity: 0.75,
    doneBtnText: "Готово",
    closeBtnText: "Закрыть",
    nextBtnText: "Далее",
    prevBtnText: "Назад",
    steps: [
      {
        element: ".sidebar",
        popover: {
          title: "Сайдбар – ваши источники",
          description:
            "Здесь находятся все каналы и веб-сайты, с которых мы получаем информацию. Вы можете добавлять новые Telegram-каналы и управлять своими источниками новостей.",
        },
      },
      {
        element: ".main-content",
        popover: {
          title: "Основной контент",
          description:
            "В этом разделе отображаются все новости из выбранного вами канала. Просто выберите источник в сайдбаре, и здесь появятся его последние материалы.",
        },
      },
      {
        element: ".search-container",
        popover: {
          title: "Умный поиск",
          description:
            "Этот поисковик использует искусственный интеллект, который ищет не только по тексту, но и по смыслу. Введите запрос, и система подберёт наиболее релевантные новости.",
        },
      },
      {
        element: ".filter-btn",
        popover: {
          title: "Период новостей",
          description:
            "Используйте эту кнопку, чтобы настроить фильтрацию новостей по дате.",
        },
      },
    ],
  });

  driverObj.drive();
};
