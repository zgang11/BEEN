// pages/downPics/downPics.js
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
    url:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad:function(e){
      wx.cloud.downloadFile({
        fileID:'cloud://mongon-d71648.6d6f-mongon-d71648/0_0.png',
        success:res => {
          console.log(res.tempFilePath)
          this.setData({
            url: res.tempFilePath
          })
        }
      })
      console.log(this.data.url)
    }
  }
})
