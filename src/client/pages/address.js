import $ from 'jquery'
import '@/assets/js/ethplorer'
import '@/assets/style/ethplorer.scss'
import Ethplorer from 'ethplorer'

export function init (ctx) {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip({ html: true })

    if (window.__ETH_DEBUG_ID__) {
      Ethplorer.debug = true
      Ethplorer.debugId = window.__ETH_DEBUG_ID__
    }

    Ethplorer.init()

    $('#qr-code-popup').dialog({
      autoOpen: false,
      resizable: false,
      width: 'auto',
      height: 'auto',
    })
  })
}
