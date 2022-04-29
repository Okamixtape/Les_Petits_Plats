// Fonction permettant de filtrer un élément dans un tableau avec "isBetween"

export const isInArray = (array, value) => {
  return array.filter((element) => isBetween(value.length - 2, value.length + 2, element) && element.toLowerCase().indexOf(value.toLowerCase()) !== -1).length
}

export const isInArrayObject = (arr, val, property) => {
  return arr.filter((el) => isBetween(val.length - 2, val.length + 2, el[property]) && el[property].toLowerCase().indexOf(val.toLowerCase()) !== -1)
    .length
}

// Fonction permettant de se localiser entre une valeur max et min

export const isBetween = (min, max, value) => {
  return value.length <= max && value.length >= min
}
