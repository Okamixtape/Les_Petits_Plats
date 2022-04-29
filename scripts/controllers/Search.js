// Importation des constructors nécessaires

import DataList from "../components/Datalist.js"
import Tag from "../components/Tag.js"

// Importation du tableau des données JSON via le constructor "List"

import List from "../components/List.js"

// Création du controller "Search"
class Search {
  constructor() {

    this.dataLists = []
    this.tags = []

    this.init()
    this.list = new List()
  }

  // Initialisation asynchrone (attente de la fonction getDataLists)
  init = async () => {
    this.dataLists = await this.getDataLists()

    this.searchBehaviour()
  }

  // Fonction principale
  searchBehaviour = () => {
    this.dataListsEvents()
  }

  // Récupération des listes de data
  getDataLists = () => {
    return new Promise((resolve) => {
      const dataListsElement = document.querySelectorAll('[data-component="datalist"]')
      let dataLists = []

      dataListsElement.forEach((d) => dataLists.push(new DataList(d)))

      resolve(dataLists)
    })
  }

  // Déclaration des évènements de dataLists
  dataListsEvents = () => {
    this.dataLists.map((d) => {
      const listElements = d.element.querySelectorAll("li")

      d.element.addEventListener("expand", this.closeExpandedDataLists)

      listElements.forEach((l) => {
        l.addEventListener("tag", this.createTag)
        l.addEventListener("removeTag", this.removeTag)
      })
    })
  }

  // Fonction permettant de fermer les autres listes quand une est ouverte
  closeExpandedDataLists = (e) => {
    this.dataLists.map((d) => d.element !== e.target && d.expanded && d.toggleExpand())
  }

  // Fonction permettant de créer un tag
  createTag = (e) => {
    const tag = new Tag(e.target.textContent, e.tagType, e.target)

    this.tags.push(tag)
  }

  // ou de le supprimer
  removeTag = (e) => {
    this.tags = this.tags.filter((t) => t.listElement !== e.target)
  }
}

export default Search
