<!-- Tabs.vue -->
<template>
  <a-tabs type="card-gutter" :editable="true" @add="handleAdd" @delete="handleDelete"  auto-switch show-add-button>
    <a-tab-pane v-for="item of data" :key="item.key" :title="item.title">
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { ref } from 'vue';

let count = 1;

export default {
  setup() {
    const data = ref([
      {
        key: 'Undifned',
        title: 'Undifned',
      },
    ]);
    // show-add-button 属性在a-tabs 中被关闭，handleAdd不可用。
    const handleAdd = () => {
      count++;
      data.value = data.value.concat({
        key: `${count}`,
        title: `Undifined`,
      })
    };
    const handleDelete = (key) => {
      data.value = data.value.filter(item => item.key !== key)
    };

    return {
      data,
      handleAdd,
      handleDelete,
    }
  },
}
</script>
