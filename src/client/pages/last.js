import $ from 'jquery'
import widget from 'ethplorer-widget'

$(function () {
  widget.init('#token-last', 'tokenHistory', {
    limit: 50
  }, {
    header: ''
  })
})
