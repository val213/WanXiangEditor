<!-- Tabs.vue -->
<template>
  <a-tabs type="card-gutter" :editable="true" @add="handleAdd" @delete="handleDelete" show-add-button auto-switch>
    <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="item.title" :closable="index!==2">
      {{ item?.content }}
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { ref } from 'vue';

let count = 5;

export default {
  setup() {
    const data = ref([
      {
        key: '1',
        title: 'Tab 1',
        content: 'Content of Tab Panel 1'
      },
      {
        key: '2',
        title: 'Tab 2',
        content: 'Content of Tab Panel 2'
      },
      {
        key: '3',
        title: 'Tab 3',
        content: 'Content of Tab Panel 3'
      },
      {
        key: '4',
        title: 'Tab 4',
        content: 'Content of Tab Panel 4'
      }
    ]);

    const handleAdd = () => {
      const number = count++;
      data.value = data.value.concat({
        key: `${number}`,
        title: `Tab ${number}`,
        content: `Content of New Tab Panel ${number}`
      })
    };
    const handleDelete = (key) => {
      count--;
      data.value = data.value.filter(item => item.key !== key)
    };

    return {
      data,
      handleAdd,
      handleDelete
    }
  },
}
</script>
