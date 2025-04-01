class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = [];
  }

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket уже подключен");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Нет токена, WebSocket не может подключиться");
      return;
    }

    this.socket = new WebSocket(`ws://192.168.30.153:7539/ws?token=${token}`);

    this.socket.onopen = () => {
      console.log("🔗 WebSocket подключен");
    };

    this.socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data); 
        console.log("📩 Новое уведомление:", parsedData);
        this.listeners.forEach((callback) => callback(parsedData));
      } catch (error) {
        console.error("❌ Ошибка при парсинге WebSocket сообщения:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("❌ Ошибка WebSocket:", error);
    };

    this.socket.onclose = (event) => {
      console.warn("🔌 WebSocket отключен", event);
      setTimeout(() => this.connect(), 5000); 
    };
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }
}

const notificationService = new NotificationService();
export default notificationService;
