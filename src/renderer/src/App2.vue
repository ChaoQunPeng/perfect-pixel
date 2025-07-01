<!--
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-06-28 11:15:52
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-06-28 14:29:45
 * @FilePath: /electron-vue-opacity-tool/src/views/Toolbar.vue
 * @Description: 
-->
<template>
  <!-- 工具栏 -->
  <div class="toolbar-area">
    <div class="body">
      <div class="label">透明度设置</div>
      <div class="slider">
        <a-slider
          v-model:value="opacity"
          :min="30"
          :max="100"
          tooltip-placement="top"
          @change="handleUpdateOpacity"
        />
      </div>

      <div class="label">宽高设置</div>
      <a-space class="window-size-input-area">
        <a-input
          class="input"
          v-model:value.number="width"
          placeholder="宽度(不能为0)"
          @blur="handleWindowUpdateSize"
          @pressEnter="handleWindowUpdateSize"
        />
        <CloseOutlined />
        <a-input
          class="input"
          v-model:value.number="height"
          placeholder="高度(不能为0)"
          @blur="handleWindowUpdateSize"
          @pressEnter="handleWindowUpdateSize"
        />
      </a-space>

      <div class="label">清空图片</div>
      <div style="text-align: right">
        <a-button block danger :icon="h(ClearOutlined)" @click="handleClear"> 清空 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { h } from 'vue';
import { CloseOutlined, ClearOutlined } from '@ant-design/icons-vue';

const opacity = ref(96);
const width = ref(600);
const height = ref(600);

onMounted(() => {
  window.electronApi.ipcRenderer.on('set-width-height', data => {
    console.log(data);

    // setWidthHeight();
  });
});

/**
 * @description: 更新透明度
 * @return {*}
 */
const handleUpdateOpacity = () => {
  window.api.setWindowOpacity(opacity.value / 100);
};

/**
 * @description: 更新视窗尺寸
 * @return {*}
 */
const handleWindowUpdateSize = () => {
  if (width.value == 0 || height.value == 0) return;
  setWidthHeight(width.value, height.value);
  window.api.setWindowSize(width.value, height.value);
};

/**
 * @description: 设置宽高
 * @return {*}
 */
const setWidthHeight = (w, h) => {
  width.value = w;
  height.value = h;
};

const handleClear = () => {
  // window.api.sendClearEvent();
  setWidthHeight(600, 600);
  window.electronApi.ipcRenderer.send('clear');
};

defineExpose({
  setWidthHeight
});
</script>

<style lang="scss" scoped>
.toolbar-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 4px;
  padding-top: 15px;
  user-select: none;

  .header {
    display: flex;
    padding: 15px 15px 15px 15px;
    font-size: 13px;
    cursor: pointer;
  }

  .body {
    padding: 5px 15px 15px 15px;

    .label {
      font-size: 12px;
      margin-bottom: 12px;
      color: rgba(0, 0, 0, 0.67);
    }

    .slider {
      width: 244px;
      margin-bottom: 15px;

      :deep(.ant-slider) {
        margin: 0;
      }
    }
  }
}

.window-size-input-area {
  display: flex;
  margin-bottom: 15px;

  .input {
    flex: 1;
  }
}
</style>
