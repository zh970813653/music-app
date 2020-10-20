export function addClass (el, className) {
  if (hasClass(el, className)) return
  const newClass = el.className.split(' ')
  // console.log(newClass)
  newClass.push(className)
  el.className = newClass.join(' ')
  // console.log(newClass)
}

export function hasClass (el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  }
  return el.getAttribute(name)
}

const elementStyle = document.createElement('div').style

const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTreansform',
    Moz: 'MozTransform',
    o: 'oTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (!vendor) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
