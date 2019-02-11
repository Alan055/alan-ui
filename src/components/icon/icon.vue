<template>
  <i class="alan_icon" @click.stop="hand()" :class="`iconfont icon-${type}`" :style="`font-size: ${size}px;cursor: ${onClick?'pointer':'unset'}`"></i>
</template>

<script>
	export default {
	  props:{
      type: {type: String, default: ''},
      size: {type: [Number,String], default: 14},
      onClick: {type: Function, default: null }
    },
	  name: 'Icon',
		data() {
			return {}
		},
		computed: {},
		watch: {},
		methods: {
	    hand(){
        this.onClick && this.onClick()
      }
    },
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='less' scoped>
  .alan_icon{
  }
</style>
