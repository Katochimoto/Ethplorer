import $ from 'jquery'
import widget from 'ethplorer-widget'

$(function () {
  widget.init('#token-top-weekly', 'topTokens', {
    limit: 50,
    period: 7,
  }, {
    header: '',
  })
})
