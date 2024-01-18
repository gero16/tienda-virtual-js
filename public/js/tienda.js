import { getProductosLocal, fetchProducts, productList, calcularSubTotalProducto,
  createElementHtml, subTotal, mostrarNumeroArticulosHtml, mostrarSubtotalHtml,
   mostrarSubtotalPorProducto, eventoRestarEnTodos, eventoSumarEnTodos, 
   eventoSumar, eventoRestar, eventoInputCantidad, borrarItemCarrito
} from "./helpers.mjs";
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
let productoLocalStorage = []

let ids = []
let order = {
  items: [],
};



iconoCarrito.addEventListener('click', () => {
  carritoHTML.style.display = 'block'
})

ocultarCarrito.addEventListener('click', () => {
  carritoHTML.style.display = 'none'
})
///***  Crear el HTML del Carrito ***///
function addCarritoHTML(product, subtotal) {
  let { image, name, price, id, cantidad } = product
  console.log(product)

  // Caja Producto
  const imgCarrito = createElementHtml("img", ["img-comprar"], "", "", image)
    
  // Seccion Contenido
  const divContenidoCarrito = createElementHtml("div", ["div-contenido-carrito", "centrar-texto"])
  const nombreProducto = createElementHtml("p", [], name)
  const precioProducto = createElementHtml("p", [], `$${price}`, `price-${id}`)
  divContenidoCarrito.append(nombreProducto, precioProducto);

  // Seccion Stock
  const divStock = createElementHtml("div", ["stock"])
  const spanRestar = createElementHtml("span", ["restar"], "-", `restar-${id}`)
  const spanSumar = createElementHtml("span", ["sumar"], "+", `sumar-${id}`)
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

  mostrarNumeroArticulosHtml()
}

///***  Agregar productos al Carrito ***///
function agregarProducto(productId, price) {
  // Traer el producto que coincida con el id del producto de la BD
  let product = productList.find((p) => p.id == productId)
  let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${ productId }`)) 
  const getIds = JSON.parse(localStorage.getItem("productoIds"))
  if(getIds) ids = getIds

  let btnAgregarCarrito = document.querySelector(`[data-id="${ productId }"]`)
  btnAgregarCarrito.disabled = true
  btnAgregarCarrito.classList.add("disabled")
 
  /*
  if(getProductActualizar) {

    getProductActualizar.stock--
    getProductActualizar.cantidad++
    localStorage.removeItem(`producto-${productId}`) 
    localStorage.setItem(`producto-${productId}`, JSON.stringify(getProductActualizar));

    mostrarSubtotalPorProducto(getProductActualizar)
    const inputCantidad =  document.querySelector(`[data-id="input-${ productId }"]`).value = getProductActualizar.cantidad
  } 
  */

  if(!getProductActualizar) {
    // Si hay otras id de otros productos
    ids.push(productId)
    product.stock--
    product.cantidad = 1
    order.items.push(product)
    productoLocalStorage = product;
    /******* PORQUE AGREGO productoLocalStorage y no directamente product ********/
    localStorage.setItem(`producto-${productId}`, JSON.stringify(productoLocalStorage));
    localStorage.setItem(`productoIds`, JSON.stringify(ids));

    addCarritoHTML(product);
  }

  
  eventoSumarEnTodos()
  eventoRestarEnTodos()
  //eventoRestar(productId)
  //eventoSumar(productId)
  //eventoInputCantidad(productId)
  mostrarNumeroArticulosHtml()
  borrarItemCarrito()
  mostrarSubtotalHtml()
}


// Construir HTML de los productos
function renderProductosHtml(registros) {

  registros.forEach((registro) => {
    const { id, image, name, price } = registro

    const divProducto = createElementHtml("div", ["producto", "centrar-texto"])
    const img = createElementHtml("img", [], "", "", image)
    const nombre = createElementHtml("p", [], name)
    const precio = createElementHtml("p", [], `$${ price }`)
    const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
    
    divProducto.append(img, nombre, precio, button)
    productosHTML.append(divProducto)
  })

  const btns = document.querySelectorAll(".add") 
  btns.forEach(btnAgregar => { 
    btnAgregar.addEventListener("click", (e) => { 
      agregarProducto(e.target.dataset.id) }) 
      
  })
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
  filtradoHTML = "";
  // FILTRO CATEGORIA
  let nameCategoria = e.target.id;
  
  const previousSelected = document.querySelector(".seleccionado")
  //console.log(previousSelected)

  if(previousSelected) {
    previousSelected.classList.toggle("seleccionado")
    e.target.classList.toggle("seleccionado")
    console.log(e.target.id)
  } else {
    e.target.classList.toggle("seleccionado")
  }

  if(previousSelected && previousSelected.id == e.target.id) {
    previousSelected.classList.remove("seleccionado")
  }

  
  productList.forEach((elemento) => {
    //let { name, image, id, category, price } = elemento;
    let { name, image, id, category, price } = elemento;

    if (category == nameCategoria && price >= Number(filtroPrecio.value)) {
      console.log(elemento)
      const divProducto = createElementHtml("div", ["producto", "centrar-texto"])
      const img = createElementHtml("img", [], "", "", image)
      const nombre = createElementHtml("p", [], name)
      const precio = createElementHtml("p", [], `$${ price }`)
      const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
      
      divProducto.append(img, nombre, precio, button)
      productosHTML.append(divProducto)
  
      /*
      
      filtradoHTML += `
      <div class="producto producto-filtrado centrar-texto">
        <img src="${image}" alt="Mochila" />
        <p class="nombre">${name}</p>
        <p class="precio">$${price}</p>
        <button class="add" onclick="add(${id})" >Agregar Carrito</button>
      </div>
      `;
      */
    }
    
    //preloader.style.display = "none";
    //productosHTML.innerHTML = filtradoHTML;
  });
  
  const btns = document.querySelectorAll(".add")
  console.log(btns)
  btns.forEach(element => element.addEventListener("click", (e) => {
      console.log(e.target)
      agregarProducto(e.target.dataset.id) 
  }));
});

filtroPrecio.addEventListener("click", (e) => {
  const precioPrincipal = parseInt(e.target.value)
  mostrarPrecio.textContent = precioPrincipal
  filtradoHTML = " ";
  productosHTML.innerHTML = " ";

  const selectedCategory = document.querySelector(".seleccionado")
  if(selectedCategory) {
    productList.forEach((elemento) => {
      let { price, category } = elemento;    
      if(precioPrincipal < price && category == selectedCategory.id) {
        let { name, image, price, id } = elemento;
        const divProducto = createElementHtml("div", ["producto", "centrar-texto"])
        const img = createElementHtml("img", [], "", "", image)
        const nombre = createElementHtml("p", [], name)
        const precio = createElementHtml("p", [], `$${ price }`)
        const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
        
        divProducto.append(img, nombre, precio, button)
        productosHTML.append(divProducto)
      } 

      let mostrarPrecio = document.querySelector("#mostrar-precio")
      mostrarPrecio.textContent = `$ ${ precioPrincipal } - $ 1500` 
      //productosHTML.innerHTML = filtradoHTML;
    });
    
    const btns = document.querySelectorAll(".add")
    console.log(btns)
    btns.forEach(element => element.addEventListener("click", (e) => {
      console.log(e.target)
      agregarProducto(e.target.dataset.id) 
  }));
  } else {
    productList.forEach((elemento) => {
      let { price, category } = elemento;
      
      if(precioPrincipal < price) {
        console.log(elemento)
        let { name, image, price, id } = elemento;
        const divProducto = createElementHtml("div", ["producto", "centrar-texto"])
        const img = createElementHtml("img", [], "", "", image)
        const nombre = createElementHtml("p", [], name)
        const precio = createElementHtml("p", [], `$${ price }`)
        const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
        
        divProducto.append(img, nombre, precio, button)
        productosHTML.append(divProducto)
      } 
      let mostrarPrecio = document.querySelector("#mostrar-precio")
      mostrarPrecio.textContent = `$ ${ precioPrincipal }` 
    });
    const btns = document.querySelectorAll(".add")
    console.log(btns)
    btns.forEach(element => element.addEventListener("click", (e) => {
      console.log(e.target)
      add(e.target.dataset.id) 
    }));
  }
})

window.onload = async () => {
  const productos = await fetchProducts()
  renderProductosHtml(productos)

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



console.log(location.pathname)