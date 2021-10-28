import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { cosh } from 'core-js/core/number';

// https://forkify-api.herokuapp.com/v2  

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes =  async function () {

  try {

     const id = window.location.hash.slice(1);


      if(!id) return;

      recipeView.renderSpinner();

   //Update result
   resultsView.render(model.getSearchResultsPage());   
   bookmarksView.render(model.state.bookmarks); 
 
 //1. Loading Recipe
      await model.loadRecipe(id);   

     // const { recipe } = model.state; //const recipeView = new recipeView(model.state.recipe);


//2. Rendering Recipe
 
recipeView.render(model.state.recipe);

    
  }catch (err) {
   // alert(err);
    recipeView.renderError();
  }
}

const controlSearchResults = async function (){

  try {
        resultsView.renderSpinner();

      const query = searchView.getQuery();
      if(!query) return;

     await model.loadSearchResults(query);

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage()); 

    //pagination

    paginationView.render(model.state.search);

  }catch (err) {
    console.log(err);
  }
}

const controlPagination = function (goToPage) {

  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {

  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else  model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
  

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

  const controlBookmarks = function() {
   bookmarksView.render(model.state.bookmarks);
 }

 const controlAddRecipe = async function(newRecipe) {
   try{

    //show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
     bookmarksView.render(model.state.bookmarks);

     // Change ID in URL
      window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // Close form window
        setTimeout(function () {
          addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
      

    }catch(err) {
   console.error('🔥' , err);
   addRecipeView.renderError(err.message);
 }

 }

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  //bookmarksView.addHandlerRender(controlBookmarks);
  console.log('Welcome!');
};

init();
