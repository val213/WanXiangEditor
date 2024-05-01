<!-- Tabs.vue -->
<template>
  <a-tabs type="card-gutter" :editable="true" @add="handleAdd" @delete="handleDelete"  auto-switch>
    <a-tab-pane v-for="item of data" :key="item.key" :title="item.title">
      {{ item?.content }}
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const data = ref([
      {
        key: 'editor1.html',
        title: 'editor1.html',
        content: 'Content of Tab Panel 1'
      },
      {
        key: 'editor2.html',
        title: 'editor2.html',
        content: 'Content of Tab Panel 2'
      },
      {
        key: 'editor3.html',
        title: 'editor3.html',
        content: 'Content of Tab Panel 3'
      },
      {
        key: 'editor4.html',
        title: 'editor4.html',
        content: 'Content of Tab Panel 4'
      }

    ]);
// show-add-button 属性在a-tabs 中被关闭，handleAdd不可用。
    // const handleAdd = () => {
    //   count++;
    //   data.value = data.value.concat({
    //     key: `${count}`,
    //     title: `Undifined`,
    //     // 日志打印count
    //     content: `Content of New Tab Panel ${count}`
    //   })
    // };
    const handleDelete = (key) => {
      data.value = data.value.filter(item => item.key !== key)
    };

    return {
      data,
      handleDelete
    }
  },
}
</script>
