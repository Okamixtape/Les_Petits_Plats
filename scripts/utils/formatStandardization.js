// Fonction permettant de mettre une majuscule sur la première lettre de la valeur donnée

export const capitalizeFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Fonction permettant la classification alaphabétique du tableau donné
export const sortAlphabetically = (array) => {
  return array.sort()
}

