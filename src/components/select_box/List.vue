<template>
    <div class="list">
        <p v-for="(item,idx) in data" :key="idx" @click="getTitleHandle(item,idx)" :class="idx===active?'active':''">{{item.label}}</p>
    </div>
</template>
<script>
    export default {
        name:'list',
        props:['data','isShow',],
        data(){
            return {
                active:-1
            }
        },
        computed:{
            initShow(){
                return !this.isShow
            }
        },
        methods:{
            getTitleHandle(item,i){
                // this.$emit('update:inputVal',item.name)
                // this.$emit('update:isShow',this.initShow)
                this.active = i
                this.$emit('changeTitle',{name:item.label,initShow:this.initShow})
            }
        }
    }
</script>
<style lang="less" scoped>
.list{
    width: inherit;
    max-height: 200px;
    overflow: auto;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    position: absolute;
    z-index: 900;
    .al_scorll();
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
</style>
