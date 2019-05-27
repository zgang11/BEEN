 // pages/wtext/wtext.js
// 引入SDK核心类
var app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/utils.js')
var QQMapWX = require('../libs/qqmap-wx-jssdk.js')
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '7WGBZ-RKCKD-CWZ4E-H3C6X-EEWMZ-AVBWE' //申请的开发者秘钥key
});
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
    weatherDesc: '',
    context_input: '',
    month: '',
    city: '',
    day: '',
    temperature: '',
    location: '',
    images: [],
    tags: [],
    latitude: '',
    longitude: '',
    markers: [],
    lists: [],
    fileID:[],
    count: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(e) {
      var allData = JSON.parse(e.good_data)
      var wetherData = allData[0]
      var positionData = allData[1]
      //console.log(wetherData)
      //console.log(positionData)
      this.setData({
        day: wetherData.day,
        month: wetherData.month,
        temperature: wetherData.temperature,
        weatherDesc: wetherData.weatherDesc,
        location: positionData.address,
        city: positionData.city,
        latitude: positionData.latitude,
        longitude: positionData.longitude
      })
      //console.log(this.data.month)
      var _this = this
      const db = wx.cloud.database({
        //这个是环境ID不是环境名称
        env: 'mongon-d71648'
      })
      db.collection('mark').where({
        _openid: this.data.openid
      }).get({
        success: res => {
          //console.log(res.data)
          this.setData({
            markers: res.data
          })
        }
      })
    },

    handleImagePreview(e) {
      const idx = e.target.dataset.idx
      const images = this.data.images
      wx.previewImage({
        current: images[idx], //当前预览的图片
        urls: images, //所有要预览的图片
      })
    },
    removeImage(e) {
      const idx = e.target.dataset.idx
      this.data.images.splice(idx, 1)
      this.setData({
        images: this.data.images
      })
    },
    chooseImage(e) {
      var that = this
      wx.chooseImage({
        count:9,
        sizeType: ['original', 'compressed'], 
        sourceType: ['album', 'camera'],
        success:function(res){
          const filePath = res.tempFilePaths
          that.setData({
            images:filePath
          })
          const cloudPath = []
          filePath.forEach((item,i)=>{
            cloudPath.push(that.data.count+'_'+i+filePath[i].match(/\.[^.]+?$/)[0])
          })
          var fileId = []
          filePath.forEach((item,i) => {
            wx.cloud.uploadFile({
              cloudPath:cloudPath[i],
              filePath:filePath[i],
              success:res => {
                var fileid= res.fileID
                fileId.push(fileid)
              }
            })
          })
          console.log(fileId)
          that.setData({
            fileID:fileId
          })
        }
      })
    },
    chooseLoaction(e) {
      var _this = this
      wx.chooseLocation({
        success: function(res) {
          //console.log(res)
          var name = res.name
          var address = res.address
          var latitude = res.latitude
          var longitude = res.longitude
          _this.setData({
            latitude: latitude,
            longitude: longitude,
            location: name
          })
        }
      })
    },
    backToMap(event) {
      //console.log("关闭")
      wx.switchTab({
        url: '/pages/tripmap/tripmap'
      });
    },
    onShow() {

    },
    /////////////////////////保存上传提交/////////////////////////////
    saveForm: function(event) {
      var fileID = this.data.fileID , tempFileURL = []
      console.log(fileID)
      fileID.forEach((item , i) => {
        wx.cloud.downloadFile({
            fileID:item
        }).then(res => {
          console.log(res.tempFilePath)
          tempFileURL.push(res.tempFilePath)
        })
      })
      console.log(tempFileURL)
  /**    wx.cloud.getTempFileURL({
        fileList:fileID,
        success:res => {
          console.log(res.fileList)
          var fileLists = res.fileList
          fileLists.forEach((item , i ) => {
            tempFileURL.push(item.tempFileURL)
          })
        }
      }) */

  
      let lat = this.data.latitude,
        lng = this.data.longitude,
        newLists = this.data.markers,
        i = newLists.length
      if (this.data.images.length>0) {
        var _this = this.data
        var id_time = new Date()
        var id_ = id_time.getTime()
        db.collection('mark').add({
          data: {
            id: id_,
            date: new Date(),
            tags: _this.tags,
            day: _this.day,
            month: _this.month,
            tempFilePaths: tempFileURL,
            context: _this.context_input,
            images: _this.images,
            fileID:_this.fileID,
            temperature: _this.temperature,
            weatherDesc: _this.weatherDesc,
            location: _this.location,
            tags: _this.tags,
            iconPath: '/images/dotmarkers.png',
            longitude: _this.longitude,
            latitude: _this.latitude,
            width: 30,
            height: 30,
            callout: {
              content: _this.location,
              color: '#eee',
              width: 12,
              height: 12,
              display: 'BYCLICK',
              borderRadius: 40,
              bgColor: '#1296db',
              padding: 5
            }
          },

          success: res => {
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            console.error('[数据库] [新增记录] 失败：', err)
          }

        })
        
        wx.switchTab({
          url: '/pages/tripmap/tripmap'
        })
      }else{
        wx.showToast({
          title: '请添加图片~',
          image: '../../images/submit_fail.png',
          duration: 2000
        })
      }
    },
    addText: function(e) {
      this.setData({
        context_input: e.detail.value
      })
    },
    addTags: function(e) {
      wx.navigateTo({
        url: '/pages/tagsDetail/tagsDetail'
      })
    }

  }
})