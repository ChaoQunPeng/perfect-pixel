/*
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-07-01 21:30:37
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:54:15
 * @FilePath: /perfect-pixel/src/renderer/src/handle.ts
 * @Description: 
 */
import './assets/main.css';
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import { createApp } from 'vue';
import App from './views/Handle.vue';

const app = createApp(App);

app.use(Antd).mount('#app');
