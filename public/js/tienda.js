import { getProductosLocal, fetchProducts, productList, createElementHtml, total, subTotal } from "./helpers.mjs";
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
  const getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${ productId }`)) 
  console.log(getProductActualizar)
  let dataSubtotal = JSON.parse(localStorage.getItem(`subtotal`)) 
  
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

   
    //const getIds = JSON.parse(localStorage.getItem("productoIds"))
    addCarritoHTML(product);

    if(dataSubtotal) {
      // inputCarrito.value = getProductActualizar.cantidad;
      const total =  dataSubtotal + product.price 
      console.log(total)
      subTotalHtml.innerHTML = dataSubtotal + product.price 
      localStorage.setItem(`subtotal`, JSON.stringify(total));
    } else {
      localStorage.setItem(`subtotal`, JSON.stringify(product.price));
      inputCarrito.value = product.price
      subTotalHtml.innerHTML = product.price
  
    }
  } 
  else {
    console.log(getProductActualizar)
    getProductActualizar.stock--
    getProductActualizar.cantidad++
    console.log(productoStorage)
    localStorage.removeItem(`producto-${productId}`) 
    localStorage.setItem(`producto-${productId}`, JSON.stringify(getProductActualizar));
    
    let inputCarrito = document.querySelector(`[data-id="input-${getProductActualizar.id}"]`);
    // TENGO QUE OBTENER LA LISTA DE PRODUCTOS EN LOCALSTORAGE

    
    if(dataSubtotal) {
      // inputCarrito.value = getProductActualizar.cantidad;
      const newAlgo =  (dataSubtotal) + (getProductActualizar.price * getProductActualizar.cantidad)
      console.log(newAlgo)
       subTotalHtml.innerHTML = (dataSubtotal) + (getProductActualizar.price * getProductActualizar.cantidad)
    } else {
      localStorage.setItem(`subtotal`, JSON.stringify(total));
      inputCarrito.value = total
      subTotalHtml.innerHTML = total
  
    }

   
    }
  borrarItemCarrito();
}

// Construir HTML de los productos
function renderProductosHtml(registros) {

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

function construirProductFilter () {
  const divProducto = createElementHtml("div", ["producto", "centrar-texto"])
  const img = createElementHtml("img", [], "", "", image)
  const nombre = createElementHtml("p", [], name)
  const precio = createElementHtml("p", [], price)
  const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
  
  divProducto.append(img, nombre, precio, button)
 productosHTML.append(divProducto)
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
      const precio = createElementHtml("p", [], price)
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
      add(e.target.dataset.id) 
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
        const precio = createElementHtml("p", [], price)
        const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
        
        divProducto.append(img, nombre, precio, button)
        productosHTML.append(divProducto)
      } 

      let mostrarPrecio = document.querySelector("#mostrar-precio")
      mostrarPrecio.textContent = `$ ${ precioPrincipal } - $ 4000` 
      //productosHTML.innerHTML = filtradoHTML;
    });
    
    const btns = document.querySelectorAll(".add")
    console.log(btns)
    btns.forEach(element => element.addEventListener("click", (e) => {
      console.log(e.target)
      add(e.target.dataset.id) 
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
        const precio = createElementHtml("p", [], price)
        const button = createElementHtml("button", ["add"], "Agregar Carrito", id)
        
        divProducto.append(img, nombre, precio, button)
        productosHTML.append(divProducto)
      } 
      let mostrarPrecio = document.querySelector("#mostrar-precio")
      mostrarPrecio.textContent = `$ ${ precioPrincipal } - $ 4000` 
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
    reject(console.log("Error"))
  })
  .then(function() {
    borrarItemCarrito()
  })
}
