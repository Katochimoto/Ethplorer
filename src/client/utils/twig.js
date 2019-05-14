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
} from '@/utils'

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

Twig.extendFilter('ethplorer', (value, [data, options]) => {
  if (!value) {
    return ''
  }

  data = data || {}
  data.contracts = data.contracts || []
  options = Array.isArray(options) ? options : [options]

  let text = value
  if (text && isAddress(text)) {
    text = toChecksumAddress(value)
  }

  return getEthplorerLink(
    value,
    text,
    options.includes('no-contract') ? false : data.contracts.includes(value)
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

Twig.extendFilter('localdate', value => {
  if (!value) {
    return ''
  }

  return ts2date(value, true)
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


