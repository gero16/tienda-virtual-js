// Pagina Principal
const homePage = document.querySelector(".pagina-principal");

// Productos
const productosHTML = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productos-carrito");

// Carrito
const carritoHTML = document.querySelector('.carritoHTML')
const ocultarCarrito = document.querySelector('.ocultar-carrito')
const iconoCarrito = document.querySelector('.carrito')
const numbCompras = document.querySelector('.numero-compras')
const subTotal = document.querySelector('.sub-total')

// Orden de Pago
const pagoHTML = document.querySelector(".order");
const precio = document.querySelector(".precio");

// Filtro
const filtro = document.querySelector(".lista-filtro");

// LocalStorage
let productoStorage = ''
let productoLocalStorage = []
let datosProductosAgregados = []

let carrito = []
let productList = []
let ids = []
let order = {
  items: [],
};
let total = 0;
let sumaSub = 0;
let articulos = 0;




iconoCarrito.addEventListener('click', () => {
  carritoHTML.style.display = 'block'
})

ocultarCarrito.addEventListener('click', () => {
  carritoHTML.style.display = 'none'
})


// Traer los Productos de la BD
async function fetchProducts() {
  let productos = await (await fetch('/api/productos')).json()

  let { registros } = productos;

  productList = registros;

  renderProductosHtml(registros)

  llenarIds()
}

// Construir HTML de los productos
function renderProductosHtml(registros) {
  let productoHTML = ''
  registros.forEach((registro) => {
    const { id, image, name, price } = registro

    productoHTML += `
    
    <div class="producto centrar-texto">
    <img src="${image}" alt="Mochila" />
    <p class="nombre">${name}</p>
    <p class="precio">$${price}</p>
    <button class="add" onclick="add(${id})" >Agregar Carrito</button>
  </div>

    `
    productosHTML.innerHTML = productoHTML
  })
}

let arrayIds = []
function llenarIds () {
  productList.forEach(element => {
    arrayIds.push(element.id)
  });
  return arrayIds;
}


// Trae datos del localStorage y contruye el html del carrito
function getProductosLocal() {
  const promise = new Promise(function (resolve, reject) {
    resolve(arrayIds.forEach(id => {
      let data = JSON.parse(localStorage.getItem(`producto-${ id }`)) 
      if(data) datosProductosAgregados.push(data)
    }))
  })

  promise.then(function () {
    if (datosProductosAgregados) { 
      datosProductosAgregados.forEach((product) => {
        ids = JSON.parse(localStorage.getItem(`productoIds`)) 
        // Construir html del carrito - Que viene de localStorage
        articulos++; // antes lo tenia abajo y me funcionaba mal

        // element, classname, content, dataset, src 
        const imgCarrito = createElementHtml("img", ["img-comprar"], "", "", product.image)
      
        // Seccion Contenido
        const divContenidoCarrito = createElementHtml("div", ["div-contenido-carrito", "centrar-texto"])
        const nombreProducto = createElementHtml("p", [], product.name)
        const precioProducto = createElementHtml("p", [], product.price)
        divContenidoCarrito.append(nombreProducto, precioProducto);

        // Seccion Stock
        const divStock = createElementHtml("div", ["stock"])
        const spanRestar = createElementHtml("span", ["restar"], "-")
        const spanSumar = createElementHtml("span", ["sumar"], "+")
        const inputCarrito = createElementHtml("input", ["input-carrito", "centrar-texto"], "", `input-${product.id}`)
        inputCarrito.value = product.cantidad;
        divStock.append(spanRestar, inputCarrito, spanSumar);
        divContenidoCarrito.append(divStock);

        // Borrar
        const btnBorrar = createElementHtml("span", ["btn-borrar"], "x", `borrar-${product.id}`)
    
        const productoCarrito = createElementHtml("div", [`producto-carrito producto-${product.id}`])
        productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
        productosCarrito.append(productoCarrito);

        // Me aparecen 2 producto-carrito's creados antes en el HTML
        numbCompras.textContent = articulos;
        subTotal.innerHTML = `$${sumaSub}`;
      });
    }
})

  return datosProductosAgregados;
}

///***  Crear el HTML del Carrito ***///
function addCarritoHTML(product) {
  const carritoVacio = document.querySelector('.carrito-vacio')
  carritoVacio.innerHTML = ''

  let { image, name, price, id, cantidad } = product
  console.log(product)

  // Caja Producto
  const imgCarrito = document.createElement('img')
  imgCarrito.src = `${image}`
  imgCarrito.classList.add('img-comprar')

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
  const productoCarrito = createElementHtml("div", [`producto-carrito producto-${product.id}`])
  productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
  productosCarrito.append(productoCarrito);

  articulos++
  numbCompras.textContent = articulos

  sumaSub = sumaSub + price;
  subTotal.textContent = sumaSub;
}

///***  Agregar productos al Carrito ***///
function add(productId, price) {
  // Traer el producto que coincida con el id del producto de la BD
  let product = productList.find((p) => p.id === productId)
  
  console.log(datosProductosAgregados)
  const getProductActualizar = datosProductosAgregados.find(element => element.id === productId);
  //productStorage = JSON.parse(localStorage.getItem(`producto-${productId}`))
  console.log(getProductActualizar)
  if(!getProductActualizar) {
    product.stock--
    product.cantidad++
    order.items.push(product)

    const existe = ids.find((id) => id == productId)
    console.log(existe)
    if(!existe) ids.push(productId)

    productoLocalStorage = product;
    localStorage.setItem(`producto-${productId}`, JSON.stringify(productoLocalStorage));
    localStorage.setItem(`productoIds`, JSON.stringify(ids));
    console.log(productoLocalStorage);
    addCarritoHTML(product);
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



///*** BORRAR CARRITOOOOO ***/// QUE ES ESTO
function borrarItemCarrito() {
  const btnBorrar = document.querySelectorAll('.btn-borrar') 
  for (let i = 0; i <= btnBorrar.length - 1; i++) {
    btnBorrar[i].addEventListener('click', (e) => {
      let id = (e.target.dataset.id).split("-")
      
      e.target.parentNode.parentNode.removeChild(document.querySelector(`.producto-${id[1]}`))
      JSON.parse(localStorage.removeItem(`producto-${id[1]}`))

      const getIds = JSON.parse(localStorage.getItem("productoIds"))
      ids = getIds.filter((elementId) => elementId !== Number(id[1]))
      localStorage.removeItem("productoIds")
      localStorage.setItem(`productoIds`, JSON.stringify(ids));

      articulos--
      if (articulos == -1) numbCompras.textContent = 0
      numbCompras.textContent = articulos
      console.log(numbCompras)
    })
  }
}

///*** FILTROOOOOOOOOOS ***///
let filtradoHTML = "";
const filtroCategorias = document.querySelector(".filtro-categorias")
filtroCategorias.addEventListener("click", (e) => {
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
    let { category } = elemento;
    
    if (category == nameCategoria) {
      let { name, image, price, id } = elemento;
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

const filtroPrecios = document.querySelector(".precio-principal")
filtroPrecios.addEventListener("click", (e) => {
  const precioPrincipal = parseInt(e.target.value)

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

function createElementHtml (element, classname, content, dataset, src) {
  const elementoEtiqueta = document.createElement(`${element}`);

  if(classname) {
      classname.forEach(clase => {
          elementoEtiqueta.className += `${clase} `
      });
  }

  if(content) elementoEtiqueta.textContent =  content

  if(dataset) elementoEtiqueta.dataset.id = `${dataset}`

  if(src) elementoEtiqueta.src = src

  return elementoEtiqueta
}

window.onload = async () => {
  await fetchProducts()
  // await addCarritoHTML()
  new Promise (function(resolve, reject) {
    resolve(getProductosLocal())
    reject(console.log("Error"))
  })
  .then(function() {
    borrarItemCarrito()
  })

  // Agregar Unidades del Carrito

  /*
      Pregunta - Cada vez que yo ejecute este codigo por el sumar y restar  
      tambien se estara ejecutando el fetchProducts y getProductosLocal? 
      Probar con console.log - Crep qie estarian mejor afuera de esto
  */

  const inputsCarrito = document.querySelectorAll(".input-carrito");
  const sumar = document.querySelectorAll(".sumar");

  for (let i = 0; i <= sumar.length - 1; i++) {
    sumar[i].addEventListener("click", (e) => {
      // Tengo que hacer algo parecido al add(id)
      const idSpan = parseInt(e.target.parentNode.children[1].dataset.id);

      const product = productList.find((p) => p.id === idSpan);
      console.log(product);
      inputsCarrito[i].value++;
      product.stock--;
      product.cantidad++;
      console.log(product.cantidad);
    
    });
  }

  const restar = document.querySelectorAll('.restar')
  // Restar Unidades al Carrito
  for (let i = 0; i <= restar.length - 1; i++) {
    restar[i].addEventListener('click', () => {
      inputsCarrito[i].value--
    })
  }


}
