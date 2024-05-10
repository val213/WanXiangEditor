<template>
    <div id="vue-pdf-viewer">
        <div id="pdf-viewer">
            <vuePdfEmbed 
            :source="pdfState.pdfSource" 
            :page="pdfState.pageNum"
            />
        </div>
    </div>
</template>

<script>
    import VuePdfEmbed from 'vue-pdf-embed';
    import { reactive, watch } from 'vue';
    export default {
        components: {
            VuePdfEmbed
        },
        props: {
            pdfSource: {
                type: String,
                require: true
            }
        },
        setup(props) {
            const pdfState = reactive({
                pdfSource: props.pdfSource,
                pdfNum: 1,
                pdfPages: 1,
            });
            watch(() => props.pdfSource, (newVal) => {
                console.log("pdffresh");
                pdfState.pdfSource = newVal;
            });
            //console.log("2222222"+props.pdfSource);
            return {
                pdfState,
            }
        },
    }
    

</script>

<style>
#vue-pdf-view {
    position: fixed;
    left: 50%;
    transform: translateX(-50%) scale(1.0);
    width: fit-content;
    height: max-content;
    text-align: start;

    /* 内容溢出显示滚动条 */
    overflow: scroll;
    /* 隐藏x、y轴滚动条 */
    overflow-y: hidden;
    overflow-x: hidden;
}

/* 设置滚动栏的宽、高 */
#vue-pdf-view::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

/* 设置滚动条的样式 */
#vue-pdf-view::-webkit-scrollbar-thumb {
    border-radius: 15px;
    background-color: #eee;
}

/* 鼠标经过滚动条变换颜色 */
#vue-pdf-view::-webkit-scrollbar-thumb:hover {
    background-color: #CBCBFF;
}
</style>
