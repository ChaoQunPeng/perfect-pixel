<!--
 * @Author: ChaoQunPeng 1152684231@qq.com
 * @Date: 2025-06-28 11:15:52
 * @LastEditors: ChaoQunPeng 1152684231@qq.com
 * @LastEditTime: 2025-07-06 13:14:42
 * @FilePath: /perfect-pixel/src/renderer/src/handle.vue
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
      <a-space block class="window-size-input-area">
        <a-input
          style="width: 100%"
          class="input"
          v-model:value.number="width"
          placeholder="宽度(不能为0)"
          @blur="handleUpdateImageWindowSize"
          @pressEnter="handleUpdateImageWindowSize"
        />
        <CloseOutlined />
        <a-input
          style="width: 100%"
          class="input"
          v-model:value.number="height"
          placeholder="高度(不能为0)"
          @blur="handleUpdateImageWindowSize"
          @pressEnter="handleUpdateImageWindowSize"
        />
      </a-space>

      <div class="label">调整图片位置</div>
      <div class="position-area">
        <div class="position-ctrl">
          <div>
            <a-button :icon="h(UpOutlined)" @click="handleWindowMove('top')"></a-button>
          </div>
          <div>
            <a-button :icon="h(LeftOutlined)" @click="handleWindowMove('left')" />
            <a-button :icon="h(RightOutlined)" @click="handleWindowMove('right')" />
          </div>
          <div>
            <a-button :icon="h(DownOutlined)" @click="handleWindowMove('bottom')" />
          </div>
        </div>

        <a-space-compact block class="position-input" direction="vertical" size="0">
          <a-input-number
            v-model:value="mainWindowPosition.x"
            addon-before="X"
            :min="0"
            :step="10"
            @change="handleImageWindowPosXChange"
            @step="handleImageWindowPosXChange"
          />
          <div style="height: 20px"></div>
          <a-input-number
            v-model:value="mainWindowPosition.y"
            addon-before="Y"
            :min="0"
            :step="10"
            @change="handleImageWindowPosYChange"
            @step="handleImageWindowPosYChange"
          />
        </a-space-compact>
      </div>

      <div class="label">清空图片</div>
      <div>
        <a-button block danger :icon="h(ClearOutlined)" @click="handleClear"> 清空 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { h } from 'vue';
import {
  CloseOutlined,
  ClearOutlined,
  DownOutlined,
  UpOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue';
import { Events } from '@events/index';
import { AppIpcRenderer } from './app-ipc';
import { BrowserWindow } from 'electron';

interface ISize {
  width: number;
  height: number;
}

const opacity = ref(96);
const width = ref(600);
const height = ref(600);

const mainWindowPosition = ref({
  x: 0,
  y: 0
});

const offset = ref(1);

onMounted(async () => {
  let [x, y] = await window.api.getImageWindowPosition();

  mainWindowPosition.value = { x, y };

  AppIpcRenderer.on(Events.UPDATE_HANDLE_WINDOW_SIZE_VALUE, (_, payload: ISize) => {
    width.value = payload.width;
    height.value = payload.height;
  });

  AppIpcRenderer.on(Events.IMAGE_WINDOW_MOVED, (_, payload) => {
    mainWindowPosition.value = { x: payload.x, y: payload.y };
  });

  AppIpcRenderer.on(Events.IMAGE_WINDOW_RESIZED, (_, payload) => {
      width.value = payload.width;
      height.value = payload.height;
  });
});

/**
 * @description: 更新透明度
 * @return {*}
 */
const handleUpdateOpacity = () => {
  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_OPACITY, 'handle.vue-handleUpdateOpacity', {
    opacity: opacity.value / 100
  });
};

/**
 * @description: 更新视窗尺寸
 * @return {*}
 */
const handleUpdateImageWindowSize = () => {
  if (width.value == 0 || height.value == 0) return;
  setWidthHeightValue(width.value, height.value);

  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_SIZE, 'handle.vue-handleUpdateImageWindowSize', {
    width: width.value,
    height: height.value
  });
};

/**
 * @description: 设置宽高
 * @return {*}
 */
const setWidthHeightValue = (w, h) => {
  width.value = w;
  height.value = h;
};

/**
 * @description: 移动窗口
 * @param {*} position
 * @return {*}
 */
const handleWindowMove = async position => {
  let [x, y] = await AppIpcRenderer.invoke(Events.GET_IMAGE_WINDOW_POSITION);

  mainWindowPosition.value = { x, y };

  let pos = {};

  if (position == 'top') {
    pos = {
      x: mainWindowPosition.value.x,
      y: (y -= offset.value)
    };
  } else if (position == 'bottom') {
    pos = {
      x: mainWindowPosition.value.x,
      y: (y += offset.value)
    };
  } else if (position == 'left') {
    pos = {
      x: (x -= offset.value),
      y: mainWindowPosition.value.y
    };
  } else if (position == 'right') {
    pos = {
      x: (x += offset.value),
      y: mainWindowPosition.value.y
    };
  }

  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_POSITION, 'handle.vue-handleWindowMove', pos);
};

const handleImageWindowPosXChange = async val => {
  mainWindowPosition.value.x = val;

  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_POSITION, 'handle.vue-handleWindowMove', {
    x: val ? val : 0,
    y: mainWindowPosition.value.y
  });
};

const handleImageWindowPosYChange = async val => {
  mainWindowPosition.value.y = val;

  AppIpcRenderer.send(Events.UPDATE_IMAGE_WINDOW_POSITION, 'handle.vue-handleWindowMove', {
    x: mainWindowPosition.value.x,
    y: val ? val : 0
  });
};

const handleClear = () => {
  setWidthHeightValue(600, 600);
  AppIpcRenderer.send(Events.CLEAR_IMAGE, 'handle.vue-handleClear');
};

defineExpose({
  setWidthHeightValue
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
      width: 100%;
      padding-right: 5px;
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

  :deep(.ant-space-item) {
    &:first-child {
      width: 100%;
    }

    &:last-child {
      width: 100%;
    }
  }
}

.position-area {
  display: flex;
  .position-ctrl {
    display: inline-block;
    margin-bottom: 15px;

    > div {
      display: flex;
      justify-content: center;
      width: 100px;

      &:first-child,
      &:last-child {
        align-items: center;
        justify-content: center;
      }

      &:nth-child(2) {
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .position-input {
    padding-left: 40px;
    padding-top: 6px;
  }
}
</style>
