export function isAddress (address) {
  return /^0x[0-9a-f]{40}$/.test(address)
}

export function isTx (hash) {
  return /^0x[0-9a-f]{64}$/.test(hash)
}
