// Importation des utils JS nécessaires

import { capitalizeFirstLetter, sortAlphabetically } from "../utils/formatStandardization.js"
import { isPartiallyInArray } from "../utils/validationStandardization.js"

// Importation du tableau des données JSON

import jsonRecipes from "../../data/recipes.js"

// Création du component "DataList" qui gère l'affichage des boutons de filtre 
// des ingrédients, appareils et ustensiles
class DataList {
  constructor(element) {
    this.element = element
    this.type = element.getAttribute("data-type")

    this.list = []

    this.opened = false
    this.expanded = false

    this.init()
  }

  // Initialisation asynchrone des fonctions de récupération et d'affichage des données JSON
  init = async () => {
    this.data = await this.getData()
    this.list = await this.displayData()

    this.dataListBehaviour()
  }

  // Fonction principale 
  dataListBehaviour = () => {
    const input = this.element.querySelector("input")
    const expand = this.element.querySelector('[data-action="expand"]')
    const listElements = this.element.querySelectorAll("li")
    const list = document.querySelector('[data-component="list"]')
    // console.log(list);

    this.element.addEventListener("search", this.toggleSearch)

    input.addEventListener("input", this.searchData)

    expand.addEventListener("click", this.toggleExpand)

    listElements.forEach((li) => li.addEventListener("click", this.selectListElement))

    list.addEventListener("updatelist", this.updateData)

    document.addEventListener("click", this.handleClick)
  }
  
  // Fonction permettant de récupérer les données JSON
  // et de les classer par ordre alphabétique et avec une majuscule
  getData = (recipes = jsonRecipes) => {
    return new Promise((resolve) => {
      let data = []

      // Méthode pour créer un nouveau tableau et classer ses valeurs par ordre alphabétique en remplacant la première lettre par une majuscule
      recipes.map((recipe) => {
        const values = recipe[this.type]

        // Méthode pour déterminer si l'objet passé en argument est un objet Array, 
        // renvoie true si le paramètre est de type Array ou false dans le cas contraire
        Array.isArray(values)
          ? values.map((value) => {
              this.type === "ingredients" && (value = value.ingredient)
              !isPartiallyInArray(data, value) && data.push(capitalizeFirstLetter(value))
            })
          : !isPartiallyInArray(data, values) && data.push(capitalizeFirstLetter(values))
      })

      resolve(sortAlphabetically(data))
    })
  }

  updateData = async (e) => {
    const { updatedRecipes } = e
    const data = await this.getData(updatedRecipes)

    this.list.forEach((list) => {
      list.classList.add("hidden")

      data.forEach((data) => {
        if (data === list.textContent) list.classList.remove("hidden")
      })
    })
  }

  // Fonction permettant d'afficher les données JSON dans le DOM
  // Série de item <li></li> dans un <ul></ul>
  displayData = () => {
    return new Promise((resolve) => {
      const wrapper = this.element.querySelector("ul")

      this.data.map((item) => (wrapper.innerHTML += `<li>${item}</li>`))

      resolve(wrapper.querySelectorAll("li"))
    })
  }

  // Fonction permettant d'afficher les données de recherche (à partir de 3 caractères entrés)
  // et de cacher celles hors du scope de recherche
  searchData = (e) => {
    // On mets toutes les valeurs en minuscules (pour éviter conflits minuscules / majuscules)
    const value = e.target.value.toLowerCase()
    const hiddenElements = this.element.querySelectorAll("li.hidden")

    // Répercution du "remove" de la classe "hidden" pour tous les li déjà masqués
    hiddenElements.forEach((element) => element.classList.remove("hidden"))

    // Si la valeur entrée est inférieur à trois caractères la liste ne se déplie pas
    if (value.length < 3) return this.toggleOpen(false)

    // Vérification que chaque élément du tableau ne comporte par la valeur recherché, dans ce cas ajout de la classe "hidden"
    this.list.forEach((element) => !element.textContent.toLowerCase().includes(value) && element.classList.add("hidden"))

    this.element.dispatchEvent(new Event("search"))
  }

  // Fonction permettant la gestion de basculement de l'état de liste "expanded"
  toggleExpand = () => {
    this.element.classList.toggle("expanded")
    this.expanded = !this.expanded

    this.expanded && this.element.dispatchEvent(new Event("expand"))
  }

  // Fonction permettant de basculer à l'état "ouvert" ou "fermé" de la liste
  toggleOpen = (state = true) => {
    const stateToggle = state ? "add" : "remove"

    this.element.classList[stateToggle]("opened")
    this.opened = !this.opened
  }

  // Fonction permettant de cacher des li de la liste lors de la recherche
  toggleSearch = () => {
    const hiddenElements = this.element.querySelectorAll("li.hidden")

    hiddenElements.length < this.list.length && hiddenElements.length != 0 ? this.toggleOpen() : this.toggleOpen(false)
  }

  // Fonction en lien à la gestion du click sur les éléments de liste (en fonction des attributs classe opened/expanded)
  handleClick = (e) => {
    if ((!this.opened && !this.expanded) || this.element.contains(e.target)) 

    return

    this.opened && this.toggleOpen(false)
    this.expanded && this.toggleExpand()
  }

  // Fonction permettant la sélection d'un élément dans la liste des filtres
  selectListElement = (e) => {
    const event = new Event("tag")
    event["tagType"] = this.type

    e.target.dispatchEvent(event)
  }
}

export default DataList
