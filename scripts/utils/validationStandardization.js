// Fonction permettant de savoir si une valeur est "null" ou égale à "0"

export const isEmpty = (value) => {
  return value == null || value.length === 0
}

// Fonction permettant de se localiser entre une valeur max et min

export const isBetween = (min, max, value) => {
  return value.length <= max && value.length >= min
}


// Fonction permettant de filtrer dans un tableau avec "isBetween"

export const isInArray = (array, value) => {
  return array.filter((element) => isBetween(value.length - 2, value.length + 2, element) && element.toLowerCase().indexOf(value.toLowerCase()) !== -1).length
}

// Fonction permettant de filtrer un objet dans un tableau avec "isBetween"

export const isInArrayObject = (array, value, property) => {
  return array.filter((element) => isBetween(value.length - 2, value.length + 2, element[property]) && element[property].toLowerCase().indexOf(value.toLowerCase()) !== -1).length
}