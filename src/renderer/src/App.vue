<template>
  <div class="drag-area">
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
      </div>
    </div>

    <!-- 图片区域 -->
    <ImageLayer
      ref="imageLayer"
      :layers="imageLayerList"
      @drop="handleLayerDrop"
      @no-data-click="handleNoDataClick"
    >
    </ImageLayer>
  </div>
</template>

<script setup lang="ts">
import { CloseOutlined, DownOutlined, UpOutlined, SettingOutlined } from '@ant-design/icons-vue';

import { ref } from 'vue';
import ImageLayer from './views/ImageLayer.vue';
import { ImageFile } from '@entities/index';

const imageLayerList = ref<any>([]);
const opacity = ref(96);
const width = ref(600);
const height = ref(600);
const isExpandToolbarBody = ref(false);

/**
 * @description: 添加图层
 * @param {*} files
 * @return {*}
 */
const addLayer = (img: any) => {
  imageLayerList.value = [];
  imageLayerList.value.push(img);

  width.value = img.width * 0.5;
  height.value = img.height * 0.5;

  window.api.setWindowSize(img.width * 0.5, img.height * 0.5);
};

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
  console.log(width.value, height.value);

  window.api.setWindowSize(width.value, height.value);
};

/**
 * @description: 拖动上传图片
 * @param {*} e
 * @return {*}
 */
const handleLayerDrop = (e: DragEvent) => {
  if (!e.dataTransfer) return;

  const files = Array.from(e.dataTransfer.files as FileList).filter((file: File) =>
    file.type.startsWith('image/')
  );

  files.forEach(async (file: File) => {
    const path = await window.api.getPathForFile(file);
    const size = await window.api.getImageSize(path);

    addLayer(
      new ImageFile({
        path: `file://${path}`,
        width: size.width,
        height: size.height
      })
    );
  });
};

/**
 * @description: 未上传图片区域的点击事件
 * @param {*} e
 * @return {*}
 */
const handleNoDataClick = async () => {
  const files = await window.api.openFileDialog({
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }]
  });

  if (!files || files.length == 0) return;
  files.forEach(e => {
    e.path = `file://${e.path}`;
    addLayer(e);
  });
};
</script>

<style lang="less" scoped>
.drag-area {
  -webkit-app-region: drag;
}

.toolbar-area {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 278px;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  background: #fff;
  user-select: none;
  padding-top: 24px;
  -webkit-app-region: no-drag;

  .header {
    display: flex;
    padding: 10px 15px 15px 15px;
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
      margin-bottom: 12px;

      :deep(.ant-slider) {
        margin: 0;
      }
    }
  }
}

.window-size-input-area {
  display: flex;
  .input {
    flex: 1;
  }
}
</style>
