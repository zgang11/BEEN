// pages/detail/detail.js
const db = wx.cloud.database()
import { promiseHandle } from '../../utils/utils';
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
    info_list: [],
    edit:false,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 100,
    message: [],
    optionsId:'',
    fileID:[],
    image:[],
    firstImage:'',
    context:'',
    context_value:'',
    tags:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(options) {
      this.setData({
        optionsId: options.id
      })
      db.collection('mark').doc(options.id).get({
        success: res => {  
          this.setData({
            context:res.data.context,
            message: res.data,
            tags:res.data.tags,
            optionsId: res.data._id,
            fileID: res.data.fileID
          })  
        }
      }) 
    },
    onShow:function(e){
      db.collection('mark').doc(this.data.optionsId).get({
        success: res => {
          this.setData({
            message: res.data,
            tags: res.data.tags,
            optionsId: res.data._id,
            fileID: res.data.fileID
          })
        }
      }) 
    },
    onRemove(e) {
      var optionsId = this.data.optionsId
      wx.showModal({
        title: '删除',
        content: '确定要删除吗？',
        success: function(sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
            const db = wx.cloud.database();
            /**
             * 删除集合counters中的数据
             */
            
            db.collection('mark').doc(optionsId).remove().then(res => {
            })
            wx:wx.switchTab({
              url: '../remember/remember',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })

          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    delTags:function(e){
      if(this.data.edit){
        var now_tags = e.currentTarget.dataset.keyword
        var my_now_tags = this.data.message.tags
        console.log(my_now_tags)
        var index = 1
        for (var i = 0; i < my_now_tags.length; i++) {
          if (now_tags === my_now_tags[i]) {
            index = i
          }
        }
        my_now_tags.splice(index, 1)
        this.setData({
          tags: my_now_tags
        })
      }else{
      }
    },
    delImg:function(e){
     
    },
    upDateText:function(e){
      this.setData({
        context_value: e.detail.value
      })
    },
    saveButton: function (e) {
      const db = wx.cloud.database()
      db.collection('mark').doc(this.data.optionsId).update({
        data: {
          tags: this.data.tags,
          context: this.data.context_value
        },
        success: res => {
          console.error('[数据库] [更新记录] 成功：', success)
        },
        fail: err => {
          icon: 'none',
            console.error('[数据库] [更新记录] 失败：', err)
        }
      })
      this.setData({
        edit:false,
        context: this.data.context_value
      })
    },
    listItemTapEvent:function(e){
      let _this = this
      const itemList = ['编辑', '删除'];
      promiseHandle(wx.showActionSheet, { itemList: itemList, itemColor: '#2E2E3B' })
        .then((res) => {
          if (!res.cancel) {
            switch (itemList[res.tapIndex]) {
              case '删除':
                var optionsId = this.data.optionsId
                wx.showModal({
                  title: '删除',
                  content: '确定要删除吗？',
                  success: function (sm) {
                    if (sm.confirm) {
                      // 用户点击了确定 可以调用删除方法了
                      const db = wx.cloud.database();
                      /**
                       * 删除集合counters中的数据
                       */

                      db.collection('mark').doc(optionsId).remove().then(res => {
                      })
                      wx: wx.switchTab({
                        url: '../remember/remember',
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { },
                      })

                    } else if (sm.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                break;
              case '编辑':
              var message_value = _this.data.message.context
                console.log(message_value)
                _this.setData({
                  context_value:message_value,
                  edit:true
                })
                break;
            }
          }
        });
    }
  }
})