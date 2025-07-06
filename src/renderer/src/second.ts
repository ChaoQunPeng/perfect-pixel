import './assets/main.css';
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import { createApp } from 'vue';
import App from './handle.vue';

const app = createApp(App);

app.use(Antd).mount('#app');
