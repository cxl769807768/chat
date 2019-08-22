<template>
  <div>
    <th-doctortitlebar canopen :openConfig="openconfig" :name="doctorbar.name" :position="doctorbar.position" :star="doctorbar.star" :btn="doctorbar.btn" :btnType="doctorbar.btntype" :btnCanClick="doctorbar.btncanlick" :headImg="otherface" :clock="`48小时后截止`" @btnCall="topbtncall" @headClick="headclick">
      自定义内容
      <div v-for="i in count">{{i}}</div>
    </th-doctortitlebar>
    <th-message ref="messgebox"  :useText="true" :usePulldown="true" :pulldownConfig="pulldownconfig" :topPadding="120" :messageData="messageData" :funcList="funclist" :bigBtn="bigbtn" :showInput="showinput" :selfFace="selfface" :otherFace="otherface" :showEmoticon="true" @sendOut="senRequest" @galleryCall="gallery" @cameraCall="camera" @quickCall="quick" @bigBtnCall="btncall" @faceClick="faceclick" @msgClick="msgclick" @pulldownCall="pulldowncall">
    </th-message>
    <th-dialog :isShow.sync="showdialog" :showFrom="dialogfrom" :closeOnClickshadow="true" @onHide="hidedialog">
    </th-dialog>
  </div>
</template>

<script>
import ThMessage from "./message";
import ThDoctortitlebar from "./doctortitlebar";
import ThDialog from "./dialog";

import { messageData, facelist } from "@/assets/testdata.js";
import selfface from "@/assets/images/myface.jpg";
import otherface from "@/assets/images/heface.jpg";

export default {
  name: "",
  components: {
    ThMessage,
    ThDoctortitlebar,
    ThDialog
  },
  data () {
    return {
      /*******/
      websoket:null,
      text:'',
      /*******/
      messageData: messageData,
      bigbtn: "",
      showinput: true,
      funclist: ["gallery", "camera", "quick"],
      doctorbar: {
        name: "李成才",
        position: "主治医师",
        star: 5,
        btn: "结束咨询",
        btncanlick: true,
        btntype: "primary"
      },
      count: 10,
      showdialog: false,
      dialogfrom: "bottom",
      selfface: selfface,
      otherface: otherface,
      facelist: facelist,
      openconfig: {
        open: "打开",
        close: "关闭"
      },
      pulldownconfig: {
        default: "<div>下拉刷新</div>",
        up: "<div style='color:red'>下拉刷新</div>",
        down: "<div style='color:blue'>松手刷新</div>",
        loading: "<span style='color:green'>加载中</span>"
      }
    };
  },
  mounted () {
    if ('WebSocket' in window) {
      this.websocket = new WebSocket('ws://192.168.33.10:9502?token=123&uid=1')
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
    setTimeout(() => {
      this.$refs.messgebox.messageReset()
    }, 5000);
  },
  methods: {
    /********websoket相关函数 by xiaolong*****/
    /**
     * [initWebSocket description]
     * @Author   xiaolong
     * @DateTime 2019-08-21T16:27:34+0800
     * @return   {[type]}                 websoket
     */
    initWebSocket(){
      //连接错误
      this.websocket.onerror = this.setErrorMessage
 
      // //连接成功
      this.websocket.onopen = this.setOnopenMessage
 
      //收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage
 
      //连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage
 
      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage() {
      console.log("WebSocket连接发生错误" + '   状态码：' + this.websocket.readyState);
    },
    setOnopenMessage() {
      console.log("WebSocket连接成功" + '   状态码：' + this.websocket.readyState);
    },
    setOnmessageMessage(event) {
      this.messageData.push({
        type: 2,
        text: this.replaceImg(event.data)
      });
      console.log(event.data);
    },
    setOncloseMessage() {
      console.log("WebSocket连接关闭" + '   状态码：' + this.websocket.readyState);
    },
    onbeforeunload() {
      this.closeWebSocket();
   },
    //websocket发送消息
    send() {
      this.websocket.send(this.text)
      this.text = ''
    },
    closeWebSocket() {
      this.websocket.close()
    },
    /*******websoket 相关函数结束********/
    replaceImg (word) {
      return word.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, word => {
        let newWord = word.replace(/\[|\]/gi, "");
        let index = this.facelist.indexOf(newWord);
        return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`;
      });
    },
    senRequest (h) {
      var data = {};
      this.messageData.push({
        type: 1,
        text: this.replaceImg(h)
      });
      //当前用户ID
      data.from = 1
      //发给谁
      data.to = 2
      data.message = this.replaceImg(h)
      var dataStr = JSON.stringify(data)
      this.websocket.send(dataStr)
    },
    gallery () {
      console.warn("调起了自定义组件");
      this.messageData.push({
        type: 3,
        text: "调起了自定义相册组件"
      });
    },
    camera () {
      // this.messageData.push({
      //   type: 3,
      //   text: "调起了自定义拍照组件"
      // });
      this.messageData.push({
        type: 1,
        text:
          '<img src="http://img4.imgtn.bdimg.com/it/u=3088474657,3195539965&fm=11&gp=0.jpg">',
        isimg: true
      });
    },
    btncall () {
      alert("前往评价了");
      this.doctorbar.btn = "已评价";
      this.doctorbar.btntype = "default";
    },
    topbtncall () {
      this.messageData.push({
        type: 4,
        text: "您已完成咨询，请前往评价"
      });
      this.bigbtn = "前往评价";
      this.showinput = false;
      this.doctorbar.btncanlick = false;
      this.websocket.close()
    },
    quick () {
      this.showdialog = true;
    },
    hidedialog () {
      this.showdialog = false;
    },
    faceclick (d) {
      console.log(d);
    },
    msgclick (d) {
      if (d.isimg) alert(d.text);
    },
    headclick () {
      console.log("点击了头像");
    },
    pulldowncall () {
      console.log("pulldown");
      this.messageData.unshift({
        type: 1,
        text: "新增"
      });
      setTimeout(() => {
        this.$refs.messgebox.resetpulldown();
      }, 2000);
    }
  }
};
</script>
