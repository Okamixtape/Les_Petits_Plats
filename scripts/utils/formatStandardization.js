// Fonction permettant de mettre une majuscule sur la première lettre de la valeur donnée

export const capitalizeFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Fonction permettant la classification alphabétique du tableau donné
export const sortAlphabetically = (array) => {
  return array.sort()
}

// Fonction permettant de réduire à 180 caractères la description des plats
export const contentSlice = (value) => {
  return value.slice(0, 180) + "..."
}
