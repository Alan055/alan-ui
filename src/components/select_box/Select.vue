<template>
    <div class="wrap">
        <!-- <select-input :is-show.sync="listShow" :title="title"></select-input> -->
        <!-- <list 
            v-show="listShow"
            :data="listData" 
            :input-val.sync="title"
            :is-show.sync="listShow"
            @changeTitle="titleHandle" ></list> -->
        <div class="selectInput" >
            <input type="text" readonly placeholder="请选择" :value="title" @click="showListHandle" :class="listShow?'active':''">
            <img src="./icon_the_drop-down@3x.png" alt="" class="icon_drop" :class="listShow?'icon_drop_active':''">
        </div>
        <div class="list" v-show="listShow"
            :data="listData" :input-val.sync="title" :is-show.sync="listShow" @changeTitle="titleHandle">
            <p v-for="(item,idx) in data" :key="idx" @click="getTitleHandle(item,idx)" :class="idx===active?'active':''">{{item.label}}</p>
        </div>
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
            showListHandle(){
                // this.$emit('update:isShow',this.initShow)
            },
            getTitleHandle(item,i){
                // this.$emit('update:inputVal',item.name)
                // this.$emit('update:isShow',this.initShow)
                this.active = i
                // this.$emit('changeTitle',{name:item.label,initShow:this.initShow})
            },
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
    }
    ::-webkit-scrollbar {
        width:6px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius:10px;
        background:rgba(0,0,0,0.1);
        -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
    }
</style>