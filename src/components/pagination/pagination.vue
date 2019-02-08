<template>
    <div class="alan_pagination">
      <div class="alan_pagination_btn">
        <span class="icon_left" @click="currentPage!==1&&handleClick(currentPage-1)"><</span>
        <span v-for="(v,i) in pageItems" :key="i" :class="{'noCli': v=='...', 'active':v == currentPage}" @click="v!=='...'&&handleClick(v)">{{v}}</span>
        <span class="icon_right" @click="currentPage!==Math.ceil(total/currentPageSize)&&handleClick(currentPage+1)">></span>
      </div>
      <div class="alan_pagination_inp">
        <span>跳至</span>
        <al_input :width="60" :value="currentPage" :enter="handleClick" :limit="['int']" ref="inp"></al_input>
        <span>页</span>
      </div>
    </div>
</template>

<script>
  import al_input from "../input/input.vue";


  export default {
	  name: 'alan_pagination',
    props: {
	    current: {type: Number, default: 1}, // 当前是第几页
	    total: {type: Number, default: 0}, // 数据总量
      pageSize: {type: Number, default: 10}, // 一页显示的数量
      onChange: {type: Function, }, // 改变页数的事件
    },
    components:{al_input},
		data() {
			return {
			  currentPage: this.current,
        currentPageSize: this.pageSize,
        pageItems: [], // 存放分页器号码选项
        maxPage: 0,
      }
		},
		computed: {},
		watch: {
      total (val) {
        let maxPage = Math.ceil(val / this.currentPageSize);
        if (maxPage < this.currentPage ) {
          this.currentPage = (maxPage === 0 ? 1 : maxPage);
        }
      },
      current(val){
        this.currentPage = Number(val) // 强制转换成数字
        this.init()
      },
      pageSize(val){
        this.currentPageSize = val
      },
    },
		methods: {
	    // 创建分页item
	    creatItem(){
        // 这里要注意：分页器最多显示5个数字 其他用...代替
        let maxPage = Math.ceil(this.total/this.currentPageSize)
        let arr
        if(maxPage<5){ // 小于5页就直接展示出来
          arr = Array.from({length:maxPage}).map((v,i)=>i+1) // 快速生成自然数的方法
        }else{
          switch (this.currentPage) {
            case 1:
              arr = [1,2,3,'...',maxPage]
              break
            case maxPage:
              arr = [1,'...',maxPage-2,maxPage-1,maxPage]
              break
            default:
              arr = [this.currentPage-1,this.currentPage,this.currentPage+1];
              (this.currentPage-2 > 1) && arr.unshift('...');
              (this.currentPage-1 != 1) && arr.unshift(1);
              (this.currentPage+2 < maxPage) && arr.push('...');
              (this.currentPage+1 != maxPage) && arr.push(maxPage);
              break
          }
        }
        this.pageItems = arr
      },
      // 改变页数的事件
      handleClick(i){
	      let maxPage = Math.ceil(this.total/this.currentPageSize)
	      i<1 && (i = 1)
	      i>maxPage && (i = maxPage)
        this.$refs.inp.inputData = i // 重置一下输入框中的数字
	      typeof (this.onChange) == 'function' && this.onChange(i)
      },

	    init(){
	      this.creatItem() // 创建分页item
      }
    },
		created() {
	    this.init()
		},
		mounted() {
		},
	}
</script>

<style lang='less' scoped>
  .alan_pagination{
    font-family: Monospaced Number;
    .flexBox();
    .alan_pagination_btn{
      .flexBox();
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      span{
        .flexBox();
        width: 32px;
        height: 32px;
        .bor(@borColor);
        border-radius: 4px;
        margin-right: 5px;
        cursor: pointer;
        color: @fontColor;
        font-size: 14px;
        &.noCli{
          cursor: unset;
          color: #ccc;
          border: none;
          font-size: 22px;
          letter-spacing: 1px;
          font-weight: 600;
          padding-bottom: 12px;
        }
        &.active{
          border-color: @themeColor;
          color: @themeColor;
        }
        &:hover:not(.noCli){
          border-color: @themeColor;
          transition: border 0.5s;
        }
      }
    }
    .alan_pagination_inp{
      .flexBox();
      font-size: 14px;
      margin-left: 15px;
    }
  }
</style>
