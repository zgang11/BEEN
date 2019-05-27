// pages/remember/remember.js
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
    message: [],
    input: '',
    markers: [],
    show_close: false,
    show:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad:function(){
      var _this = this
      const db = wx.cloud.database({
        //这个是环境ID不是环境名称
        env: 'mongon-d71648'
      })
      db.collection('mark').where({
        _openid: this.data.openid
      }).get({
        success: res => {
          console.log(res.data)
        }
      })
    }, 
    onShow: function() {

      var _this = this
      const db = wx.cloud.database({
        //这个是环境ID不是环境名称
        env: 'mongon-d71648'
      })
      db.collection('mark').where({
        _openid: this.data.openid
      }).get({
        success: res => {
          console.log(res.data)
          if(res.data.length ===0){
            this.setData({
              message: res.data,
              markers: res.data,
              show:true
            })
          }else{
            this.setData({
              message: res.data,
              markers: res.data
            })
          }
          
        }
      })
    },
    viewdetail: function(event) {
      console.log(event)
      var id = event.currentTarget.dataset.id
      
      wx.navigateTo({
        url: '../detail/detail?id=' + id,
      })
      console.log(id)
    },
    inputDelete: function(e) {
      this.setData({
        input:'',
        message: this.data.markers,
        show: false
      })
    },
    inputConfirm: function(e) {
      var marker_list = []
      var keyword = e.detail.value

      var all_markers = this.data.markers
      for (var i = 0; i < all_markers.length; i++) {
        var markers_context = all_markers[i].context
        if (markers_context.indexOf(keyword) != -1) {
          marker_list.push(all_markers[i])
        }
      }
      if (marker_list.length === 0) {
        this.setData({
          message: marker_list,
          show: true
        })
      } else {
        this.setData({
          message: marker_list,
          show:false
        })
      }
    }
  }
})