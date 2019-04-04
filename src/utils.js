export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomPop(array) {
  return array.splice(Math.floor(Math.random() * array.length), 1)[0]
}

export function round(n, d) {
  if (typeof n === 'undefined') return

  const h = 10 ** d

  return Math.round(n * h) / h
}
