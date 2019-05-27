// pages/tripmap/tripmap.js
const db = wx.cloud.database()
const util = require('../../utils/utils.js')
var QQMapWX = require('../libs/qqmap-wx-jssdk.js')
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '7WGBZ-RKCKD-CWZ4E-H3C6X-EEWMZ-AVBWE' //申请的开发者秘钥key
})
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
    timebarShow: false,
    chioceDistrict: false,
    chioceSorting: false,
    id_1: false,
    id_2: false,
    id_3: false,
    id_4: false,
    id_5: false,
    id_6: true,
    sortingChioceIcon: "/images/arrow-down.png",
    timeList: [{
        key: 1,
        value: "今天"
      },
      {
        key: 2,
        value: "最近一周"
      },
      {
        key: 3,
        value: "最近一个月"
      },
      {
        key: 4,
        value: "最近半年"
      },
      {
        key: 5,
        value: "最近一年"
      },
      {
        key: 6,
        value: "全部"
      }
    ],
    latitude: 39.911465,
    longitude: 116.557243,
    scale: 16,
    markers: [],
    delData: [],
    locData: [],
    markers_:[],
    isShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(e) {

      /////////////////////////获取天气////////////////////
      var bmap = require('../libs/bmap-wx.min.js')
      var wxMarkerData = []
      var that = this
      // 新建百度地图对象 
      var BMap = new bmap.BMapWX({
        ak: 'GwtvzsBZssua3I4E3fH6SucwFNGXrYOo'
      })
      var fail = function(data) {
      }
      var success = function(data) {
        var weatherData = data.currentWeather[0]
        var date = data.originalData.date
        var dateString = date.toString()
        var month = dateString.substring(5, 7)
        var day = dateString.substring(8, 10)
        var delData = {
          day: day,
          month: month,
          weatherDesc: weatherData.weatherDesc,
          temperature: weatherData.temperature,
        }
        that.setData({
          delData: delData
        })
      }
      // 发起weather请求 
      BMap.weather({
        fail: fail,
        success: success
      })


      //////////////////////自动获取地理位置/////////////////////
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          //console.log(res)

          // 调用sdk接口
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function(res) {
              //获取当前地址成功
              var address = res.result
              var location = res.result.location
              var city = address.address_component.city,
                address = address.address,
                latitude = location.lat,
                longitude = location.lng
              var locData = {
                city: city,
                address: address,
                latitude: latitude,
                longitude: longitude
              }
              //console.log(locData)
              that.setData({
                locData: locData
              })

            },
            fail: function(res) {
              console.log('获取当前地址失败');
            }
          });
        },
      })



      ////////////////////////////////////////////////////////////////////
      var _this = this
      const db = wx.cloud.database({
        //这个是环境ID不是环境名称
        env: 'mongon-d71648'
      })
      db.collection('mark').where({
        _openid: this.data.openid
      }).get({
        success: res => {
          this.setData({
            markers: res.data,
            markers_:res.data
          })
        }
      })
    },
    onShowbar(event) {
      if (this.data.chioceDistrict) {
        this.setData({
          sortingChioceIcon: "/images/arrow-down.png",
          chioceDistrict: false,
          chioceSorting: false,
          timebarShow: !this.data.timebarShow
        })
      } else {
        this.setData({
          sortingChioceIcon: "/images/arrow-up.png",
          chioceDistrict: true,
          chioceSorting: false,
          timebarShow: !this.data.timebarShow
        })
      }
    },
    writeText(event) {
      var allData = [this.data.delData, this.data.locData]
      //console.log(allData)
      wx.redirectTo({
        url: '/pages/wtext/wtext?good_data=' + JSON.stringify(allData),
        success: function(res) {
          //console.log(res)
        }
      })
    },
    chooseByDate(e) {

      ///////////////////////////////时间选择////////////
      function GetDateStr(AddDayCount) {
        var dd = new Date()
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
        var y = dd.getFullYear()
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
      }
      
      var key = e.currentTarget.dataset.keyword.key
      var c_marker = this.data.markers_,e_markers = []
      var now = new Date()
      var startTime = now.getTime()
      switch (key) {
        case 1: 
          for (var i = 0; i < c_marker.length; i++) {
            var endT = GetDateStr(0)
            var endTi = new Date(endT)
            var endTiem = endTi.getTime()
            var markerTime = c_marker[i].date
            var markerTiems = new Date(markerTime)
            var markersTime = markerTiems.getTime()
            if (markersTime >= endTiem && markersTime <= startTime){
              e_markers.push(c_marker[i])     
            }
          }
          console.log(e_markers)
          this.setData({
            markers: e_markers,
            chioceDistrict: false,
            isShow:true,
            id_1:true,
            id_2: false,
            id_3: false,
            id_4: false,
            id_5: false,
            id_6: false,
          })
          break
        case 2:
          for (var i = 0; i < c_marker.length; i++) {
          
            var endT = GetDateStr(-7)
            var endTi = new Date(endT)
            var endTiem = endTi.getTime()
            var markerTime = c_marker[i].date
            var markerTiems = new Date(markerTime)
            var markersTime = markerTiems.getTime()
            if (markersTime >= endTiem && markersTime <= startTime) {
              e_markers.push(c_marker[i])
            }
          }
          console.log(e_markers)
          this.setData({
            markers: e_markers,
            chioceDistrict: false,
            id_1: false,
            id_2: true,
            id_3: false,
            id_4: false,
            id_5: false,
            id_6: false,
          })
          break
        case 3:
          for (var i = 0; i < c_marker.length; i++) {
            var now = new Date()
            var startTime = now.getTime()
            var endT = GetDateStr(-30)
            var endTi = new Date(endT)
            var endTiem = endTi.getTime()
            var markerTime = c_marker[i].date
            var markerTiems = new Date(markerTime)
            var markersTime = markerTiems.getTime()
            if (markersTime >= endTiem && markersTime <= startTime) {
              e_markers.push(c_marker[i])
            }
          }
         console.log(e_markers)
          this.setData({
            markers: e_markers,
            chioceDistrict: false,
            id_1: false,
            id_2: false,
            id_3: true,
            id_4: false,
            id_5: false,
            id_6: false,
          })
          break
        case 4:
          for (var i = 0; i < c_marker.length; i++) {
            var now = new Date()
            var startTime = now.getTime()
            var endT = GetDateStr(-180)
            var endTi = new Date(endT)
            var endTiem = endTi.getTime()
            var markerTime = c_marker[i].date
            var markerTiems = new Date(markerTime)
            var markersTime = markerTiems.getTime()
            if (markersTime >= endTiem && markersTime <= startTime) {
              e_markers.push(c_marker[i])
            }
          }
          console.log(e_markers)
          this.setData({
            markers: e_markers,
            chioceDistrict: false,
            id_1: false,
            id_2: false,
            id_3: false,
            id_4: true,
            id_5: false,
            id_6: false,
          })
          break
        case 5:
          for (var i = 0; i < c_marker.length; i++) {
            var now = new Date()
            var startTime = now.getTime()
            var endT = GetDateStr(-365)
            var endTi = new Date(endT)
            var endTiem = endTi.getTime()
            var markerTime = c_marker[i].date
            var markerTiems = new Date(markerTime)
            var markersTime = markerTiems.getTime()
            if (markersTime >= endTiem && markersTime <= startTime) {
              e_markers.push(c_marker[i])   
            }
          }
          console.log(e_markers)
          this.setData({
            markers: e_markers,
            chioceDistrict: false,
            id_1: false,
            id_2: false,
            id_3: false,
            id_4: false,
            id_5: true,
            id_6: false,
          })
          break
        case 6:
          this.setData({
            markers: c_marker,
            chioceDistrict:false,
            id_1: false,
            id_2: false,
            id_3: false,
            id_4: false,
            id_5: false,
            id_6: true,
          })
          break
      }
     

    },
    markertap(e){
      //console.log(1)

    },
    callouttap(event){
      var id = event.markerId
      var lookFormarker = this.data.markers
      var index
      for(var i = 0 ; i < lookFormarker.length;i++){
          if(lookFormarker[i].id===id){
             index = i
          }
      } 
      var id_ = lookFormarker[index]._id  
      wx.navigateTo({
       url: '../detail/detail?id=' + id_,
      })
    }
  }
})