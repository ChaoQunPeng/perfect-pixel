<template>
  <!-- 工具栏 -->
  <div class="toolbar">
    <button @click="handleChooseFile">
      <span>选择图片</span>
    </button>
    <button @click="handleClear">
      <span>清空</span>
    </button>

    <input type="range" min="30" max="100" v-model="opacity" @input="handleUpdateOpacity" />
  </div>

  <!-- 图片区域 -->
  <ImageLayer ref="imageLayer" :layers="imageLayerList" @drop="handleLayerDrop" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageLayer from './views/ImageLayer.vue'
import { ImageFile } from '../../entities/image-file'

const imageLayerList = ref<any>([])
const opacity = ref(85)

/**
 * @description: 选择文件
 * @return {*}
 */
const handleChooseFile = async () => {
  const files = await window.api.openFileDialog({
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }]
  })

  console.log(files)

  if (!files || files.length == 0) return
  files.forEach((e) => {
    e.path = `file://${e.path}`
    addLayer(e)
  })
}

/**
 * @description: 添加图层
 * @param {*} files
 * @return {*}
 */
const addLayer = (img: any) => {
  imageLayerList.value = []
  imageLayerList.value.push(img)
  window.api.setWindowSize(img.width * 0.5, img.height * 0.5)
}

/**
 * @description: 清空图层
 * @return {*}
 */
const handleClear = () => {
  imageLayerList.value = []
  window.api.setWindowSize(600, 400)
}

/**
 * @description: 更新透明度
 * @return {*}
 */
const handleUpdateOpacity = () => {
  // window.electron.setWindowOpacity(opacity.value / 100)
}

/**
 * @description: 拖动上传图片
 * @param {*} e
 * @return {*}
 */
const handleLayerDrop = (e) => {
  const files = Array.from(e.dataTransfer.files).filter((file: any) =>
    file.type.startsWith('image/')
  )
  files.forEach(async (file: any) => {
    const arrayBuffer = await file.arrayBuffer()
    const meta = await window.api.fileToPath(arrayBuffer)

    addLayer(
      new ImageFile({
        path: meta.url,
        width: meta.width,
        height: meta.height
      })
    )
  })
}
</script>

<style lang="less">
.toolbar {
  position: fixed;
  z-index: 2000;
}
</style>
