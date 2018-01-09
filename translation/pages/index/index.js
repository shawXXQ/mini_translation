//index.js
//获取应用实例
const app = getApp()
var content;
var utilMd5 = require('../../utils/md5.js');
var sign;
var target_lanuage = 'EN'
Page({
  data: {
    result: {},
    items: [
      //默认选择英文
      { name: 'EN', value: '英文', checked: true },
      { name: 'zh-CHS', value: '中文' },
      { name: 'ja', value: '日文' },
      { name: 'ko', value: '韩文' },
    ]
  },
  //事件处理函数
  bindViewTap: function () {
  },

  onLoad: function () {
  },


  radioChange: function (e) {
    console.log("radio发生了改变，值为：", e.detail.value)
    target_lanuage = e.detail.value
    console.log("目标语言：" + target_lanuage)
  },

  formSubmit: function (e) {
    content = e.detail.value.text;
    var that = this;
    console.log("用户输入的待翻译文本为：", content);
    sign = '774309fbc239d997' + content + '2HK0awjmg1d8G7VyVMYu53s7RskTWdqP1'
    console.log("原始sign： " + sign)
    //拼接sign签名文件并使用MD5加密
    sign = utilMd5.md5(sign)
    //将加密后的密文转换为大写
    sign = sign.toUpperCase();
    console.log("加密后的sign： " + sign)
    //对中文字符进行编码转换
    content = encodeURI(content);
    console.log("转换后的带翻译文本为： " + content)
    if (!content) {
      this.setData({
        hasError: true,
        errorText: "待翻译文本不能为空，请重新输入！"
      })
    } else {
      this.setData({
        hasError: false
      })

      //显示加载框
      wx.showLoading({
        title: '正在翻译',
      })
      wx.request({
        url: 'https://openapi.youdao.com/api?q=' + content + '&from=auto&to=' + target_lanuage + '&appKey=774309fbc239d997&salt=2&sign=' + sign,
        //url: 'https://openapi.youdao.com/api?q=%e4%bd%a0%e5%a5%bd&from=auto&to=' + target_lanuage + '&appKey=774309fbc239d997&salt=2&sign=7845DAD7E8210CD869DBC7C34A9C5F92',
        headers: {
          'Content-Type': 'application/json',
        },
        success: function (res) {
          console.log(JSON.stringify(res.data))
          that.setResult(res.data)
          //获取数据成功后关闭加载框
          wx.hideLoading()
        },
      })
    }
  },
  textChange: function (e) {
    content = e.detail.value;
    //隐藏错误提示
    if (content) {
      this.setData({
        hasError: false
      })
    }
  },
  setResult: function (data) {
    this.setData({
      result: data
    })
  }
})
