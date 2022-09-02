import { createApp } from 'vue'
import App from './App.vue'
import PixiInit from "./Bixi"

createApp(App).mount('#app')

document.onload = () => {
    console.log("Hi")
    PixiInit()
}