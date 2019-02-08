<template>
  <div class="alan_input">
    <div class="box" :style="`width:${width}px;`" tabindex="1">
      <input type="text" v-model="inputData" @keyup.enter="enter&&enter(inputData)" >
      <em class="" v-if="icon"></em>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'alan_input',
    props: {
      width: {type: Number, default: 200}, // 输入框的宽度  默认200px
      value: {}, // 默认值
      icon: {type: String, default: ''}, // 右侧的小图标
      limit: {type: Array, default: []}, // 输入框限制的条件  有中文  数子、整数  英文  四个条件 Number zh en int
      enter: {type: Function,}, // 输入框的回车事件
      maxlen: {type: Number,}, // 允许输入的最大长度
      maxvalue: {type: Number,}, // 允许输入的最大数字 说明这里只能输入数字
    },
    data() {
      return {
        inputData: this.value,
      }
    },
    computed: {},
    watch: {
      value(val){
        this.inputData = val
      },
      inputData(cur, bef) {
        // 先校验长度
        if(this.maxlen && String(cur).length > this.maxlen){
          this.inputData = bef
          return // 直接return掉 后面的不需要再验证了 因为监听的试试前面已经验证过了
        }
        // 再验证 是否有最大值 有最大值就是强制限制了Number类型 还要验证是否是整数
        if(this.maxvalue){
          let reg
          if(this.limit.includes('int')){
            reg = /^[0-9]*$/
          }else{
            reg = /^[0-9]+.?[0-9]*$/
          }
          if(!reg.test(cur)) return this.inputData = bef // 到此验证完了数字
          if(cur > this.maxvalue) return this.inputData = Math.floor(this.maxvalue) // 超过最大值 就锁定在最大值
        }
        // 最后验证限制条件 条件有：Number int (选其一) zh en
        // 首先验证中文  这里中文是最高级别，有这个条件就只能输入中文 不能输入其他数字和英文  但是可以输入中文之间的哪个·
        if(this.limit.includes('zh')){
          let reg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
          if(!reg.test(cur)) this.inputData = bef
          return // 不需要再验证其他的条件了
        }
        // 然后是验证数字 可以加小数点的
        if(this.limit.includes('Number')){
          let reg = /^[0-9]+.?[0-9]*$/
          if(!reg.test(cur))  this.inputData = bef
          return // 当然这里能输入小数点  肯定就不能在输入英文了！所有这个级别也是比较高的
        }
        // 最后是验证整数和字符串的单独、组合情况
        let reg
        if(this.limit.includes('int')&&!this.limit.includes('en')) { // 只有整数 这里不要判断是否有最大值的情况了
          reg = new RegExp(/^[0-9]*$/)
        }else if(!this.limit.includes('int')&&this.limit.includes('en')) { // 只有英文
          reg = /^[a-zA-Z]*$/
        }else if(this.limit.includes('int')&&this.limit.includes('en')) { // 有英文和数字的组合
          reg = /^[0-9a-zA-Z]*$/
        }
        !reg.test(cur) && (this.inputData = bef) // 判断
      }
    },
    methods: {
    },
    created() {
    },
    mounted() {
    },
  }
</script>

<style lang='less' scoped>
  .alan_input {
    .flexBox();
    padding: 0 4px;

    .box {
      .flexBox();
      width: 100px;

      input {
        padding: 0 7px;
        width: 100%;
        border: none;
        outline: none;
        color: #333;
        .bor(@borColor);
        border-radius: 4px;
        height: 32px;
        .borHover();

        &:focus {
          border-color: @themeColor;
          box-shadow: 0px 0px 2px #d9e9fc;
        }
      }

      em {

      }
    }
  }
</style>
