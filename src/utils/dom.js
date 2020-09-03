export function addClass (el, className) {
  if (hasClass(el, className)) return
  const newClass = el.className.split(' ')
  console.log(newClass)
  newClass.push(className)
  el.className = newClass.join(' ')
  // console.log(newClass)
}

export function hasClass (el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
