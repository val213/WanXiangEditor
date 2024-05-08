<!-- Tabs.vue -->
<template>
    <a-tabs type="card" :active-key="nowTabKey" :editable="true" :animation="true" :justify="false" :hide-content="true"
        :header-padding="false" :ref="tabsRef" @add="() => handleAdd('')" @delete="handleDelete" auto-switch
        show-add-button>
        <a-tab-pane v-for="(item, index) of data" :key="item.key" :title="item.title" :closable="index !== 0">
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
            },
        ]);

        const handleAdd = (filename, content) => {
            if (filename != '') {
                count++;
                data.value = data.value.concat({
                    key: `${count}`,
                    title: filename,
                })
                // 如果传递了content，就存储到sessionStorage中
                if (content != '') {
                    sessionStorage.setItem(`${count}`, content);
                }
                // 通知父组件标签页要换了
                context.emit('tab-add', `${count}`);
                // 通知父组件换标题
                context.emit('updateTitle', filename);
      
            } else {
                count++;
                data.value = data.value.concat({
                    key: `${count}`,
                    title: 'Untitled' + count,
                })

                // 通知父组件标签页要换了
                context.emit('tab-add', `${count}`);
                // 通知父组件换标题
                context.emit('updateTitle', 'Untitled' + count);

            }
        };

        const handleDelete = (key) => {
            // 删除键为key的项
            data.value = data.value.filter(item => item.key !== key)
            // 从sessionStroage中删除对应的数据
            sessionStorage.removeItem(key);

            if (key == props.nowTabKey) {
                // 通知父组件标签页要换到上一个，-1表示是因为删除标签页而切换key的, 先改为统一回到首页，因为下面
                context.emit('tab-del');
                // 通知父组件换上一个标题
                context.emit('updateTitle', '首页');
            }
            

        };

        return {
            data,
            handleAdd,
            handleDelete,
        }
    },
}
</script>