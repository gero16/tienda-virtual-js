// Pagina Principal
const homePage = document.querySelector(".pagina-principal");
// Slider de fotos de portada
const primerBanner = document.querySelector(".primer-banner")
const segundoBanner = document.querySelector(".segundo-banner")
const tercerBanner = document.querySelector(".tercer-banner")
const cuartoBanner = document.querySelector(".cuarto-banner")
const generalBanner = document.querySelector(".banner")
// Productos
const productosHTML = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productos-carrito");
// Carrito
const carritoHTML = document.querySelector(".carritoHTML");
const ocultarCarrito = document.querySelector(".ocultar-carrito");
const iconoCarrito = document.querySelector(".carrito");
const numbCompras = document.querySelector(".numero-compras");
const subTotal = document.querySelector(".sub-total");
let sumaSub = 0;

let carrito = [];
let productList = [];
let ids = [];

let total = 0;
let articulos = 0;

let array = [];

let bannerActive = {
  primerBanner: true,
  segundoBanner: false,
  tercerBanner: false,
  cuartoBanner: false,
}

setInterval(() => {
  if(bannerActive.primerBanner == true){
    
    console.log("primer banner activo");
    cuartoBanner.style.display = "none"
    primerBanner.style.display = "block";
    bannerActive.primerBanner = false;
    bannerActive.segundoBanner = true;

  } else if (bannerActive.segundoBanner == true) {
    console.log("segundo banner activo");

    primerBanner.style.display = "none"
    segundoBanner.style.display = "block"
   

    bannerActive.segundoBanner = false;
    bannerActive.tercerBanner = true;
  } else if (bannerActive.tercerBanner == true){

    console.log("tercer banner activo");

    segundoBanner.style.display = "none"
    tercerBanner.style.display = "block"

    bannerActive.tercerBanner = false;
    bannerActive.cuartoBanner = true;
  } else {
    tercerBanner.style.display = "none"
    cuartoBanner.style.display = "block"
    bannerActive.cuartoBanner = false;
    bannerActive.primerBanner = true;
  }
 
}, 7500);

//bannerActive.tercerBanner == true
iconoCarrito.addEventListener("click", () => {
  carritoHTML.style.display = "block";
});

ocultarCarrito.addEventListener("click", () => {
  carritoHTML.style.display = "none";
});

window.onload = async () => {
  productosLocal();

  const inputCarrito = document.querySelectorAll(".input-carrito");
  const sumar = document.querySelectorAll(".sumar");
  // Agregar Unidades del Carrito
  for (let i = 0; i <= sumar.length - 1; i++) {
    sumar[i].addEventListener("click", () => {
      inputCarrito[i].value++;
    });
  }

  const restar = document.querySelectorAll(".restar");
  // Restar Unidades al Carrito
  for (let i = 0; i <= restar.length - 1; i++) {
    restar[i].addEventListener("click", () => {
      inputCarrito[i].value--;
    });
  }

  const btnBorrar = document.querySelectorAll(".btn-borrar");
  for (let i = 0; i <= btnBorrar.length - 1; i++) {
    btnBorrar[i].addEventListener("click", (e) => {
      console.log(e.target.dataset);
      let { id } = e.target.dataset;
      localStorage.removeItem(`producto-carrito${id}`);
    });
  }
};

function productosLocal() {
  console.log(localStorage.length);

  const datosProductos = JSON.parse(localStorage.getItem("Productos"));
  console.log(datosProductos);
  if (datosProductos) {
    datosProductos.forEach((product) => {
      articulos++; // antes lo tenia abajo y me funcionaba mal
      console.log(articulos);
      const imgCarrito = document.createElement("img");
      imgCarrito.src = product.image;
      imgCarrito.classList.add("img-comprar");

      // Seccion Contenido
      const divContenidoCarrito = document.createElement("div");
      divContenidoCarrito.classList.add(
        "div-contenido-carrito",
        "centrar-texto"
      );
      const nombreProducto = document.createElement("p");
      nombreProducto.textContent = product.name;
      const precioProducto = document.createElement("p");
      precioProducto.textContent = product.price;
      divContenidoCarrito.append(nombreProducto, precioProducto);

      // Seccion Stock
      const divStock = document.createElement("div");
      divStock.classList.add("stock");
      const spanRestar = document.createElement("span");
      spanRestar.textContent = "-";
      spanRestar.classList.add("restar");
      const spanSumar = document.createElement("span");
      spanSumar.textContent = "+";
      spanSumar.classList.add("sumar");

      const inputCarrito = document.createElement("input");
      inputCarrito.classList.add("input-carrito", "centrar-texto");
      console.log(product.cantidad)
      inputCarrito.value = product.cantidad;
      divStock.append(spanRestar, inputCarrito, spanSumar);

      divContenidoCarrito.append(divStock);

      // Agregar img, contenido y borrar al producto-carrito

      // Borrar
      const btnBorrar = document.createElement("span");
      btnBorrar.classList.add("btn-borrar");
      btnBorrar.dataset.id = `${articulos}`;
      btnBorrar.textContent = "x";

      const productoCarrito = document.createElement("div");
      productoCarrito.classList.add("producto-carrito");
      productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
      productosCarrito.append(productoCarrito);

      // Me aparecen 2 producto-carrito's creados antes en el HTML
      numbCompras.textContent = articulos;
      subTotal.innerHTML = `$${sumaSub}`;
    });
  }
}
