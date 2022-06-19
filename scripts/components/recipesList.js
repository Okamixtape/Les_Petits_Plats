// Importation des utils nécessaires

import { contentSlice } from "../utils/formatStandardization.js"
import { isEmpty, isPartiallyInArrayObject, isPartiallyInArray } from "../utils/validationStandardization.js"

// Importation du tableau JSON de recettes

import recipes from "../../data/recipes.js"

// Création de la liste de recettes sous la barre de recherche et les tags
class RecipesList {
  constructor() {
    this.element = document.querySelector('[data-component="list"]')
    this.query = document.querySelector("input#input__search").value

    // Toutes les recettes
    this.recipes = recipes

    // Les recettes apparaissant lors d'une recherche
    this.currentRecipes = this.recipes

    this.nodeRecipes = []
    this.tags = []

    this.init()
  }

  // Initialisation asynchrone (attente de la fonction displayRecipes)
  init = async () => {
    this.nodeRecipes = await this.displayRecipes()

    this.listBehaviour()
  }

  // Affichage dans le DOM des cartes de recette
  displayRecipes = () => {
    return new Promise((resolve) => {
      if (isEmpty(this.currentRecipes)) return resolve(this.displayNotFoundMessage() && [])

      this.element.innerHTML = ""

      // Création d'un nouveau tableau à partir du tableau "recette" pour créer toutes les "recipeCard" de recette
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

        // Création d'un nouveau tableau à partir du tableau "ingrédient"
        recipe.ingredients.map((ingredient) => (recipeCard += `<li><b>${ingredient.ingredient}:</b> ${ingredient.quantity ? ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""}</li>`))

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

  // Affichage d'un message indiquant que la recherche n'a pas abouti
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

  // Fonction principale : input d'ingrédients/appareils/ustensiles dans la barre de recherche
  // pour faire ressortir liste de recettes en adéquation (qui inclut l'élément recherché)
  listBehaviour = () => {
    const input = document.querySelector("input#input__search")

    input.addEventListener("input", this.handleSearch)
  }

  // Fonction de recherche dans la barre de recherche
  handleSearch = async (e) => {
    // Standardisation des valeurs en minuscules pour éviter les conflits
    const value = e ? e.target.value.toLowerCase() : this.query.toLowerCase()

    this.refreshRecipes()

    this.query = value

    // Apparition de la liste de recettes à partir de trois caractères rentrés
    if (value.length < 3 && isEmpty(this.tags)) return

    // Intégrer la fonction native de recherche (V2)

    // Recherche par plats 
    // Méthode pour retourner un nouveau tableau avec les éléments du tableau d'origine et qui remplissent les conditions
    // this.currentRecipes = this.currentRecipes.filter(
    //   (recipe) => recipe.name.toLowerCase().includes(value) || recipe.description.toLowerCase().includes(value) || isPartiallyInArrayObject(recipe.ingredients, value, "ingredient")
    // )

    let results = []

    // If tout seul : et / Else If : ou bien //
    for (const currentRecipe of this.currentRecipes) {
      // Si le nom d'une recette corresponds à la value de la barre de recherche
      if (currentRecipe.name.toLowerCase().includes(value)) {
        results.push(currentRecipe)
      }
      if (currentRecipe.description.toLowerCase().includes(value)) {
        results.push(currentRecipe)
      }
      for (const ingredient of currentRecipe.ingredients) {
        if (ingredient.ingredient.toLowerCase().includes(value.toLowerCase()))
        results.push(currentRecipe)
      }
    }

    this.currentRecipes = results

    // console.log(results) : des objets sont en double

    // Retrait des objets en double avec l'id de l'objet
    const removeDuplicates = results.filter(currentRecipe => {
      const isDuplicate = results.includes(currentRecipe.id);

      if (!isDuplicate) {
        results.push(currentRecipe.id);

        return true;
      }

      return false;
    });

    // console.log(removeDuplicates);

    // Permets de récupérer une seule instance d'un objet
    this.currentRecipes = removeDuplicates

    // Recherche par tags
    // Méthode pour retourner un nouveau tableau avec les éléments du tableau d'origine et qui remplissent les conditions
    this.tags.map((tag) => {
      const tagValue = tag.name.toLowerCase()
      const tagType = tag.type

      // Recherche par tags et plats
      this.currentRecipes = this.currentRecipes.filter((recipe) => {
        const recipeValue = recipe[tagType]

        // Méthode pour déterminer si l'objet passé en argument est un objet Array, 
        // renvoie true si le paramètre est de type Array ou false dans le cas contraire
        return Array.isArray(recipeValue)
          ? typeof recipeValue === "object"
            ? isPartiallyInArrayObject(recipeValue, tagValue, "ingredient")
            : isPartiallyInArray(recipeValue, tagValue)
          : recipeValue.toLowerCase().includes(tagValue)
      })
    })

    this.updateDatalists()

    this.nodeRecipes = await this.displayRecipes()
    //results = await this.displayRecipes()
  }

  // Mise à jour des recettes et de leur affichage
  refreshRecipes = async () => {
    this.currentRecipes = this.recipes
    this.nodeRecipes = await this.displayRecipes()

    const listElements = document.querySelectorAll(".datalist__list > ul > li")
    listElements.forEach((list) => list.classList.remove("hidden"))
  }

  // Ajout du tag et mise à jour de la recherche (utilisé dans Search.js)
  addTag = (tag) => {
    this.tags.push(tag)

    this.handleSearch()
  }

  // Retrait du tag et mise à jour de la recherche (utilisé dans Search.js)
  removeTag = (e) => {
    this.tags = this.tags.filter((tag) => tag.listElement !== e.target)

    this.handleSearch()
  }

  // Mise à jour du contenu de DataLists
  updateDatalists = () => {
    const event = new Event("updatelist")
    event.updatedRecipes = this.currentRecipes

    this.element.dispatchEvent(event)
  }
}

export default RecipesList