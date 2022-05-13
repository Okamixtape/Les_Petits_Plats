// Fonction permettant de savoir si une valeur est "null" ou égale à "0"

export const isEmpty = (value) => {
  return value == null || value.length === 0
}

// Fonction permettant de se localiser entre une valeur max et min

export const isBetween = (min, max, value) => {
  return value.length <= max && value.length >= min
}

// Fonction permettant de filtrer dans un tableau avec "isBetween"

export const isPartiallyInArray = (array, value) => {
  value = value.toLowerCase()
  const min = value.length - 2
  const max = value.length + 2

  const result = array.filter((el) => {
    el = el.toLowerCase()

    if (!isBetween(min, max, el)) return

    return el.indexOf(value) !== -1 || `${el}s`.indexOf(value) !== -1 || value.includes(el) || `${value}s`.includes(el)
  })

  return result.length
}

// Fonction permettant de filtrer dans un tableau objet avec "isBetween"

export const isPartiallyInArrayObject = (arr, val, property) => {
  val = val.toLowerCase()
  const min = val.length - 2
  const max = val.length + 2

  const result = arr.filter((el) => {
    el = typeof el === "object" ? el[property].toLowerCase() : el

    if (!isBetween(min, max, el)) return

    return el.indexOf(val) !== -1 || `${el}s`.indexOf(val) !== -1 || val.includes(el) || `${val}s`.includes(el)
  })

  return result.length
}