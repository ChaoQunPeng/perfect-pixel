<template>
  <div class="drag-area">
    <div class="image-layer-container">
      <div
        v-if="imageLayerList.length"
        class="image-container"
        @drop.prevent="handleDrop"
        @dragover.prevent
      >
        <div v-for="(img, index) in imageLayerList" :key="index" class="image-layer">
          <img :src="img.path" draggable="false" />
        </div>
      </div>

      <div v-else class="no-data-container">
        <div
          class="upload-area"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @click="handleNoDataClick"
        >
          <CloudUploadOutlined class="icon" />
          <div class="drag-text">拖动图片到此处</div>
          <div class="or">Or</div>
          <div class="choose-text">选择图片</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ImageFile } from '@entities/index';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { onMounted, ref } from 'vue';
import { Events } from '@events/index';
import { AppIpcRenderer } from '@renderer/utils/app-ipc';
import { INIT_IMAGE_SIZE } from '@constant/index';

const imageLayerList = ref<any>([]);

onMounted(() => {
  AppIpcRenderer.on(Events.CLEAR_IMAGE, () => {
    handleClear();
  });
});

const handleDrop = (e: DragEvent) => {
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

/**
 * @description: 添加图层
 * @param {*} files
 * @return {*}
 */
const addLayer = (img: any) => {
  imageLayerList.value = [];
  imageLayerList.value.push(img);

  AppIpcRenderer.send(Events.UPDATE_HANDLE_WINDOW_SIZE_VALUE, 'image.vue', {
    width: img.width * 0.5,
    height: img.height * 0.5
  });

  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_SIZE, 'image.vue', {
    width: img.width * 0.5,
    height: img.height * 0.5
  });
};

/**
 * @description: 清空图片
 * @return {*}
 */
const handleClear = () => {
  imageLayerList.value = [];
  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_SIZE, 'image.vue-handleClear', {
    width: INIT_IMAGE_SIZE.width,
    height: INIT_IMAGE_SIZE.height
  });
};
</script>

<style lang="scss" scoped>
.drag-area {
  -webkit-app-region: drag;
}

.image-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.no-data-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  .upload-area {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 48vw;
    height: 48vw;
    max-width: 420px;
    max-height: 420px;
    min-width: 380px;
    min-height: 380px;
    cursor: pointer;
    border-radius: 8px;
    border: 2px dashed #d9d9d9;
    -webkit-app-region: no-drag;
    user-select: none;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .icon {
      color: #1677ff;
      font-size: 72px;
      margin-bottom: 40px;
    }

    .drag-text {
      font-size: 24px;
    }

    .or {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .choose-text {
      font-size: 24px;
      color: #1677ff;
    }
  }
}

.image-layer {
  position: absolute;
  top: 0;
  left: 0;

  img {
    display: block;
    width: 100vw;
    height: 100vh;
  }
}
</style>
