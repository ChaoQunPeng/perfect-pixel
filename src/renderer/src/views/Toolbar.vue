<!--
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-06-28 11:15:52
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-06-28 14:29:45
 * @FilePath: /electron-vue-opacity-tool/src/views/Toolbar.vue
 * @Description: 
-->
<template>
  <div class="toolbar">
    <button @click="chooseFile">
      <span>选择图片</span>
    </button>
    <button @click="clear">
      <span>清空</span>
    </button>

    <input type="range" min="50" max="100" v-model="opacity" @input="updateOpacity" />
  </div>
</template>

<script>
export default {
  data() {
    return { opacity: 80 }
  },

  methods: {}
}
</script>

<style scoped>
.toolbar {
  padding: 10px;
  background: #f0f0f0;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #369f6b;
}
</style>
