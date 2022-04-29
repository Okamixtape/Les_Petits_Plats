// Création du component "Tag"
class Tag {
  constructor(name, type, listElement) {
    this.element = null
    this.listElement = listElement
    this.name = name
    this.type = type

    this.init()
  }

  // Initialisation asynchrone (attente de la fonction displayTag)
  init = async () => {
    this.element = await this.displayTag()
    this.toggleHide()

    this.tagBehaviour()
  }

  // Fonction principale 
  tagBehaviour = () => {
    const remove = this.element.querySelector("button")

    remove.addEventListener("click", this.removeTag)
  }

  // Fonction permettant d'afficher le bouton tag dans le DOM
  displayTag = () => {
    return new Promise((resolve) => {
      const wrapper = document.querySelector('[data-content="tags"]')
      const tagElement = document.createElement("div")

      tagElement.className = "tag"
      tagElement.dataset.name = this.name
      tagElement.dataset.type = this.type
      tagElement.innerHTML =
        `<div class="tag__wrapper"><b class="tag__name">${this.name}</b>` +
        `<button class="tag__remove"><img src="./assets/img/icons/close.svg" alt="Supprimer le tag" /></button>` +
        `</div>`

      wrapper.appendChild(tagElement)

      resolve(tagElement)
    })
  }

  // Fonction permettant d'enlever le bouton
  removeTag = (e) => {
    e.preventDefault()

    this.element.remove()
    this.toggleHide()

    this.listElement.dispatchEvent(new Event("removeTag"))
  }

  // Fonction permettant d'indiquer qu'un élément de la liste a été ajouté en tant que tag
  toggleHide = () => {
    this.listElement.classList.toggle("tagged")
  }
}

export default Tag
