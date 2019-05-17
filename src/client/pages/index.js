import $ from 'jquery'
import widget from 'ethplorer-widget'
import EthplorerSearch from 'ethplorer-search'

$(function () {
  widget.init('#token-pulse', 'tokenHistoryGrouped', {
    period: 90,
    theme: 'dark',
    cap: true,
    total: true,
    options: { pointSize: 0 },
  })

  widget.init('#token-top', 'top', {
    limit: 10
  })

  widget.init('#token-last', 'tokenHistory', {
    limit: 5
  }, {
    header: ''
  })

  widget.loadScript('https://www.gstatic.com/charts/loader.js', widget.loadGoogleCharts)

  $('#search-form')
    .on('submit', function (event) {
      event.preventDefault()
      const $data = $('input[name="data"]', this)
      const data = $.trim($data.val()).toLowerCase()
      const isValid = data && (/^0x[0-9a-f]{40}$/.test(data) || /^0x[0-9a-f]{64}$/.test(data))

      $data.toggleClass('is-invalid', !isValid)

      if (!isValid) {
        $data
          .select()
          .next('.invalid-feedback')
          .text(data ? 'Invalid Format' : 'No one field is filled')
      }
    })
    .on('input', 'input[name="data"]', function () {
      $(this).removeClass('is-invalid')
    })

  EthplorerSearch.init($('#search-form'), $('#search-form input[name="data"]'), data => {
    data = $.trim(data).toLowerCase()
    const isAddress = data && /^0x[0-9a-f]{40}$/.test(data)
    const isTx = data && /^0x[0-9a-f]{64}$/.test(data)

    if (isAddress) {
      document.location.href = '/address/' + data + '?from=search';
    } else if (isTx) {
      document.location.href = '/tx/' + data + '?from=search';
    }
  })
})
