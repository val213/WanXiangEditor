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
        owner: '', // 表示此标签页的拥有者，在没有在线模式下，此标签页的拥有者就是本机登录的用户
        type: 'Notepad', // 标签页的类型
        cooperateCode: '', // 可选：表示标签的在线协作码
      },
    ]);
    const handleAdd = (filename, content, type ="Notepad", cooperateCode = '', user = '') => {
        // 如果传入了filename，而且是srting格式
        if (filename != ''&& typeof filename == 'string') {
            if (user == '') {
                user = localStorage.getItem('USERNAME');
            }

            // client.logger.info(filename);
            count++;
            data.value = data.value.concat({
                key: `${count}`,
                title: filename,
                user: user,
                type: type,
                cooperateCode: cooperateCode, 
            })
            // 添加用户名
            sessionStorage.setItem(`${count}`+'user', user);
            // 添加类型用来切换tab时识别tab所属的组件
            sessionStorage.setItem(`${count}`+'type', type);
            // 添加在线协作码
            sessionStorage.setItem(`${count}`+'cooperateCode', cooperateCode);
            // 如果传递了content，就存储到sessionStorage中
            if (content != undefined && content!=''&& typeof content == 'string') {
                sessionStorage.setItem(`${count}`, content);
            }
            // 通知父组件标签页要换了
            context.emit('tab-add', `${count}`);
            // 通知父组件换标题
            context.emit('updateTitle', filename);
        } 
        else if(content == undefined){
            count++;
            data.value = data.value.concat({
                key: `${count}`,
                title: `Undifined` + count,
                editing:false,
                type: "Notepad"
            })
            sessionStorage.setItem(`${count}`, 'Undifined' + count);
            //添加类型用来切换tab时识别tab所属的组件
            sessionStorage.setItem(`${count}`+'type', "Notepad");
            // 通知父组件标签页要换了
            context.emit('tab-click', `${count}`, "Notepad");
        }
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
