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
      <a-space block class="window-size-input-area">
        <a-input
          style="width: 100%"
          class="input"
          v-model:value.number="width"
          placeholder="宽度(不能为0)"
          @blur="handleWindowUpdateSize"
          @pressEnter="handleWindowUpdateSize"
        />
        <CloseOutlined />
        <a-input
          style="width: 100%"
          class="input"
          v-model:value.number="height"
          placeholder="高度(不能为0)"
          @blur="handleWindowUpdateSize"
          @pressEnter="handleWindowUpdateSize"
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
            @change="handleWindowUpdatePositionChangeX"
            @step="handleWindowUpdatePositionX"
          />
          <div style="height: 20px"></div>
          <a-input-number
            v-model:value="mainWindowPosition.y"
            addon-before="Y"
            :min="0"
            :step="10"
            @change="handleWindowUpdatePositionChangeY"
            @step="handleWindowUpdatePositionY"
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
  let [x, y] = await window.api.getMainWindowPosition();

  mainWindowPosition.value = { x, y };

  window.electronApi.ipcRenderer.on('set-panel-width-height', (_, data: ISize) => {
    width.value = data.width;
    height.value = data.height;
  });

  window.electronApi.ipcRenderer.on('main-window-moved', (_, { x, y }) => {
    mainWindowPosition.value = { x, y };
  });

  window.electronApi.ipcRenderer.on('main-window-resized', (_, data) => {
    console.log(`窗口大小变为: width=${data.width}, height=${data.height}`);
    width.value = data.width;
    height.value = data.height;
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

const handleWindowMove = async position => {
  let [x, y] = await window.api.getMainWindowPosition();

  mainWindowPosition.value = { x, y };

  if (position == 'top') {
    // window.electronApi.ipcRenderer.send('set-main-window-position', x, (y -= offset.value));
    setWindowPositionTop(y);
  } else if (position == 'bottom') {
    // window.electronApi.ipcRenderer.send('set-main-window-position', x, (y += offset.value));
    setWindowPositionBottom(y);
  } else if (position == 'left') {
    // window.electronApi.ipcRenderer.send('set-main-window-position', (x -= offset.value), y);
    setWindowPositionLeft(x);
  } else if (position == 'right') {
    // window.electronApi.ipcRenderer.send('set-main-window-position', (x += offset.value), y);
    setWindowPositionRight(x);
  }
};

const setWindowPositionLeft = x => {
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    (x -= offset.value),
    mainWindowPosition.value.y
  );
};

const setWindowPositionRight = x => {
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    (x += offset.value),
    mainWindowPosition.value.y
  );
};

const setWindowPositionTop = y => {
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    mainWindowPosition.value.x,
    (y -= offset.value)
  );
};

const setWindowPositionBottom = y => {
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    mainWindowPosition.value.x,
    (y += offset.value)
  );
};

const handleWindowUpdatePositionChangeX = async val => {
  mainWindowPosition.value.x = val;
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    val ? val : 0,
    mainWindowPosition.value.y
  );
};

const handleWindowUpdatePositionChangeY = async val => {
  mainWindowPosition.value.y = val;
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    mainWindowPosition.value.x,
    val ? val : 0
  );
};

const handleWindowUpdatePositionX = async val => {
  mainWindowPosition.value.x = val;
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    val ? val : 0,
    mainWindowPosition.value.y
  );
};

const handleWindowUpdatePositionY = async val => {
  mainWindowPosition.value.y = val;
  window.electronApi.ipcRenderer.send(
    'set-main-window-position',
    mainWindowPosition.value.x,
    val ? val : 0
  );
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
