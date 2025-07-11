/*
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-07-01 21:16:21
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:54:20
 * @FilePath: /perfect-pixel/src/renderer/src/main.ts
 * @Description:
 */
import './assets/main.css';
import 'ant-design-vue/dist/reset.css';

import Antd from 'ant-design-vue';
import { createApp } from 'vue';
import App from './views/Image.vue';

const app = createApp(App);

app.use(Antd).mount('#app');
