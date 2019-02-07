<template>
    <div id="app">
      <chatRoom :res="res"></chatRoom>
      <!--<alan_pagination></alan_pagination>-->
      <alan_pagination :total="55" :current="4" />
    </div>
</template>

<script>
	import chatRoom from "./components/socket_pc/socket_pc";
  import Alan_pagination from "./components/pagination/pagination";


	export default {
		components: {Alan_pagination, chatRoom},
		name: 'app',
		data() {
			return {
			}
		},
    methods:{
      res(data){
        console.log(data)
      }
    }
	}
</script>

<style lang="less">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
    *{
      box-sizing: border-box;
    }
</style>
