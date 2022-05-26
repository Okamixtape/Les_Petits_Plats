// Importation des constructors nécessaires

import DataList from "../components/Datalist.js"
import RecipesList from "../components/RecipesList.js" // Importation du tableau des données JSON via le constructor "recipesList"
import Tag from "../components/Tag.js"

// Création du controller "Search"
class Search {
  constructor() {

    this.dataLists = []
    this.tags = []

    this.list = new RecipesList()

    this.init()
  }

  // Initialisation asynchrone (attente de la fonction getDataLists)
  init = async () => {
    this.dataLists = await this.getDataLists()

    this.searchBehaviour()
  }

  // Fonction principale
  searchBehaviour = () => {
    this.dataListsEvents()
    this.tagsEvents()
  }

  // Appel de la fonction addEventListener "expand" sur chaque élément du tableau dataList
  dataListsEvents = () => {
    this.dataLists.map((dataList) => dataList.element.addEventListener("expand", this.closeExpandedDataLists))
  }

  // Méthode pour fermer les autres listes quand une est ouverte
  closeExpandedDataLists = (e) => {
    this.dataLists.map((dataList) => dataList.element !== e.target && dataList.expanded && dataList.toggleExpand())
  }

  // Récupération et création des listes de data
  getDataLists = () => {
    return new Promise((resolve) => {
      const dataListsElement = document.querySelectorAll('[data-component="datalist"]')
      let dataLists = []

      dataListsElement.forEach((dataList) => dataLists.push(new DataList(dataList)))

      resolve(dataLists)
    })
  }

  // Déclaration des évènements de tags
  tagsEvents = () => {
    this.dataLists.map((dataList) => {
      const listElements = dataList.element.querySelectorAll("li")

      listElements.forEach((list) => {
        list.addEventListener("tag", this.createTag)
        list.addEventListener("deleteTag", this.removeTag)
      })
    })
  }

  // Fonction permettant de créer un tag
  createTag = (e) => {
    const tag = new Tag(e.target.textContent, e.tagType, e.target)

    this.list.addTag(tag)
    this.tags.push(tag)
  }

  // ou de le supprimer
  removeTag = (e) => {
    this.tags = this.tags.filter((tag) => tag.listElement !== e.target)
    this.list.removeTag(e)
  }
}

export default Search
