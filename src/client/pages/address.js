import $ from 'jquery'
import { isAddress } from '@/utils'

export function init (ctx) {
  fetchAddressData({
    data: ctx.params.address,
    page: ctx.hashQueryString,
    debugId: ctx.query.debug,
    showTx: ctx.hashQuery.showTx,
  })
  .then(data => {
    console.log(data)
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
      resolve(data)
    }, () => {
      reject()
    })
  })
}
