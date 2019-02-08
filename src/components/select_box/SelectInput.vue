<template>
    <div class="selectInput">
        <input type="text" readonly placeholder="请选择" :value="title" @click="showListHandle" :class="isShow?'active':''">
        <img src="./icon_the_drop-down@3x.png" alt="" class="icon_drop" :class="isShow?'icon_drop_active':''">
    </div>
</template>
<script>
export default {
    name:'input',
    props:['isShow','title'],
    data(){
        return {}
    },
    computed:{
        initShow(){
            return !this.isShow
        }
    },
    methods:{
        showListHandle(){
            this.$emit('update:isShow',this.initShow)
        }
    }
}
</script> 
<style lang="less" scoped>
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
        &:hover{
            border-color: @themeColor;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(45,140,240,.2);
        }
    }
    .active{
        border-color: @themeColor;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45,140,240,.2);
    }
    .icon_drop{
        width: 18px;
        position: absolute;
        top: 12px;
        right: 6px;
        transform: rotate(0deg);
        transition: all 0.5s;
    }
    .icon_drop_active{
        top: 10px;
        transform: rotate(180deg);
        transition: all 0.5s;
    }
}
</style>
