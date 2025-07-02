<template>
  <div class="drag-area">
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
import { ref, onMounted } from 'vue';
import ImageLayer from './views/ImageLayer.vue';
import { ImageFile } from '@entities/index';

// type ToolbarInstance = {
//   setWidthHeight: (width: number, height: number) => void;
// };

const imageLayerList = ref<any>([]);

onMounted(() => {
  window.electronApi.ipcRenderer.on('clear', () => {
    handleClear();
  });
});

/**
 * @description: 添加图层
 * @param {*} files
 * @return {*}
 */
const addLayer = (img: any) => {
  imageLayerList.value = [];
  imageLayerList.value.push(img);

  window.api.setWindowSize(img.width * 0.5, img.height * 0.5);

  window.electronApi.ipcRenderer.send('set-panel-width-height', {
    width: img.width * 0.5,
    height: img.height * 0.5
  });
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

const handleClear = () => {
  imageLayerList.value = [];
  window.api.setWindowSize(600, 600);
};
</script>

<style lang="scss" scoped>
.drag-area {
  -webkit-app-region: drag;
}
</style>
