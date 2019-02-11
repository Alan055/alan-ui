<template>
    <div class="wrap" :style="`width:${size}px;`">
        <!-- .sync：子组件is-show值改变后，父组件is-show值立马改变 -->
        <!-- <select-input :is-show.sync="listShow" :title="title"></select-input>
        <list 
            v-show="listShow"
            :data="listData" 
            :input-val.sync="title"
            :is-show.sync="listShow"
            @changeTitle="titleHandle" ></list> -->
            <div class="selectInput" >
                <input type="text" readonly placeholder="请选择" :value="title" @click="showListHandle" :class="listShow?'active':''">
                <icon type="ios-arrow-down" size="18" class="icon_drop" :class="listShow?'icon_drop_active':''" :on-click="showListHandle"></icon>
            </div>
            <div class="list" @changeTitle="titleHandle"  :class="listShow?'showListactive':''" >
                <p v-for="(item,idx) in listData" :key="idx" @click="getTitleHandle(item,idx)" :class="idx===active?'active':''">{{item.label}}</p>
            </div>
    </div>
</template>
<script>
    import icon from '../icon/icon'

    export default {
        name:'Header',
        props: {
            optionlist: Array,
            size: {type: [Number,String], default: 200},
        },
        data(){
            return {
                listData:this.optionlist,
                listShow:false,
                title:'',
                active:-1
            }
        },
        components:{
            icon
        },
        methods:{
            showListHandle(){
                this.listShow = !this.listShow
                this.isInput = true
            },
            getTitleHandle(item,i){
                this.active = i
                this.title = item.label
                this.listShow = false
            },
            titleHandle(val){
                this.title = val.name
                this.listShow = val.initShow
                // console.log(this.optionlist);
            }
        },
        mounted() { 
            document.addEventListener('click', (e) => { 
                if (!this.$el.contains(e.target)) this.listShow = false 
            }) 
        }
    }
</script>
<style lang="less" scoped>
    .wrap{
        // width:200px;
        .selectInput{
            display: inline-block;
            width: 100%;
            height: 32px;
            box-sizing: border-box;
            vertical-align: middle;
            color: @fontColor;
            font-size: 14px;
            line-height: normal;
            box-sizing: border-box;
            position: relative;
            // transition: all .2s ease-in-out;
            input{
                width: 100%;
                height: 100%;
                line-height: 100%;
                cursor: pointer;
                outline: 0;
                padding-left: 5px;
                background-color: #fff;
                border-radius: 4px;
                border: 1px solid @borColor;
                .bor(@borColor);
                border-radius: 4px;
                height: 32px;
                .borHover();
                // &:hover{
                //     border-color: @themeColor;
                //     outline: 0;
                //     box-shadow: 0 0 0 2px rgba(45,140,240,.2);
                // }
            }
            .active{
                border-color: @themeColor;
                outline: 0;
                box-shadow: 0 0 0 2px rgba(45,140,240,.2);
            }
            .icon_drop{
                width: 18px;
                position: absolute;
                top: 8px;
                right: 6px;
                transform: rotate(0deg);
                transition: all 0.5s;
            }
            .icon_drop_active{
                top: 6px;
                transform: rotate(180deg);
                transition: all 0.5s;
            }
        }
        .list{
            width: inherit;
            // max-height: 200px;
            height: 0px;
            font-size: 14px;
            overflow: auto;
            margin: 5px 0;
            background-color: #fff;
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            position: absolute;
            z-index: 900;
            transition: all 0.5s;
            opacity: 0;
            .al_scorll();
            &.showListactive {
                height: 200px;
                padding: 5px 0;
                opacity: 1;
            }
            p{
                margin: 0;
                padding: 7px 5px;
                text-align: left;
                &:hover{
                    color: @themeColor;
                    background: #f3f3f3;
                    cursor: pointer;
                }
            }
            .active{
                color: @themeColor;
                background: #f3f3f3;
                cursor: pointer;
            }
        }
    }
    // ::-webkit-scrollbar {
    //     width:6px;
    // }
    // ::-webkit-scrollbar-thumb {
    //     border-radius:10px;
    //     background:rgba(0,0,0,0.1);
    //     -webkit-box-shadow:inset006pxrgba(0,0,0,0.5);
    // }
</style>