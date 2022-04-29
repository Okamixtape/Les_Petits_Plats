
import { contentSlice } from "../utils/formatStandardization.js"
import { isInArrayObject } from "../utils/validationStandardization.js"

import recipes from "../../data/recipes.js"

class List {
  constructor() {
    this.element = document.querySelector('[data-component="list"]')
    this.recipes = recipes
    this.currentRecipes = this.recipes
    this.nodeRecipes = []

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
  handleSearch = (e) => {
    const value = e.target.value.toLowerCase()

    this.resetRecipes()

    if (value.length < 3) return

    this.currentRecipes = this.recipes.filter(
      (r) => r.name.toLowerCase().includes(value) || r.description.toLowerCase().includes(value) || isInArrayObject(r.ingredients, value, "ingredient")
    )

    this.displayRecipes()
  }

  displayRecipes = () => {
    return new Promise((resolve) => {
      this.element.innerHTML = ""

      this.currentRecipes.map((r) => {
        let recipeCard = `<article class="recipe-card"><div class="card__wrapper">`
        recipeCard += `<div class="card__media"></div>`
        recipeCard += `<div class="card__infos"><div class="card__header">`
        recipeCard += `<h2 class="card__title">${r.name}</h2><div class="card__time">${r.time} min</div>`
        recipeCard += `</div><div class="card__body">`
        recipeCard += `<div class="card__details"><ul>`

        r.ingredients.map((i) => (recipeCard += `<li><b>${i.ingredient}:</b> ${i.quantity ? i.quantity : ""} ${i.unit ? i.unit : ""}</li>`))

        recipeCard += `</ul></div><div class="card__description">${contentSlice(r.description)}</div>`
        recipeCard += `</div></div></article>`

        this.element.innerHTML += recipeCard

        resolve(this.element.querySelectorAll("article"))
      })
    })
  }

  resetRecipes = async () => {
    this.currentRecipes = recipes
    await this.displayRecipes()
  }
}

export default List
