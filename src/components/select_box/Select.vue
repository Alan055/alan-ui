<template>
    <div class="wrap">
        <!-- .sync：子组件is-show值改变后，父组件is-show值立马改变 -->
        <select-input :is-show.sync="listShow" :title="title"></select-input>
        <list
            v-show="listShow"
            :data="listData"
            :input-val.sync="title"
            :is-show.sync="listShow"
            @changeTitle="titleHandle" ></list>
    </div>
</template>
<script>
    import List from './List'
    import SelectInput from './SelectInput'

    // let listData = [
    //     {name:'语文'},
    //     {name:'数学'},
    //     {name:'英语'},
    //     {name:'生物'},
    //     {name:'物理'}
    // ]

    export default {
        name:'Header',
        props: {
            // placeholder: {
            // type: String,
            // required: false,
            // default: 'Select'
            // },
            // multiple: {
            // type: Boolean,
            // required: false,
            // default: false
            // },
            optionlist: Array
        },
        data(){
            return {
                listData:this.optionlist,
                listShow:false,
                title:''
            }
        },
        components:{
            SelectInput,
            List
        },
        methods:{
            titleHandle(val){
                // console.log(val)
                this.title = val.name
                this.listShow = val.initShow
                // console.log(this.optionlist);
            }
        }
    }
</script>
<style lang="less" scoped>
    .wrap{
        width:200px;
      .al_scorll();
    }
    /*::-webkit-scrollbar {*/
        /*width:6px;*/
    /*}*/
    /*::-webkit-scrollbar-thumb {*/
        /*border-radius:10px;*/
        /*background:rgba(0,0,0,0.1);*/
        /*-webkit-box-shadow:inset006pxrgba(0,0,0,0.5);*/
    /*}*/
</style>
