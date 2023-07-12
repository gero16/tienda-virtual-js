import { getProductosLocal, fetchProducts, productList, datosProductosAgregados, createElementHtml, traerIdsLocalStorage } from "./helpers.mjs";
// Pagina Principal

// Productos
const productosHTML = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productos-carrito");

// Carrito
const carritoHTML = document.querySelector('.carritoHTML')
const ocultarCarrito = document.querySelector('.ocultar-carrito')
const iconoCarrito = document.querySelector('.carrito')
const numbCompras = document.querySelector('.numero-compras')
const subTotalHtml = document.querySelector('.sub-total')

// LocalStorage
let productoStorage = ''
let productoLocalStorage = []

let ids = []
let order = {
  items: [],
};
let sumaSub = 0;
let articulos = 0;

iconoCarrito.addEventListener('click', () => {
  carritoHTML.style.display = 'block'
})

ocultarCarrito.addEventListener('click', () => {
  carritoHTML.style.display = 'none'
})

///***  Agregar productos al Carrito ***///
function add(productId, price) {
  // Traer el producto que coincida con el id del producto de la BD
  let product = productList.find((p) => p.id == productId)
  const getProductActualizar = datosProductosAgregados.find(element => element.id == productId);

  if(!getProductActualizar) {
    product.stock--
    product.cantidad++
    order.items.push(product)

    const existe = ids.find((id) => id == productId)
    if(!existe) {
      const getIds = JSON.parse(localStorage.getItem("productoIds"))
      getIds ? ids=[...getIds, productId] : ids.push(productId)
    }

    productoLocalStorage = product;
    localStorage.setItem(`producto-${productId}`, JSON.stringify(productoLocalStorage));
    localStorage.setItem(`productoIds`, JSON.stringify(ids));
    console.log(productoLocalStorage);

    const getIds = JSON.parse(localStorage.getItem("productoIds"))
    addCarritoHTML(product, getIds);
  } 
  else {
    getProductActualizar.stock--
    getProductActualizar.cantidad++
    console.log(productoStorage)
    localStorage.removeItem(`producto-${productId}`)
    localStorage.setItem(`producto-${productId}`, JSON.stringify(getProductActualizar));
    
    let inputCarrito = document.querySelector(`[data-id="input-${getProductActualizar.id}"]`);
    inputCarrito.value = getProductActualizar.cantidad;
   
    }
  borrarItemCarrito();
}

// Construir HTML de los productos
function renderProductosHtml(registros) {
  let productoHTML = ''
  registros.forEach((registro) => {
    const { id, image, name, price } = registro

    const divProducto = createElementHtml("div", ["producto", "centrar-texto"])
    const img = createElementHtml("img", [], "", "", image)
    const nombre = createElementHtml("p", [], name)
    const precio = createElementHtml("p", [], price)
    const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
    
    divProducto.append(img, nombre, precio, button)
    productosHTML.append(divProducto)
  })
  const btns = document.querySelectorAll(".add")
  btns.forEach(element => element.addEventListener("click", (e) => add(e.target.dataset.id) ));
}

///***  Crear el HTML del Carrito ***///
function addCarritoHTML(product, getIds) {
  console.log(product)
  
  let { image, name, price, id, cantidad } = product

  // Caja Producto
  const imgCarrito = createElementHtml("img", ["img-comprar"], "", "", image)
    
  // Seccion Contenido
  const divContenidoCarrito = createElementHtml("div", ["div-contenido-carrito", "centrar-texto"])
  const nombreProducto = createElementHtml("p", [], name)
  const precioProducto = createElementHtml("p", [], price)
  divContenidoCarrito.append(nombreProducto, precioProducto);

  // Seccion Stock
  const divStock = createElementHtml("div", ["stock"])
  const spanRestar = createElementHtml("span", ["restar"], "-")
  const spanSumar = createElementHtml("span", ["sumar"], "+")
  const inputCarrito = createElementHtml("input", ["input-carrito", "centrar-texto"], "", `input-${id}`)
  inputCarrito.value = 1
  divStock.append(spanRestar, inputCarrito, spanSumar)
  divContenidoCarrito.append(divStock)

  // Borrar
  const btnBorrar = createElementHtml("span", ["btn-borrar"], "x", `borrar-${id}`)
  // Agregar img, y divs al producto-carrito
  const productoCarrito = createElementHtml("div", ["producto-carrito"], "", `producto-${product.id}`)
  productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
  productosCarrito.append(productoCarrito);

  articulos++
  numbCompras.textContent = articulos
  sumaSub = sumaSub + price;
  console.log(sumaSub)
  subTotalHtml.textContent = sumaSub;
}

///*** BORRAR CARRITOOOOO ***/// QUE ES ESTO
function borrarItemCarrito() {
  const btnBorrar = document.querySelectorAll('.btn-borrar') 
  for (let i = 0; i <= btnBorrar.length - 1; i++) {
    btnBorrar[i].addEventListener('click', (e) => {
      let id = (e.target.dataset.id).split("-")
      console.log(e.target.parentNode.parentNode)
      e.target.parentNode.parentNode.removeChild(document.querySelector(`[data-id="producto-${id[1]}"]`))
      localStorage.removeItem(`producto-${id[1]}`)

      const getIds = JSON.parse(localStorage.getItem("productoIds"))
      ids = getIds.filter((elementId) => elementId != Number(id[1]))
      console.log(ids)
      localStorage.removeItem("productoIds")
      ids.length > 0 ?  localStorage.setItem(`productoIds`, JSON.stringify(ids)) : ""
     
      articulos--
      if (articulos == -1) numbCompras.textContent = 0
      numbCompras.textContent = articulos
      console.log(numbCompras)
    })
  }
}

///*** FILTROOOOOOOOOOS ***///
let filtradoHTML = "";
const filtroPrecio = document.querySelector("#precio")
let mostrarPrecio = document.querySelector("#mostrar-precio")
const filtroCategorias = document.querySelector(".filtro-categorias")

filtroCategorias.addEventListener("click", (e) => {
  console.log(Number(filtroPrecio.value))
    // Es tan rapido que no puedo manejarlo 
  const preloader = document.querySelector(".preloader")
  //preloader.style.display = "block";

  productosHTML.innerHTML = " ";
  console.log(productosHTML)
  filtradoHTML = "";
  // FILTRO CATEGORIA
  let nameCategoria = e.target.id;
  
  e.target.classList.add("seleccionado")
  
  productList.forEach((elemento) => {
    let { name, image, id, category, price } = elemento;
    
    console.log(elemento)
    if (category == nameCategoria && price >= Number(filtroPrecio.value)) {
      filtradoHTML += `
      <div class="producto producto-filtrado centrar-texto">
        <img src="${image}" alt="Mochila" />
        <p class="nombre">${name}</p>
        <p class="precio">$${price}</p>
        <button class="add" onclick="add(${id})" >Agregar Carrito</button>
      </div>
      `;
    }
    
    //preloader.style.display = "none";
    productosHTML.innerHTML = filtradoHTML;
  });
  
});

filtroPrecio.addEventListener("click", (e) => {
  const precioPrincipal = parseInt(e.target.value)
  console.log(precioPrincipal)
  mostrarPrecio.textContent = precioPrincipal
  filtradoHTML = " ";

  productList.forEach((elemento) => {
    let { price } = elemento;

    if (precioPrincipal < price) {
      let { name, image, price, id } = elemento;
    
      filtradoHTML += `
        <div class="producto producto-filtrado centrar-texto">
        <img src="${ image }" alt="Mochila" />
        <p class="nombre">${ name }</p>
        <p class="precio">$${ price }</p>
        <button class="add" onclick="add(${ id })"> Agregar Carrito </button>
      </div>
    `;
    }
    let mostrarPrecio = document.querySelector("#mostrar-precio")
    mostrarPrecio.textContent = `$ ${ precioPrincipal } - $ 4000` 
    productosHTML.innerHTML = filtradoHTML;
  });
})

window.onload = async () => {
  const productos = await fetchProducts()
  renderProductosHtml(productos)

  new Promise (function(resolve, reject) {
    resolve( getProductosLocal())
    reject(console.log("Error"))
  })
  .then(function() {
    borrarItemCarrito()
  })
}
