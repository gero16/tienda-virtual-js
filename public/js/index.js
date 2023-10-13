import { getProductosLocal, fetchProducts,
   mostrarNumeroArticulosHtml, eventoRestarEnTodos, eventoSumarEnTodos, borrarItemCarrito 
  } from "./helpers.mjs";

// Pagina Principal
const homePage = document.querySelector(".pagina-principal");
// Slider de fotos de portada
const primerBanner = document.querySelector(".primer-banner")
const segundoBanner = document.querySelector(".segundo-banner")
const tercerBanner = document.querySelector(".tercer-banner")
const cuartoBanner = document.querySelector(".cuarto-banner")

// Carrito
const carritoHTML = document.querySelector(".carritoHTML");
const ocultarCarrito = document.querySelector(".ocultar-carrito");
const iconoCarrito = document.querySelector(".carrito");

let bannerActive = {
  primerBanner: true,
  segundoBanner: false,
  tercerBanner: false,
  cuartoBanner: false,
}

/*
setInterval(() => {
  if(bannerActive.primerBanner === true){
    cuartoBanner.style.display = "none"
    primerBanner.style.display = "block";
    bannerActive.primerBanner = false;
    bannerActive.segundoBanner = true;
  }
  if (bannerActive.segundoBanner === true) {
    primerBanner.style.display = "none"
    segundoBanner.style.display = "block"
    bannerActive.segundoBanner = false;
    bannerActive.tercerBanner = true;
  } 
  if (bannerActive.tercerBanner === true){
    segundoBanner.style.display = "none"
    tercerBanner.style.display = "block"
    bannerActive.tercerBanner = false;
    bannerActive.cuartoBanner = true;
  } 
  if (bannerActive.cuartoBanner === true){
    tercerBanner.style.display = "none"
    cuartoBanner.style.display = "block"
    bannerActive.cuartoBanner = false;
    bannerActive.primerBanner = true;
  }
 
}, 7500);
*/

//bannerActive.tercerBanner == true
iconoCarrito.addEventListener("click", () => {
  carritoHTML.style.display = "block";
});

ocultarCarrito.addEventListener("click", () => {
  carritoHTML.style.display = "none";
});




window.onload = () => {
  new Promise (function(resolve, reject) {
    resolve( getProductosLocal())
  })
  .then(function(e) {
    //mostrarSubtotalHtml()
    mostrarNumeroArticulosHtml()
    borrarItemCarrito()
    eventoRestarEnTodos() 
    eventoSumarEnTodos()
  })
}

