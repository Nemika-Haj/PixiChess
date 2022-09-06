import { createApp } from 'vue'
import App from './App.vue'
import { initializePixiStageManager } from './PixiApp';

// Mount the App from Vue 3
createApp(App).mount('#app');

// Initialize Pixi Stage Manager
initializePixiStageManager();