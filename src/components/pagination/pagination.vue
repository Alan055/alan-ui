<template>
    <div class="alan_pagination">
      <div class="alan_pagination_btn">
        <span class="icon_left"><</span>
        <span v-for="(v,i) in pageItems" :key="i" :class="{'noCli': v=='...', 'active':v == currentPage}">{{v}}</span>
        <span class="icon_right">></span>
      </div>
      <div class="alan_pagination_inp">
        <span>跳至</span>
        <al_input></al_input>
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
    },
    components:{al_input},
		data() {
			return {
			  currentPage: this.current,
        currentPageSize: this.pageSize,
        pageItems: [], // 存放分页器号码选项
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
        this.currentPage = val
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
        switch (this.currentPage) {
          case 1:
            arr = [1,2,3,'...',maxPage]
            break
          case maxPage:
            arr = [1,'...',maxPage-2,maxPage-1,maxPage]
            break
          default:
            arr = [this.currentPage-1,this.currentPage,this.currentPage+1];
            (this.currentPage-1 != 1) && (arr.unshift('...'),arr.unshift(1));
            (this.currentPage+1 != maxPage) && (arr.push('...'),arr.push(maxPage));
            break
        }
        this.pageItems = arr
        console.log(this.pageItems)
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
    }
  }
</style>
