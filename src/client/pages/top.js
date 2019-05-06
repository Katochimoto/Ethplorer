import $ from 'jquery'
import widget from 'ethplorer-widget'

$(function () {
  widget.init('#token-top', 'top', {
    total: true,
    limit: 50,
  })
})
