<template>
  <div id="app">
    <!--<chatRoom :res="res"></chatRoom>-->
    <!--<alan_pagination></alan_pagination>-->
    <!-- <alan_pagination :total="8" :current="page" :onChange="tt" /> -->
    <select_box :optionlist="citylist"></select_box>
    <icon type="ios-arrow-down" size="18" ></icon>
    <alan_input icon="ios-add-circle-outli" :on-click="testClick"></alan_input>
  </div>
</template>

<script>
  // import chatRoom from "./components/socket_pc/socket_pc";
  // import Alan_pagination from "./components/pagination/pagination";
  import select_box from "./components/select_box/Select";
  import icon from "./components/icon/icon";
  import alan_input from "./components/input/input";



  export default {
    components: {
      // Alan_pagination,
      // chatRoom,
      select_box,
      icon,
      alan_input,
    },
    name: 'app',
    data() {
      return {
        page: 1,
        citylist: [
          {
            value: 'beijing',
            label: '北京市'
          },
          {
            value: 'shanghai',
            label: '上海市'
          },
          {
            value: 'shenzhen',
            label: '深圳市'
          },
          {
            value: 'hangzhou',
            label: '杭州市'
          },
          {
            value: 'nanjing',
            label: '南京市'
          },
          {
            value: 'chongqing',
            label: '重庆市'
          }
        ]
      }
    },
    methods: {
      res(data) {
        console.log(data)
      },
      tt(i) {
        this.page = i
      },
      testClick(){
        console.log("123")
      }
    }
  }
</script>

<style lang="less">
  @import "./fonts/iconfont.css";
  * {
    box-sizing: border-box;
  }
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
</style>
