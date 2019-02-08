<template>
    <div id="app">
      <chatRoom :res="res"></chatRoom>
      <!--<alan_pagination></alan_pagination>-->
      <!-- <alan_pagination :total="55" :current="4" /> -->
      <!-- <alan_pagination :total="8" :current="page" :onChange="tt" /> -->
      <select_box :optionlist="citylist"></select_box>
    </div>
</template>

<script>
	import chatRoom from "./components/socket_pc/socket_pc";
  import Alan_pagination from "./components/pagination/pagination";
  import select_box from "./components/select_box/Select";


	export default {
		components: {
            Alan_pagination,
            chatRoom,
            select_box
        },
		name: 'app',
		data() {
			return {
                page:1,
                citylist: [
                    {
                    value: 'beijing',
                    label: '������'
                    },
                    {
                    value: 'shanghai',
                    label: '�Ϻ���'
                    },
                    {
                    value: 'shenzhen',
                    label: '������'
                    },
                    {
                    value: 'hangzhou',
                    label: '������'
                    },
                    {
                    value: 'nanjing',
                    label: '�Ͼ���'
                    },
                    {
                    value: 'chongqing',
                    label: '������'
                    }
                ]
			}
		},
    methods:{
      res(data){
        console.log(data)
      },
      tt(i){
        this.page = i
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
