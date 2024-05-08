<!-- Tabs.vue -->
<template>
    <a-tabs 
        type="card-gutter"
        :active-key="nowTabKey"
        :editable="true"
        @add="handleAdd"
        @delete="handleDelete"
        auto-switch 
        show-add-button
    >
        <a-tab-pane 
        v-for="(item, index) of data"
        :key="item.key" 
        :title="item.title"
        :closable="index!==0"
        >
        <div 
              v-if="item.editing" 
              @blur="removeEditable(index, $event)"
              contenteditable="true"
              ref="editableTitle"
              class="editable-title"
            > 
              {{item.title}}
            </div>
            <span 
              v-else 
              @dblclick="makeEditable(index)"
            >
              {{item.title}}
                </span>

        </a-tab-pane>
    </a-tabs>
</template>

<script>
import { ref } from 'vue';

let count = 1;

export default {
  props: {
    nowTabKey: String,
  },
  setup(props, context) {
    const data = ref([
      {
        key: '1', // 键值从1开始，规定好，在主组件中tabKey也是1开始
        title: '首页',
        editing:false,
      },
    ]);
    const handleAdd = () => {
      count++;
      data.value = data.value.concat({
        key: `${count}`,
        title: `Undifined` + count,
        editing:false,
      })

      // 通知父组件标签页要换了
      context.emit('tab-click', `${count}`);
    };
    const handleDelete = (key) => {
      // 删除键为key的项
      data.value = data.value.filter(item => item.key !== key)
      // 从sessionStroage中删除对应的数据
      sessionStorage.removeItem(key);

      if (key == props.nowTabKey)
        // 通知父组件标签页要换到上一个，-1表示是因为删除标签页而切换key的
        context.emit('tab-del');
    };
    const makeEditable = (index) => {
      data.value[index].editing = true;
    };
    const removeEditable = (index, event) => {
      data.value[index].editing = false;

      const newValue = event.target.innerText;
      
      // 更新名字
      data.value[index].title = newValue;
    };

    return {
      data,
      handleAdd,
      handleDelete,
      makeEditable,
      removeEditable,
    }
  },
}
</script>
