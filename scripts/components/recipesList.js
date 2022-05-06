
import { contentSlice } from "../utils/formatStandardization.js"
import { isEmpty, isInArray, isInArrayObject } from "../utils/validationStandardization.js"

import recipes from "../../data/recipes.js"

class recipesList {
  constructor() {
    this.element = document.querySelector('[data-component="list"]')
    this.recipes = recipes
    this.currentRecipes = this.recipes
    this.nodeRecipes = []

    this.query = document.querySelector("input#input__search").value
    this.tags = []

    this.init()
  }

  init = async () => {
    this.nodeRecipes = await this.displayRecipes()

    this.listBehaviour()
  }

  listBehaviour = () => {
    const input = document.querySelector("input#input__search")

    input.addEventListener("input", this.handleSearch)
  }

  // Fonction de recherche
  handleSearch = async (e) => {
    const value = e ? e.target.value.toLowerCase() : this.query.toLowerCase()

    this.refreshRecipes()

    this.query = value

    if (value.length < 3 && !this.tags.length) return

    this.currentRecipes = this.currentRecipes.filter(
      (recipe) => recipe.name.toLowerCase().includes(value) || recipe.description.toLowerCase().includes(value) || isInArrayObject(recipe.ingredients, value, "ingredient" || "appareil" || "ustensile" )
    )

    this.tags.map((tag) => {
      const tagValue = tag.name.toLowerCase()
      const tagType = tag.type

      this.currentRecipes = this.currentRecipes.filter((recipe) =>
        Array.isArray(recipe[tagType]) ? isInArray(recipe[tagType], tagValue) || isInArrayObject(recipe[tagType], tagValue, "ingredient" || "appareil" || "ustensile" ) : recipe[tagType].toLowerCase().includes(tagValue)
      )
    })

    this.nodeRecipes = await this.displayRecipes()
  }


  addTag = (tag) => {
    this.tags.push(tag)

    this.handleSearch()
  }

  removeTag = (e) => {
    this.tags = this.tags.filter((tag) => tag.listElement !== e.target)

    this.handleSearch()
  }

  displayRecipes = () => {
    return new Promise((resolve) => {
      if (isEmpty(this.currentRecipes)) return resolve(this.displayNotFoundMessage() && [])

      this.element.innerHTML = ""

      this.currentRecipes.map((recipe) => {
        let recipeCard = 
        `<article class="recipe-card"><div class="card__wrapper">
          <div class="card__media"></div>
          <div class="card__infos">
            <div class="card__header">
              <h2 class="card__title">${recipe.name}</h2><div class="card__time">${recipe.time} min</div>
            </div>
            <div class="card__body">
              <div class="card__details">
                <ul>`

        recipe.ingredients.map((i) => (recipeCard += `<li><b>${i.ingredient}:</b> ${i.quantity ? i.quantity : ""} ${i.unit ? i.unit : ""}</li>`))

        recipeCard += 
                `</ul>
              </div>
              <div class="card__description">${contentSlice(recipe.description)}</div>
            </div>
          </div>
        </article>`

        this.element.innerHTML += recipeCard

        resolve(this.element.querySelectorAll("article"))
      })
    })
  }

  refreshRecipes = async () => {
    this.currentRecipes = this.recipes

    this.nodeRecipes = await this.displayRecipes()
  }

  displayNotFoundMessage = () => {
    return new Promise((resolve) => {
      this.element.innerHTML = ""

      let notFoundMessage = `<div class="search__notfound">
                              <div class="notfound__wrapper">
                                <div class="notfound__header">
                                  <h2 class="notfound__title">Aucune recette ne correspond à votre recherche ...</h2>
                                </div>
                                <div class="notfound__body">
                                  <p class="notfound__text">Vous pourriez essayer de chercher de nouveau le nom d'une recette ou d'un ingrédient.</p>
                                </div>
                              </div>
                            </div>`

      this.element.innerHTML += notFoundMessage
      
      resolve(this.element.querySelectorAll("search__list"))
    })
  }
}

export default recipesList