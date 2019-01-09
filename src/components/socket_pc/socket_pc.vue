<template>
  <div class="chatRoomBox" :class="{'newMessage':newMessage}">
    <span v-if="!showRoom" class="door" @click="showRoom=true;IsAddRoom=true">
      <!--<img src="./img/chatRoom_show.png" alt="">-->
    </span>
    <div v-if="IsAddRoom" class="chatRoom" :class="{'closeRoom':!showRoom}" @mouseenter="mouseenter()"
         @mouseleave="mouseout()">
      <!--<span class="close" @click="showRoom=false">X</span>-->
      <div class="title">消息推送<span class="btn_title"><span @click="data=[]">清空</span><span
        @click="showRoom=false;newMessage=false">关闭</span></span></div>
      <div class="content" id="chatRoomScroll">
        <ul>
          <!--type=1是自己，自己的要放在右边-->
          <li v-for="(v,i) in data" :key="i" :class="{'right':v.type===1,'systemMessage':v.type===3}">
            <div class="box">
              <!--系统消息没有头像-->
              <!--<div class="headerImg" v-if="v.type!==3">-->
              <!--<img :src="v.type===1?'./static/chatRoom/other.png':'./static/chatRoom/mine.png'"-->
              <!--alt="">-->
              <!--</div>-->
              <!--非系统消息，聊天数据-->
              <div class="info" v-if="v.type!==3">
                <div class="top">
                  <!--这里时间暂时不加-->
                  <!--<span :class="v.type===1?'time':'name'">{{v.type===1?v.time:v.sendUin}}</span><span-->
                  <!--:class="v.type===1?'name':'time'">{{v.type===1?v.name:v.time}}</span>-->
                  <span>{{v.name}}</span>
                </div>
                <div class="message">{{v.text}}
                  <span :class="v.type===1?'triangle2':'triangle1'"></span>
                </div>
              </div>
              <!--系统消息-->
              <div v-else class="systemItem"
                   :class="{'withdraw':v.messageType===1,'recharge':v.messageType==0,'systemType':v.messageType==3}">
                <div class="systemTitle">{{v.messageType===0?'充值消息:':v.messageType===1?'提现消息:':v.messageType===2?'派奖消息:':v.messageType===3?'系统消息':''}}{{v.title}}<br>{{v.time}}
                </div>
                <div class="systemContent" v-html="v.text"></div>
              </div>

            </div>
          </li>
          <!--<li v-if="showNotice">-->
          <!--&lt;!&ndash;站内消息&ndash;&gt;-->
          <!--<ul class="noticeMain colorY bgcolorA" >-->
          <!--<li v-for="(v,i) in noticeList1" :key="i">-->
          <!--<a>系统消息 {{v && v.time}}</a>-->
          <!--<p class="color3">{{v && v.content}}</p>-->
          <!--</li>-->
          <!--</ul>-->
          <!--</li>-->
        </ul>
      </div>
      <!--<div class="edit">-->
      <!--&lt;!&ndash;这里的v-model不能加修饰符trim，不然当ctrl+enter的时候，添加\n来换行时不起效果，因为被修饰符trim删除了&ndash;&gt;-->
      <!--<textarea class="text" autofocus placeholder="ctrl+enter:换行" :class="{'close':close}" :disabled="close"-->
      <!--v-model="message" @keydown.ctrl="ctrlIsDown=true" @keyup.ctrl="ctrlKeyup()"-->
      <!--@keyup.ctrl.enter="newline()" @keyup.enter="!sendMessage(message)"></textarea>-->
      <!--<span class="send" :class="{'close':close}" @click="!close&&sendMessage(message)">发送</span>-->
      <!--</div>-->
    </div>
  </div>

</template>

<script>
  /*
  * 这个功能改了好多次
  * 由推送消息（websocket）组成
  *
   */
  import io from "./socket.io.js";

  //读cookie
  function getCookie(name) {
	  var strcookie = document.cookie;//获取cookie字符串
    if (strcookie) {
      var arrcookie = strcookie.split("; ");//分割
      //遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
          return arr[1];
        }
      }
    }
    return "";
  }

  //转换时间格式
  function tranlateDate(v) {
    let date = new Date(v);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 + '').padStart(2, '0') + '-';
    let D = date.getDate() + ' ';
    let h = (date.getHours() + '').padStart(2, '0') + ':';
    let m = (date.getMinutes() + '').padStart(2, '0') + ':';
    let s = (date.getSeconds() + '').padStart(2, '0');
    return Y + M + D + h + m + s;
  }

  export default {
    name: 'chatRoom_pc',
    props: ['res'], // 有消息发进来的时候  执行这个事件
    data() {
      return {
        newMessage: false,//是否有新消息
        IsAddRoom: false,//控制聊天室是否打开
        showRoom: false,//控制聊天框的显示与隐藏
        data: [],//对话列表的数据
        message: '',//输入框的消息
        ctrlIsDown: false,//ctrl是否被按下，这个用来区别ctrl+enter和enter的键盘事件
        init: false,//对话列表初始化，一开始滚动条是在最上面的，让其到最下面去，发送消息的时候也到最下面去---这个项目是最上面
        close: false,//判断websocket是否链接关闭,链接关闭显示“与服务器断开链接”，并且不可输入，不可选中
        websocket: null,//初始化websocket
        /*
        * 子用户发送消息是不需要传subUserName的，只用设置toParent=1
        * 父用户发送消息需要单独写用户名，原因是父用户也是一对一的，
        * 父用户应该是管理员或者后台的系统，上线是我们只需要将subUserName='',toParent=1即可
        * 这里我们的模拟父用户test0001向子用户tomtest发送消息
        */
        subUserName: window.localStorage.getItem('_name') == 'test0001' ? 'tomtest' : '',//发送出去，接受对象的用户名
        toParent: window.localStorage.getItem('_name') == 'test0001' ? '0' : '1',//websocket往哪儿发送，1是向父级发送  0是往子级发送
        currentUser: window.localStorage.getItem('_name'),
        receiveName: '游客',
        noticeList1: [],//站内消息列表
        showNotice: false,//站内消息的显示与隐藏
        stopTimer: null,//定时器

      }
    },
    computed: {},
    watch: {
      //监听数据更新，数据更新的时候，一直让滚动条在最下面
      //判断滚动条是否在最小面的方法：el.height===el.scrollHeight-el.scrollTop
      data: function () {
        //当数据更新的时候  去查看更新之前滚动条是否在最小面，
        //在的话就将数据更新之后的滚动条也放在最下面
        //否则就不动滚动条
        // this.newMessage=true;
        this.IsAddRoom = true; // 后期更改需求，不再有震动效果  直接弹出
        this.showRoom = true; // 后期更改需求，不再有震动效果  直接弹出
        this.mouseout()
        let ul = document.getElementById('chatRoomScroll')
        if (!ul) return
        //设置在底部
        // if (!this.init || ul.clientHeight === (ul.scrollHeight - ul.scrollTop)) {
        // 	// 滚动条初始化结束
        // 	this.init = true
        // 	//在dom更新之后去操作滚动条，不然是拿不到dom更新修改后的滚动条长度
        // 	this.$nextTick(function () {
        // 		ul.scrollTop = ul.scrollHeight
        // 	})
        // }
        //设置在头部
        if (!this.init || ul.clientHeight === 0) {
          // 滚动条初始化结束
          this.init = true
          //在dom更新之后去操作滚动条，不然是拿不到dom更新修改后的滚动条长度
          this.$nextTick(function () {
            ul && (ul.scrollTop = 0)
          })
        }
      }
    },
    methods: {
      //发送消息事件
      sendMessage: function () {
        let text = this.message.trim()
        //不提交：当输入字符为空的时候，当ctrl被按下（true）的时候
        if (!text || this.ctrlIsDown) {
          // this.message=''
          return
        }
        //首先要让滚动条到最底部，初始化滚动条状态
        this.init = false
        //这里是点击发送按钮，发送完毕时应该把输入框里面的内容清空
        let obj = {subUserName: this.subUserName, toParent: this.toParent, message: text}
        this.websocket.emit('message', obj)
        // 自己加上一条数据.

        this.data.push({
          type: 1,
          time: tranlateDate(new Date()),
          sendUin: this.subUserName,
          text: this.message,
          name: this.currentUser,
        })


        // if (this.websocket.readyState === 1) {
        // 	console.log({subUserName: this.subUserName, toParent: this.toParent, message: text})
        // 	this.websocket.send(obj)
        // } else if (this.websocket.readyState === 0) {
        // 	let that = this;//保存当前对象this
        // 	setTimeout(function () {
        // 		this.websocket.send(obj)
        // 	}.bind(this), 300);
        // } else {
        // 	this.socketInit();
        // 	let that = this;//保存当前对象this
        // 	setTimeout(function () {
        // 		this.websocket.send(obj)
        // 	}.bind(this), 500);
        // }
        this.message = ''
      },
      //接受到消息-接受到的消息都是别人发的,n区别于父级或者系统消息
      receive(v) {
        //接收的数据类型如下
        // Object {sendUin: 1, receiveUin: 13966, text: "顶顶顶顶", createTime: 1529113414393}
        this.data.unshift(v)
        // 如果是彩票中奖的消息  那就提示出这个中奖消息  然后提示客户
        // if (String(v.title).includes('中奖')) {
        // 	this.$Modal.al_default({status: 'confim', content: v.text, onOk: this.jump})
        // }
      },
      //输入框的换行事件
      newline() {
        this.message += '\n';
        return false
      },
      /*
      *  这里的ctrl按起来事件需要做一下处理，不能立即把ctrl按起的状态恢复，
      *  恢复太快的话，会导致在按enter之前就恢复了，这样会直接出发enter事件，所以给个100ms的延迟
      *  话说这个在底层应该是监听的event.keycode的值是否发生了改变来修改这个状态，
      *  当ctrl按下的时再按enter，会先执行ctrl按起的事件再执行enter按下的事件
      *  也就是一个瞬间的动作，虽然我们ctrl一直是按下的状态，但是由于keycode切换的值，
      *  就会在一瞬间里面被认为是抬起了，然后又按下了
       */
      ctrlKeyup() {
        setTimeout(function () {
          this.ctrlIsDown = false;
        }.bind(this), 100)
      },
      //websocket持久链接
      socketInit() {
        // this.websocket = new WebSocket(location.origin.replace('http', 'ws') + '/message/chat?sessionId=' + getCookie('sso_session_uid'));
        // // this.websocket = new WebSocket('ws://http://119.28.84.88/message/chat?sessionId=' + getCookie('sso_session_uid'));
        // // 这三个好像是监听函数一样
        // //发送消息使用ws.send（xxx）
        // //服务器链接
        // this.websocket.onopen = function (evt) {
        // 	console.log("成功链接")
        // };
        // // 接受消息
        // this.websocket.onmessage = function (v) {
        // 	console.log("接受了一条消息：" + v)
        // };
        // // 断开链接
        // this.websocket.onclose = function (evt) {
        // 	console.log("链接断开");
        // 	// this.close=true;
        // 	this.message = '服务器断开链接'
        // };
        let that = this;
        this.websocket = io.connect(location.origin.replace('http', 'ws') + '/message/chat?sessionId=' + getCookie("sso_session_uid"));
        this.websocket.on('connect', function () {
          console.log("成功链接")
	        typeof (that.res) !== 'function' && (console.log("推送消息回调函数名称：res"))
        });
        this.websocket.on('connect_error', function () {
          console.log("链接错误")
          that.websocket.disconnect()
        });
        this.websocket.on('message', function (data) {

          console.log('接受消息')
          // 处理数据结构
          data.type = 2//2代表父级传的，不是系统消息
          data.time = tranlateDate(data.createTime)
          data.name = that.receiveName;//接收到的消息  名字都是叫游客
          that.receive(data)
        });
        this.websocket.on('notice', function (data) {
          // 出发回调事件，发到父组件中去 --便于使用  开发者就不需要来操作这个组件的源文件了
          typeof (that.res) == 'function' && that.res(data) //  先要判断一下这个res是否存在  如果不存在的话就不要发了
          // 处理数据结构
          let obj = {
            title: data.title,
            text: data.content,
            time: tranlateDate(new Date()),
            type: 3,//3代表系统消息
            messageType: Number(data.messageType),//0是充值，1是提现，2是派奖
          }
          that.receive(obj)
        });
        this.websocket.on('disconnect', function () {
          this.close = true
        });
      },
      mouseenter() {
        this.stopTimer && (clearInterval(this.stopTimer))
      },
      //鼠标离开事件
      mouseout() {
        this.mouseenter()
        let that = this
        let i = 0
        this.stopTimer = setInterval(function () {
          if (i === 5) {
            that.showRoom = false;
            that.newMessage = false;
            that.mouseenter()
          } else {
            i++
          }
        }, 1000)
      },
      // 跳转到指定投注页面
    },
    created() {
      //排序
      // this.data =obj.sort(function (a, b) {
      // 	return a.time - b.time;
      // })
      //实例化websocket
      this.socketInit();

      // 没有登录的时候，不初始化socket
      // this.$store.state.isLogin === 'true' && this.socketInit();
    },
    mounted() {
    },
  }
</script>

<style lang='less' scoped>
  @themeColor: red;
  /*@import "../css/global.less";*/
  //动画效果  聊天室弹出
  @keyframes openChatRoom {
    from {
      bottom: -388px;
    }
    to {
      bottom: 0px;
    }
  }

  //动画效果  聊天室关闭
  @keyframes closeChatRoom {
    from {
      bottom: 0px;
    }
    to {
      bottom: -388px;
    }
  }

  //新消息--震动效果
  @keyframes newM {
    from {
      bottom: -5px
    }
    to {
      bottom: 0px
    }
  }

  * {
    box-sizing: border-box;
  }

  .newMessage {
    animation: newM 0.2s linear infinite alternate;
  }

  .chatRoomBox {
    position: fixed;
    right: 200px;
    bottom: 0px;
    z-index: 10050;
    /*display:none;*/

    .door {
      display: none;
      color: #f60;
      cursor: pointer;
      width: 30px;
      height: 30px;

      img {
        width: inherit;
        height: inherit;
      }
    }

    .chatRoom {
      animation: openChatRoom 0.5s;
      /*position: fixed;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*height: 350px;*/
      /*width: 400px;*/
      /*background: rgba(238, 238, 238, 0.9);*/
      /*user-select: none;*/
      /*padding: 0 10px;*/
      /*color: #000;*/
      /*z-index: 100100;*/
      position: fixed;
      right: 100px;
      bottom: 0;
      width: 270px;
      height: 388px;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
      z-index: 9999999;
      overflow: hidden;
      background: #fff;

      .close {
        position: absolute;
        right: -9px;
        top: -9px;
        background: red;
        color: #fff;
        border-radius: 50%;
        padding: 0px 6px;
        cursor: pointer;
      }

      .title {
        width: 100%;
        text-align: left;
        /*border-bottom: 1px solid #ccc;*/
        height: 35px;
        line-height: 23px;
        padding: 5px 15px;
        background-image: linear-gradient(@themeColor, #fb949d 50%, @themeColor);
        font-size: 14px;
        color: #fff;

        .btn_title {
          float: right;
          height: 25px;
          cursor: pointer;
          font-size: 12px;

          span {
            padding: 0px 5px;
          }
        }
      }

      .edit {
        width: 100%;
        position: relative;

        .text {
          width: 100%;
          display: inline-block;
          height: 100px;
          outline: none;
          background: transparent;
          border: none;
          padding: 5px;
          resize: none
        }

        .send {
          position: absolute;
          display: inline-block;
          border: 1px solid #ccc4bc;
          padding: 4px 25px;
          border-radius: 4px;
          bottom: 10px;
          right: 10px;
          background: #fff;
          letter-spacing: 3px;
          font-size: 15px;
          cursor: pointer;
        }

        .close {
          cursor: not-allowed;
        }
      }

      .content {
        height: calc(~"100% - 34px");
        /*border-bottom: 1px solid #ccc;*/

        overflow: auto;
        text-align: left;
        font-size: 12px;
        padding: 0 15px;

        ul {
          width: 100%;
          padding: 0 5px;
          padding-bottom: 10px;

          li {
            width: 100%;
            text-align: left;
            margin-top: 10px;

            .box {
              width: 100%;
              overflow: hidden;

              > div {
                float: left;
                display: inline-block;
              }

              .headerImg {
                width: 40px;
                height: 100%;
                margin-top: 6px;

                img {
                  width: 30px;
                  height: 30px;
                }
              }

              .info {
                max-width: 60%;
                height: inherit;
                user-select: text;

                .top {
                  font-size: 12px;
                  color: #2c7bf5;

                  .name {
                    margin-right: 6px;
                    margin-left: 4px;
                  }

                  .time {
                    color: #ccc;
                  }
                }

                .message {
                  background: #fff;
                  padding: 2px 9px;
                  font-size: 16px;
                  border-radius: 6px;
                  position: relative;
                  color: #000;
                  text-align: left;
                  max-width: 100%;
                  word-break: break-all;
                  word-wrap: break-word;

                  .triangle1, .triangle2 {
                    position: absolute;
                    top: 10px;
                    border-top: 8px solid #fff;
                    border-bottom: 0 none;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                  }

                  .triangle1 {
                    left: -10px;
                    transform: rotate(90deg);
                  }
                }
              }

              .noticeMain {
                text-align: left;
                font-size: 12px;
                padding: 0 15px;
              }

              .noticeMain li {
                padding: 5px 0;
              }

              .noticeMain a {
                cursor: pointer;
              }
            }

          }

          .right {
            .box {
              > div {
                float: right;
                text-align: right;
              }

              .headerImg {
                text-align: right;
              }

              .message {
                background: #b5e37d !important;
              }

              .top {
                text-align: right;
              }

              .message {
                display: inline-block;
              }

              .triangle2 {
                transform: rotate(270deg);
                right: -10px;
                border-top: 8px solid #b5e37d !important;
              }
            }
          }

          .systemMessage {
            /*background: red;*/
            color: #fff;
            text-align: center;

            .systemItem {
              width: 100%;
              background: #ff5868;
              /* margin-left: 20%; */
              border-radius: 6px;

              .systemTitle {
                font-size: 12px;
                color: #131212;
                font-weight: 600;
                border-bottom: 1px solid #fff;
                width: 98%;
                margin: auto;
                padding: 3px 0;
              }

              .systemContent {
                font-size: 14px;
                padding: 3px 6px;
                text-align: left;
              }
            }

            .withdraw {
              background: #ff58a3;
            }

            .recharge {
              background: #8358ff;
            }

            .systemType {
              background: #58aeff;
            }
          }
        }

      }

      .content::-webkit-scrollbar {
        width: 6px;
        height: 4px;
      }

      .content::-webkit-scrollbar-thumb {
        border-radius: 15px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);
        background: #5bcd78;
      }

      .content::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, .2);
        border-radius: 0;
        background: #edeff1;
        border-radius: 15px;
      }
    }

    .closeRoom {
      animation: closeChatRoom 0.5s;
      bottom: -388px;
    }
  }

</style>
