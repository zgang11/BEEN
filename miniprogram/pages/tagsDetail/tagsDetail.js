// pages/tagsDetail/tagsDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags_words: ['今天去工作', '我觉得我在学习', '玩的浪就完了', '逛街街', '疯狂就老了', '真机测试', '忙着浪费生命', '吃的好多', '又是咸鱼的一天呢', '向往的生活'],
    my_tags_words: [],
    input_tags: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addTags: function (e) {
      var that = this
      function uniq(array) {
        var temp = {}, r = [], len = array.length, val, type;
        for (var i = 0; i < len; i++) {
          val = array[i];
          type = typeof val;
          if (!temp[val]) {
            temp[val] = [type];
            r.push(val);
          } else if (temp[val].indexOf(type) < 0) {
            temp[val].push(type);
            r.push(val);
          }
        }
        return r;
      }
      var keyword = e.currentTarget.dataset.keyword
      var cur_tags_words = that.data.my_tags_words
      cur_tags_words.unshift(keyword)
      var end_tags_words = uniq(cur_tags_words)
      that.setData({
        my_tags_words: end_tags_words
      })
    },
    inputTags: function (e) {
      function uniq(array) {
        var temp = {}, r = [], len = array.length, val, type
        for (var i = 0; i < len; i++) {
          val = array[i]
          type = typeof val
          if (!temp[val]) {
            temp[val] = [type]
            r.push(val)
          } else if (temp[val].indexOf(type) < 0) {
            temp[val].push(type)
            r.push(val)
          }
        }
        return r
      }

      var input_tags_words = e.detail.value
      // console.log(input_tags_words)
      var arr = this.data.my_tags_words
      arr.unshift(input_tags_words)
      var array = uniq(arr)
      // console.log(arr)
      this.setData({
        my_tags_words: array
      })
    },
    delTags: function (e) {
      var now_tags = e.currentTarget.dataset.keyword
      var my_now_tags = this.data.my_tags_words
      // console.log(now_tags)
      // console.log(my_now_tags)
      var index = 1
      for (var i = 0; i < my_now_tags.length; i++) {
        if (now_tags === my_now_tags[i]) {
          index = i
        }
      }
      // console.log(index)
      //  console.log(my_now_tags)
      my_now_tags.splice(index, 1)
      //  console.log(my_now_tags)
      this.setData({
        my_tags_words: my_now_tags
      })
    },
    turnBack: function (e) {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      console.log(this.data.my_tags_words)
      prevPage.setData({
        tags: this.data.my_tags_words
      })
      console.log(1)
      wx.navigateBack({
        delta: 1
      })
    }
  }
})