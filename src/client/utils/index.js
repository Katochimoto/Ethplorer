import $ from 'jquery'
import BigNumber from 'bignumber.js'
import { keccak256 } from 'js-sha3'

BigNumber.config({ ERRORS: false })

export function isAddress (address) {
  return /^0x[0-9a-f]{40}$/.test(address)
}

export function isTx (hash) {
  return /^0x[0-9a-f]{64}$/.test(hash)
}

export function stripTags (data) {
  return $.trim($('<textarea />').html(data).text())
}

export function encodeTags (data) {
  return $.trim($('<span>').text(data).html())
}

export function isSafari () {
  const isIphone = /(iPhone)/i.test(navigator.userAgent)
  const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
  return isIphone || isSafari
}

export function toBig (obj) {
  let res = new BigNumber(0)

  if (obj && 'string' === typeof(obj)) {
    obj = obj.replace(/,/g, '')
  }

  if (obj && 'undefined' !== typeof(obj.c)) {
    res.c = obj.c
    res.e = obj.e
    res.s = obj.s
  } else {
    res = new BigNumber(obj)
  }

  return res
}

export function round (val, decimals) {
    decimals = decimals ? parseInt(decimals) : 0;
    var parts = val.toString().split('.');
    if(parts.length > 1){
        if(parts[1].length > decimals){
            var k = decimals ? Math.pow(10, decimals) : 1;
            return Math.round(val * k) / k;
        }
    }
    return val;
}

/**
 * Number formatter (separates thousands with comma, adds zeroes to decimal part).
 *
 * @param {int} num
 * @param {bool} withDecimals
 * @param {int} decimals
 * @param {bool} cutZeroes
 * @returns {string}
 */
export function formatNum (num, withDecimals /* = false */, decimals /* = 2 */, cutZeroes /* = false */, noE /* = false */) {
    if(!num){
        num = 0;
    }
    function padZero(s, len){
        while(s.length < len) s += '0';
        return s;
    }
    if(('object' === typeof(num)) && ('undefined' !== typeof(num.c))){
        num = parseFloat(toBig(num).toString());
    }
    if('undefined' === typeof(cutZeroes)){
        cutZeroes = true;
    }
    cutZeroes = !!cutZeroes;
    withDecimals = !!withDecimals;
    decimals = ('undefined' !== typeof(decimals)) ? decimals : 2;

    if((num.toString().indexOf("e+") > 0)){
        if(noE){
            var parts = num.toString().split('e+');
            var ch = parts[0].replace('.', '');
            var st = parseInt(parts[1]) - (ch.length - 1);
            for(var i = 0; i < st; i++){
                ch += '0';
            }
            num = ch.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return num.toString();
    }
    if((num.toString().indexOf("e-") > 0) && withDecimals){
        var res = toBig(num).toFixed(decimals);
        if(cutZeroes && (res.indexOf(".") > 0)){
            res = res.replace(/0*$/, '').replace(/\.$/, '.00');
        }
        return res;
    }
    if(withDecimals){
        num = round(num, decimals);
    }
    var parts = num.toString().split('.');
    var res = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var zeroCount = cutZeroes ? 2 : decimals;
    if(withDecimals && decimals){
        if(parts.length > 1){
            res += '.';
            var tail = parts[1].substring(0, decimals);
            if(tail.length < zeroCount){
                tail = padZero(tail, zeroCount);
            }
            res += tail;
        }else{
            res += padZero('.', parseInt(zeroCount) + 1);
        }
    }
    if(cutZeroes && !decimals){
        res = res.split('.')[0];
    }
    return res;
}

export function prepareToken (data) {
  if (!data.token) {
    return
  }

  /*
  {
  ! address = '',
  ! checksumAddress = '',
  ! name = '',
  ! decimals = 0,
  ! symbol = '',
  ! owner = '',
  ! totalSupply = 0,
  createdAt = false,
  createdTx = false,
  ! estimatedDecimals = false,
  ! totalIn,
  ! totalOut,
  ! type = '',
  }
  */

  const token = {
    ...data.token
  }

  token.name = encodeTags(token.name || 'N/A')
  token.owner = token.owner === '0x' ? '' : token.owner
  token.checksumAddress = toChecksumAddress(token.address)
  token.type = token.address.toLowerCase() !== '0x55d34b686aa8c04921397c5807db9ecedba00a4c' ? 'Token' : 'Contract'

  // if(Ethplorer.Config.tokens && ('undefined' !== typeof(Ethplorer.Config.tokens[token.address]))){
  //   for(var property in Ethplorer.Config.tokens[token.address]){
  //     token[property] = Ethplorer.Config.tokens[token.address][property];
  //   }
  // }

  token.decimals = parseFloat(toBig(token.decimals).toString())
  token.totalSupply = toBig(token.totalSupply)

  if (token.decimals) {
    // To handle ether-like tokens with 18 decimals
    if (token.decimals > 20) { // Too many decimals, must be invalid value, use 0 instead
      token.decimals = 0
    }
    const k = Math.pow(10, token.decimals)
    if (isSafari()) {
      token.totalSupply = parseFloat(token.totalSupply.toString()) / k
    } else {
      token.totalSupply = token.totalSupply.div(k)
    }
    token.totalIn = token.totalIn / k
    token.totalOut = token.totalOut / k
  }

  if (parseFloat(token.totalSupply.toString()) >= 1e+18) {
    if (!token.decimals) {
      token.estimatedDecimals = true
      token.decimals = 18
    }
  }

  token.totalSupply = formatNum(token.totalSupply, true, token.decimals, true);
  token.totalIn = formatNum(token.totalIn, true, token.decimals, true);
  token.totalOut = formatNum(token.totalOut, true, token.decimals, true);

  if (token.symbol) {
    token.totalSupply = token.totalSupply + ' ' + token.symbol
    token.totalIn = token.totalIn + ' ' + token.symbol
    token.totalOut = token.totalOut + ' ' + token.symbol
  }

  if (
    data.isContract &&
    data.contract &&
    data.contract.txsCount &&
    data.contract.txsCount > token.txsCount
  ) {
    token.txsCount = data.contract.txsCount
  }

  return token
}

export function isHexPrefixed (str) {
  str = String(str || '')
  return str.slice(0, 2) === '0x'
}

export function stripHexPrefix (str) {
  str = String(str || '')
  return isHexPrefixed(str) ? str.slice(2) : str
}

export function toChecksumAddress (address) {
  address = String(address || '')
  address = stripHexPrefix(address).toLowerCase()
  const hash = keccak256(address).toString('hex')
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

export function getEthplorerLink (data, text, isContract) {
  text = text || data
  if (!/^0x/.test(data)) {
    return text
  }

  if (text.indexOf('<') >= 0 || text.indexOf('>') >= 0) {
    text = encodeTags(text)
  }

  return `${isContract ? 'Contract ' : ''}<a href="/${isTx(data) ? 'tx' : 'address'}/${data}">${text}</a>`
}

export function getEtherscanLink (data, text, isContract) {
  text = text || data
  text = encodeTags(text)

  if (!/^0x/.test(data)) {
    return text
  }

  return isContract ? `Contract ${text}` : text
}

export function ts2date (ts, withGMT = true) {
  ts *= 1000
  function padZero(s) {
    return (s < 10) ? '0' + s : s.toString()
  }

  const dt = new Date(ts)
  let res = ''
  res += (dt.getFullYear() + '-' + padZero((dt.getMonth() + 1)) + '-' + padZero(dt.getDate()))
  res += ' '
  res += (padZero(dt.getHours()) + ':' + padZero(dt.getMinutes()) + ':' + padZero(dt.getSeconds()))

  if (withGMT) {
    res += (' (' + getTZOffset() + ')');
  }

  return res;
}

export function getTZOffset () {
  const offset = -Math.round(new Date().getTimezoneOffset() / 60)
  return 'GMT' + (offset > 0 ? '+' : '-') + offset
}

export function getDiffString (diff) {
  if ('undefined' === typeof diff) {
      return '--'
  }
  let str = '' //(diff > 0 ? '+' : '');
  str += formatNumWidget(diff, true, 2, true, true) + '%'
  return str
}

/**
 * Number formatter (separates thousands with comma, adds zeroes to decimal part).
 *
 * @param {int} num
 * @param {bool} withDecimals
 * @param {int} decimals
 * @param {bool} cutZeroes
 * @returns {string}
 */
export function formatNumWidget (num, withDecimals /* = false */, decimals /* = 2 */, cutZeroes /* = false */, withPostfix /* = false */, numLimitPostfix /* = 999999 */) {
  var postfix = '';
  if (withPostfix) {
    if(!numLimitPostfix) numLimitPostfix = 999999;
    if(Math.abs(num) > 999 && Math.abs(num) <= numLimitPostfix){
      num = num / 1000;
      postfix = ' K';
    } else if(Math.abs(num) > numLimitPostfix){
      num = num / 1000000;
      postfix = ' M';
    }
  }
  function padZero(s, len){
    while(s.length < len) s += '0';
    return s;
  }
  if(('object' === typeof(num)) && ('undefined' !== typeof(num.c))){
    num = parseFloat(toBig(num).toString());
  }
  cutZeroes = !!cutZeroes;
  withDecimals = !!withDecimals;
  // decimals = decimals || (cutZeroes ? 0 : 2);

  if((num.toString().indexOf("e+") > 0)){
    return num.toString();
  }

  if((num.toString().indexOf("e-") > 0) && withDecimals){
    var parts = num.toString().split("e-");
    var res = parts[0].replace('.', '');
    for(var i=1; i<parseInt(parts[1]); i++){
      res = '0' + res;
    }
    return '0.' + res;
  }

  if(withDecimals){
    num = round(num, decimals);
  }
  var parts = num.toString().split('.');
  var res = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  var zeroCount = cutZeroes ? 0 : decimals;
  if(withDecimals && decimals){
    if(parts.length > 1){
      res += '.';
      var tail = parts[1].substring(0, decimals);
      if(tail.length < zeroCount){
        tail = padZero(tail, zeroCount);
      }
      res += tail;
    }else{
      res += padZero('.', parseInt(zeroCount) + 1);
    }
  }
  res = res.replace(/\.$/, '');
  return res + postfix;
}
