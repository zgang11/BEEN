// pages/me/me.js
import * as echarts from '../ec-canvas/echarts'
// pages/wtext/wtext.js

function initChart1(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  //这里复制了官方示例配置
  var option = {
    color: ["#DD6E42"],
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [2, 2, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0],
      type: 'line'
    }]
  };
  chart.setOption(option);
  return chart;
}

function initChart2(canvas, width, height) {

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);


  var hours = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  var days = ['Ann', 'Bob'];

  var data = [
    [0, 0, 5],
    [0, 1, 1],
    [0, 2, 0],
    [0, 3, 0],
    [0, 4, 0],
    [0, 5, 0],
    [0, 6, 0],
    [1, 0, 7],
    [1, 1, 0],
    [1, 2, 0],
    [1, 3, 0],
    [1, 4, 0],
    [1, 5, 0],
    [1, 6, 0],

  ];

  data = data.map(function (item) {
    return [item[1], item[0], item[2] || '-'];
  });

  //这里复制了官方示例配置
  var option = {

    tooltip: {
      position: 'top'
    },
    animation: false,
    grid: {
      height: '50%',
      y: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#D3E2DA', '#6C8980']
      }
    },
    series: [{
      name: 'Punch Card',
      type: 'heatmap',
      data: data,
      label: {
        normal: {
          show: true
        }
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  chart.setOption(option);
  return chart;
}

function initChart3(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  //这里复制了官方示例配置
  var option = {
    color: ['#d88160', '#6C8980'],
    angleAxis: {
    },
    radiusAxis: {
      type: 'category',
      data: ['娱乐', '学习', '工作'],
      z: 10
    },
    polar: {
    },
    series: [{
      type: 'bar',
      data: [6, 2, 4],
      coordinateSystem: 'polar',
      name: 'Bob',
      stack: 'a'

    }, {
      type: 'bar',
      data: [2, 6, 7],
      coordinateSystem: 'polar',
      name: 'Ann',
      stack: 'a'
    }],
    legend: {
      x: '220px',
      show: true,
      data: ['Bob', 'Ann']
    }
  }
  chart.setOption(option);
  return chart;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weatherData: '',
    date: '',
    temperature: '',
    isHide: true,
    avatarUrl: '',
    nickName: '',
    ec1: {
      onInit: initChart1
    },
    ec2: {
      onInit: initChart2
    },
    ec3: {
      onInit: initChart3
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {

    backToMap(event) {
      console.log("1")
      wx.switchTab({
        url: '/pages/tripmap/tripmap'
      });
    },
    makertap: function (e) {
      var that = this;
      var id = e.markerId;
      that.showSearchInfo(wxMarkerData, id);
    },
    onLoad: function () {
      var bmap = require('../libs/bmap-wx.min.js')
      var wxMarkerData = []
      var that = this;
      // 新建百度地图对象 
      var BMap = new bmap.BMapWX({
        ak: 'GwtvzsBZssua3I4E3fH6SucwFNGXrYOo'
      });
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        console.log(data)
        var weatherData = data.currentWeather[0]
        console.log(weatherData)
        console.log(weatherData.date)
        that.setData({
          temperature: weatherData.temperature,
          date: weatherData.date
        });
      }
      // 发起weather请求 
      BMap.weather({
        fail: fail,
        success: success
      });
    },

    bindGetUserInfo: function (e) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        const userinfo = e.detail.userInfo
        that.setData({
          isHide: false,
          avatarUrl: userinfo.avatarUrl,
          nickName: userinfo.nickName
        });
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    },
    initChart: function (canvas, width, height) {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);

      //这里复制了官方示例配置
      var option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };
      chart.setOption(option);
      return chart;
    }
  }
})
