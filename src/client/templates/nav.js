import $ from 'jquery'
import EthplorerSearch from 'ethplorer-search'

$(function () {
  $('#nav-search-form')
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

  EthplorerSearch.init($('#nav-search-form'), $('#nav-search-form input[name="data"]'), data => {
    data = $.trim(data).toLowerCase()
    const isAddress = data && /^0x[0-9a-f]{40}$/.test(data)
    const isTx = data && /^0x[0-9a-f]{64}$/.test(data)

    if (isAddress) {
      document.location.href = '/address/' + data + '?from=search';
    } else if (isTx) {
      document.location.href = '/tx/' + data + '?from=search';
    }
  })

  EthplorerSearch.setOption('classes.ui-autocomplete', 'ui-autocomplete__small')
})
