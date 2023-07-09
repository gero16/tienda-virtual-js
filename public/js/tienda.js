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
    console.log(datosProductosAgregados)
    if (datosProductosAgregados) { datosProductosAgregados.forEach((product) => {
      // Construir html del carrito - Que viene de localStorage
      articulos++; // antes lo tenia abajo y me funcionaba mal
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
      inputCarrito.dataset.id = `input-${product.id}`
      inputCarrito.classList.add("input-carrito", "centrar-texto");
  
      inputCarrito.value = product.cantidad;
      divStock.append(spanRestar, inputCarrito, spanSumar);

      divContenidoCarrito.append(divStock);

      // Borrar
      const btnBorrar = document.createElement("span");
      btnBorrar.classList.add("btn-borrar");
      btnBorrar.dataset.id =`borrar-${product.id}`
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
})

  return datosProductosAgregados;
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
  borrarCarrito();
}

///***  Crear el HTML del Carrito ***///
function addCarritoHTML(product) {
  const carritoVacio = document.querySelector('.carrito-vacio')
  carritoVacio.innerHTML = ''

  let { image, name, price, id, cantidad } = product
  console.log(product)

  localStorage.length
  // Caja Producto
  const imgCarrito = document.createElement('img')
  imgCarrito.src = `${image}`
  imgCarrito.classList.add('img-comprar')

  // Borrar
  const btnBorrar = document.createElement('span')
  btnBorrar.classList.add('btn-borrar')
  btnBorrar.dataset.id = `borrar-${id}`;
  btnBorrar.textContent = 'x'

  // Seccion Contenido
  const divContenidoCarrito = document.createElement('div')
  divContenidoCarrito.classList.add('div-contenido-carrito', 'centrar-texto')
  const nombreProducto = document.createElement('p')
  nombreProducto.textContent = name
  const precioProducto = document.createElement('p')
  precioProducto.textContent = `$${price}`
  divContenidoCarrito.append(nombreProducto, precioProducto)

  // Seccion Stock
  let divStock = document.createElement("div");
  divStock.classList.add("stock");
  let spanRestar = document.createElement("span");
  spanRestar.textContent = "-";
  spanRestar.dataset.id = `-${id}`;
  spanRestar.classList.add("restar");
  let spanSumar = document.createElement("span");
  spanSumar.textContent = "+";
  spanSumar.dataset.id = `+${id}`;
  spanSumar.classList.add("sumar");
  let inputCarrito = document.createElement('input')
  inputCarrito.dataset.id = `input-${id}`
  inputCarrito.classList.add('input-carrito', 'centrar-texto')
  inputCarrito.value = 1
  divStock.append(spanRestar, inputCarrito, spanSumar)
  divContenidoCarrito.append(divStock)

  // Agregar img, y divs al producto-carrito
  let productoCarrito = document.createElement('div')
  productoCarrito.classList.add('producto-carrito')
  productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar)
  productosCarrito.append(productoCarrito)

  divComprar = document.createElement('div')
  divComprar.classList.add('div-comprar')

  articulos++
  numbCompras.textContent = articulos

  sumaSub = sumaSub + price;
  subTotal.textContent = sumaSub;
}

///*** BORRAR CARRITOOOOO ***/// QUE ES ESTO
function borrarCarrito() {
  const btnBorrar = document.querySelectorAll('.btn-borrar')
  const productoEliminar = document.querySelectorAll('.producto-carrito')
  for (let i = 0; i <= btnBorrar.length - 1; i++) {
    btnBorrar[i].addEventListener('click', (e) => {
      let id = parseInt(e.target.dataset.id)
      console.log(e.target.dataset.id)

      let itemsActualizar = JSON.parse(localStorage.getItem(`producto-${id}`))
      let itemsNuevo = itemsActualizar.filter((element) => element.id !== id)
      console.log(itemsNuevo)
      localStorage.setItem('Productos', JSON.stringify(itemsNuevo))

      productoEliminar[i].innerHTML = ''
      articulos--
      if (articulos == -1) {
        numbCompras.textContent = 0
      }

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


window.onload = async () => {
  await fetchProducts()
  // await addCarritoHTML()
  getProductosLocal()

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

  // Los tengo que agarrar aca que ya existen
  borrarCarrito()
}
