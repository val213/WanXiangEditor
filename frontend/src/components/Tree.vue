<!-- Tree.vue -->
<template>
        <a-collapse :default-active-key="[]" :bordered="false">
          <a-collapse-item header="OPEN EDITORS" :style="customStyle" key="1">
            <div>TODO: TO BE LOAD</div>
            <div>TODO: TO BE LOAD</div>
          </a-collapse-item>
          <a-collapse-item header="DEFAULT PROJECT NAME (to be changed) " :style="customStyle" :key="2" @change.stop>
            <div>
              <a-collapse-item header="DEFAULT PROJECT NAME (to be changed) " :style="customStyle" :key="2" @change.stop>
                <div>TODO: TO BE LOAD</div>
                <div>TODO: TO BE LOAD</div>
              </a-collapse-item>
            </div>
          </a-collapse-item>
          <a-collapse-item header="OUTLINE" :style="customStyle" key="3">
            <div>TODO: TO BE LOAD</div>
            <div>TODO: TO BE LOAD</div>
          </a-collapse-item>
          <a-collapse-item header="TIME LINE" :style="customStyle" key="4">
            <div>TODO: TO BE LOAD</div>
            <div>TODO: TO BE LOAD</div>
          </a-collapse-item>
        </a-collapse>
      </template>
<script>
export default {
  setup() {
    const customStyle = {
      borderRadius: '6px',
      marginBottom: '10px',
      border: 'none',
      overflow: 'hidden',
    }

    return {
      customStyle
    }
  }
}
</script>