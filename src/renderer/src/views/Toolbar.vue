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
    <div class="header" @click="isExpandToolbarBody = !isExpandToolbarBody">
      <div><SettingOutlined style="font-size: 12px; color: rgba(0, 0, 0, 0.67)" /> 设置</div>

      <div style="margin-left: auto">
        <DownOutlined v-show="isExpandToolbarBody" />
        <UpOutlined v-show="!isExpandToolbarBody" />
      </div>
    </div>

    <div v-show="isExpandToolbarBody" class="body">
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
        <a-button block danger :icon="h(ClearOutlined)"> 清空 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { h } from 'vue';
import {
  CloseOutlined,
  DownOutlined,
  UpOutlined,
  SettingOutlined,
  ClearOutlined
} from '@ant-design/icons-vue';

const isExpandToolbarBody = ref(false);
const opacity = ref(96);
const width = ref(600);
const height = ref(600);

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
  debugger;
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

defineExpose({
  setWidthHeight
});
</script>

<style lang="less" scoped>
.toolbar-area {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 278px;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  background: #fff;
  user-select: none;
  // padding-top: 24px;
  -webkit-app-region: no-drag;

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
      width: 242px;
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
