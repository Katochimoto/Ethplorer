import classnames from 'classnames'
import Twig from 'twig'
import {
  formatNum,
  round,
  isAddress,
  toChecksumAddress,
  getEthplorerLink,
  getEtherscanLink,
  ts2date,
  getDiffString,
  prepareToken,
  isSafari,
  toBig,
  getHistDiffPriceString,
} from '@/utils'

Twig.extendFilter('txValue', value => {
  return value
})

Twig.extendFilter('int', value => formatNum(value))

Twig.extendFilter('float', value => formatNum(value, true))

Twig.extendFilter('ether', value => {
  if (value < 0) {
    return 'N/A'
  }

  return formatNum(value, true, 18, true) + '&nbsp;<i class="fab fa-ethereum"></i>&nbsp;ETH'
})

Twig.extendFilter('ether-gwei', value => {
  if (value < 0) {
    return 'N/A'
  }

  let gwei = toBig(value).mul(Math.pow(10, 9)).toString()
  gwei = formatNum(gwei, true, 3, true).toString()

  if (gwei.toString().indexOf('.') > 0) {
    gwei = gwei
      .replace(/0*$/, '', 'g')
      .replace(/\.$/, '', 'g')
  }

  return formatNum(value, true, 18, true) + '&nbsp;<i class="fab fa-ethereum"></i>&nbsp;ETH&nbsp;(' + gwei + '&nbsp;Gwei)'
})

Twig.extendFilter('ether-full', (value, [data]) => {
  if (value < 0) {
    return 'N/A'
  }

  let res = formatNum(value, true, 18, true) + '&nbsp;<i class="fab fa-ethereum"></i>&nbsp;ETH'

  if (value) {
    const price = formatNum(data.ethPrice.rate * value, true, 2, true)
    if (true || ('0.00' !== price)) {
      const change = data.ethPrice.diff
      const cls = change > 0 ? 'diff-up' : 'diff-down'
      const diff = ''
      // const diff = change ? (' <span class="' + cls + '">(' + round(change, 2) + '%)</span>') : ''
      res = res + '<br /><span class="tx-value-price">$ ' + price + diff + '</span>'
    }
  }

  return res
})

Twig.extendFilter('ethplorer', (value, [data, options, text, attrs]) => {
  if (!value) {
    return ''
  }

  data = data || {}
  data.contracts = data.contracts || []
  options = Array.isArray(options) ? options : [options]
  text = text || value

  if (text && isAddress(text)) {
    text = toChecksumAddress(value)
  }

  return getEthplorerLink(
    value,
    text,
    options.includes('no-contract') ? false : data.contracts.includes(value),
    attrs
  )
})

Twig.extendFilter('etherscan', (value, [data, options]) => {
  if (!value) {
    return ''
  }

  data = data || {}
  data.contracts = data.contracts || []
  options = Array.isArray(options) ? options : [options]

  return getEtherscanLink(
    value,
    value,
    options.includes('no-contract') ? false : data.contracts.includes(value)
  )
})

Twig.extendFilter('localdate', (value, [withGMT]) => {
  if (!value) {
    return ''
  }

  return ts2date(value, withGMT)
})

Twig.extendFilter('price', value => {
  if (!value || !value.rate) {
    return ''
  }

  var rate = value
  var hint = 'Updated at ' + ts2date(rate.ts, true)
  var price = rate.rate < 0.01 ? rate.rate : formatNum(rate.rate, true, rate.rate < 0.1 ? 4 : 2, true)

  value = '<span title="' + hint + '">$&nbsp;' + price + '</span><br>'

  value = value + '<span class="diff-span">24h<span class="' + getDiffClass(rate.diff) + '">'
    + getDiffString(rate.diff) +'</span></span>'
  value = value + '<span class="diff-span">7d<span class="' + getDiffClass(rate.diff7d) + '">'
    + getDiffString(rate.diff7d) +'</span></span>'
  value = value + '<span class="diff-span">30d<span class="' + getDiffClass(rate.diff30d) + '">'
    + getDiffString(rate.diff30d) +'</span></span>'

  return value
})

Twig.extendFilter('holderBalance', (balance, [data]) => {
  if (data.token.decimals) {
    balance = balance / Math.pow(10, data.token.decimals)
  }

  balance = formatNum(balance, true, data.token.decimals, true)

  if (data.token.symbol) {
    balance = balance + ' ' + data.token.symbol
  }

  if (data.token.price && data.token.price.rate) {
    let pf = parseFloat(balance.replace(/\,/g,'').split(' ')[0])
    if (pf) {
      pf = round(pf * data.token.price.rate, 2)
      const usdval = formatNum(Math.abs(pf), true, 2, true)
      balance = balance + '<br><span class="transfer-usd">$&nbsp;' + usdval + '</span>'
    }
  }

  return balance
})

Twig.extendFunction('txQty', function (tx, data) {
  const txToken = tx.isEth ?
    ({
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      decimals: 18,
      symbol: 'ETH',
      totalSupply: 0,
      price: data.ethPrice,
    }) :
    prepareToken(data.srcToken || data.tokens[tx.contract], data)

  let qty = parseFloat(tx.value)

  if (!tx.isEth) {
    const k = Math.pow(10, txToken.decimals)
    if (isSafari()) {
      qty = qty / k
    } else {
      qty = parseFloat(toBig(tx.value).div(k).toString())
    }
  }

  let value = formatNum(qty, true, txToken.decimals, 2) + ' ' +
    (tx.isEth ? '<i class="fab fa-ethereum"></i> ' : '') +
    txToken.symbol

  const address = data.address.toLowerCase()
  if (tx.from === address && tx.to !== address) {
    value = '-' + value
  }

  if (!tx.from && tx.address) {
    value = (tx.type && ('burn' === tx.type)) ? '-' + value + '<br>&#128293;&nbsp;Burn' : value + '<br>&#9874;&nbsp;Issuance'
  }

  var pf = parseFloat(value.replace(/\,/g, '').split(' ')[0])
  var usdPrice = ''

  if (pf) {
    let price = tx.usdPrice
    // Fill the tx.usdPrice if tx age less 10 minutes, because of delay price update scripts
    if (!tx.usdPrice && txToken.price && txToken.price.rate && ((new Date().getTime()/1000 - tx.timestamp ) / 60 < 10)) {
      price = txToken.price.rate
    }

    if (txToken.price && txToken.price.rate) {
      const usdval = formatNum(Math.abs(round(pf * txToken.price.rate, 2)), true, 2, true)
      value = value + '<br/><span class="transfer-usd" title="now">$&nbsp;' + usdval +
        getHistDiffPriceString(price, txToken.price.rate) + '</span>'
    }

    if (price) { //  && Ethplorer.showHistoricalPrice
      var hint = 'estimated at tx date'
      var totalHistoryPrice = formatNum(Math.abs(round(pf * price, 2)), true, 2, true)
      var historyPrice = formatNum(Math.abs(round(price, 2)), true, 2, true)

      if (historyPrice === '0.00') {
        historyPrice = '>0.00'
      }

      usdPrice = '<span class="historical-price"  title="' + hint + '">~$&nbsp;'
        + totalHistoryPrice +'<span class="mrgnl-10">@&nbsp;'+ historyPrice +'</span></span>'
    }
  }

  if (usdPrice) {
    value += '<br/>' + usdPrice
  }

  return value
})

Twig.extendFunction('txToken', function (tx, data) {
  const txToken = tx.isEth ?
    ({
      address: '0x0000000000000000000000000000000000000000',
      name: 'Ethereum',
      decimals: 18,
      symbol: 'ETH',
      totalSupply: 0,
      price: data.ethPrice,
    }) :
    prepareToken(data.srcToken || data.tokens[tx.contract], data)

  return getEthplorerLink(tx.contract, txToken.name, false)
})

Twig.extendFunction('txFrom', function (tx, data) {
  if (!tx.from) {
    return ''
  }

  const address = data.address.toLowerCase()

  if (tx.from === address) {
    return `<span class="same-address">${address}</span>`
  }

  return getEthplorerLink(tx.from)
})

Twig.extendFunction('txTo', function (tx, data) {
  if (!tx.to) {
    return ''
  }

  const address = data.address.toLowerCase()

  if (tx.to === address) {
    return `<span class="same-address">${address}</span>`
  }

  return getEthplorerLink(tx.to)
})

Twig.extendFunction('txAddress', function (tx, data) {
  const address = data.address.toLowerCase()

  if (tx.address === address) {
    return `<span class="same-address">${address}</span>`
  }

  return tx.address
})

Twig.extendFunction('generatePageRange', function (ctx, config, pager) {
  const pageSize = ctx.getStateParam('pageSize')
  const { page, records, total } = pager

  if (!records) {
    return []
  }

  const pageCount = Math.ceil(records / pageSize)
  const delta = 4
  const range = []

  for (let i = Math.max(2, (page - delta)); i <= Math.min((pageCount - 1), (page + delta)); i += 1) {
    range.push(i)
  }

  if ((page - delta) > 2) {
    range.unshift('...')
  }

  if ((page + delta) < (pageCount - 1)) {
    range.push('...')
  }

  range.unshift(1)
  if (pageCount !== 1) {
    range.push(pageCount)
  }

  return range
})

Twig.extendFunction('classnames', function (...args) {
  return classnames(...args)
})
