<template>
  <div class="alan_input">
    <b @click="inputData=''">x</b>
    <input type="text" v-model="inputData">
  </div>
</template>

<script>
	export default {
		name:'alan_input',
		data() {
			return {
				inputData:''
      }
		},
		computed: {},
		watch: {},
		methods: {},
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='less' scoped>
  *{
    box-sizing: border-box;
  }
  .alan_input {
    display: inline-block;
    position: relative;
    width: 150px;
    height: 28px;
    b {
      position: absolute;
      right: 3px;
      top: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 22px;
      height: 22px;
      background: #ccc;
      border-radius: 50%;
      cursor: pointer;
      color: #fff;
    }
    input {
      display: inline-block;
      border-radius: 4px;
      width: 100%;
      height: 100%;
      outline: none;
      margin: 0px;
      padding: 0;
      border: 1px solid #ccc;
      padding-left: 10px;
      &:hover{
        border-color: #f00;
      }
    }
  }
</style>