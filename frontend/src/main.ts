import { createApp } from 'vue';
import App from './App.vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
createApp(App).mount('#app')

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
