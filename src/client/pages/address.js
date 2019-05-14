import $ from 'jquery'
import diff from 'diffhtml'
import widget from 'ethplorer-widget'
import {
  isAddress,
  stripTags,
  prepareToken,
  toChecksumAddress,
} from '@/utils'
import template from '../templates/detail/address.twig?component'

export function init (ctx) {
  const address = ctx.params.data

  fetchAddressData({
    data: address,
    page: ctx.hashQueryString,
    debugId: ctx.query.debug,
    showTx: ctx.hashQuery.showTx,
  })
  .then(data => {
    console.log(data)

    diff.innerHTML(document.getElementById('app'), template({
      ...window.__DATA__,
      data: data,
      token: data.token,
      config: window.Ethplorer && window.Ethplorer.Config || {},
    }))

    // if (data.token || (data.isContract && data.contract.isChainy)) {
    //
    //   const title = (data.isContract && data.contract.isChainy) ?
    //     'Chainy' :
    //     (token.name && stripTags(token.name) || '')

    //   widget.init('#token-price-history-grouped-widget', 'tokenPriceHistoryGrouped', {
    //     theme: 'dark',
    //     getCode: true,
    //     address: address,
    //     period: 730,
    //     options: { title },
    //   })
    // } else {
    //   widget.init('#token-price-history-grouped-widget', 'addressPriceHistoryGrouped', {
    //     theme: 'dark',
    //     getCode: true,
    //     address: address,
    //     period: 730,
    //     showTx: ctx.hashQuery.showTx,
    //   })
    // }

    // widget.loadGoogleControlCharts()

    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip()
    // })
  })
  .catch(error => {
    debugger
  })
}

function fetchAddressData (params) {
  if (!isAddress(params.data)) {
    return Promise.reject(new Error('Invalid address format'))
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      // url: 'https://ethplorer.io/service/service.php',
      url: '/service/service.php',
      dataType: 'json',
      cache: false,
      data: params,
    })
    .then(data => {
      data = {
        ...data,
        address: params.data,
        checksumAddress: toChecksumAddress(params.data),
      }

      data.token = prepareToken(data)
      resolve(data)
    }, () => {
      reject()
    })
  })
}
