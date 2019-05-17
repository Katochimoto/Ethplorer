import $ from 'jquery'
import widget from 'ethplorer-widget'

$(function () {
  widget.init('#token-top', 'tokenHistoryGrouped', {
    period: 90,
    theme: 'dark',
    cap: true,
    full: true,
    total: true,
    options: {
      pointSize: 0,
      height: 300,
    },
  })

  widget.loadScript('https://www.google.com/jsapi', widget.loadGoogleControlCharts)
})
