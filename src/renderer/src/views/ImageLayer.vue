<template>
  <div class="image-container" @drop.prevent="handleDrop" @dragover.prevent>
    <div v-for="(img, index) in layers" :key="index" class="image-layer">
      <img :src="img.path" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ImageFile } from '@entities/index';

defineProps<{
  layers: ImageFile[];
}>();

// const layers = ref<ImageFile[]>(props.layers);

const emit = defineEmits(['drop']);
const handleDrop = (e: DragEvent) => {
  emit('drop', e);
};
</script>

<style lang="less" scoped>
.image-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
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
