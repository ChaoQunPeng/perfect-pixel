<template>
  <div class="image-layer-container">
    <div v-if="layers.length" class="image-container" @drop.prevent="handleDrop" @dragover.prevent>
      <div v-for="(img, index) in layers" :key="index" class="image-layer">
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

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ImageFile } from '@entities/index';
import { CloudUploadOutlined } from '@ant-design/icons-vue';

defineProps<{
  layers: ImageFile[];
}>();

// const layers = ref<ImageFile[]>(props.layers);

const emit = defineEmits(['drop', 'no-data-click']);
const handleDrop = (e: DragEvent) => {
  emit('drop', e);
};

const handleNoDataClick = () => {
  emit('no-data-click');
};
</script>

<style lang="less" scoped>
.image-layer-container {
  // -webkit-app-region: drag;
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
