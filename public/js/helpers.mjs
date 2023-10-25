export let productList = []
export let arrayIds = []
let ids = []

export let total = 0;
export let subTotal = 0;
let sumaSub = 0;
let articulos = 0;
let datosProductosAgregados = []

const productosCarrito = document.querySelector(".productos-carrito");
const numbCompras = document.querySelector('.numero-compras')
const subTotalHtml = document.querySelector('.sub-total')

// Traer los Productos de la BD
export async function fetchProducts() {
  let productos = await (await fetch('/api/productos')).json()

  let { registros } = productos;

  productList = registros;

  return productList;
}

export function llenarIds () {
  productList.forEach(element => {
    arrayIds.push(element.id)
  });
  return arrayIds;
}

export function createElementHtml (element, classname, content, dataset, src) {
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

function deshabilitarBtnAgregar (id, estado) {
  let btnAgregarCarrito = document.querySelector(`[data-id="${ id }"]`)
  btnAgregarCarrito.disabled = true;
  btnAgregarCarrito.classList.add("disabled")
  if(estado === false) {
    btnAgregarCarrito.disabled = false;
    btnAgregarCarrito.classList.remove("disabled")
  }
}
export function traerIdsLocalStorage (ids) {
  //console.log(ids)
  ids.forEach(id => {
      let data = JSON.parse(localStorage.getItem(`producto-${ id }`)) 
      if(data) {
        datosProductosAgregados.push(data)
        // Deshabilitar agregar producto 
        deshabilitarBtnAgregar(id)
      }
      else return;
  })
  
}

export function mostrarSubtotalPorProducto (producto) {
  const subTotalProducto = calcularSubTotalProducto(producto)
  const spanPrecio = document.querySelector(`[data-id="price-${ producto.id }"]`).innerHTML = `$${ subTotalProducto }`
}

export function calcularSubTotalProducto(product) {
  let subTotalProducto = product.cantidad * product.price
  return subTotalProducto
}

export function mostrarSubtotalHtml () {
  let cuenta = 0
  const getIds = JSON.parse(localStorage.getItem("productoIds"))
  if(getIds) {
    for (let index = 0; index < getIds.length; index++) {
      const getProduct = JSON.parse(localStorage.getItem(`producto-${ getIds[index] }`))  
      let precio = calcularSubTotalProducto(getProduct)
      cuenta += precio
      subTotalHtml.innerHTML = `$${cuenta}`
    }
  }
  if(!getIds) subTotalHtml.innerHTML = `$0`
}

export function mostrarNumeroArticulosHtml () {
  const getIds = JSON.parse(localStorage.getItem("productoIds"))
  if(getIds) numbCompras.textContent = getIds.length
  else numbCompras.textContent = 0  
 
}


export function eventoSumarEnTodos () {
  const inputCarrito = document.querySelectorAll(".input-carrito");
  const btnsSumar = document.querySelectorAll(".sumar")
  console.log("sumar en todos")
  if(btnsSumar) {
    for (let index = 0; index < btnsSumar.length; index++) {

      btnsSumar[index].addEventListener("click", (e)=> {
        inputCarrito[index].value++;
        const idProducto = (e.target.dataset.id).split("-") 
        let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${ idProducto[1] }`))
        getProductActualizar.cantidad =  Number(inputCarrito[index].value)
        localStorage.setItem(`producto-${idProducto[1] }`, JSON.stringify(getProductActualizar));
        //console.log(getProductActualizar)
        const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
        const inputPrecio = document.querySelector(`[data-id="price-${ idProducto[1] }"]`).innerHTML = `$${ subTotalProducto }` 
        mostrarSubtotalHtml()
      })


    }
  }
} 

export function eventoRestarEnTodos () {
  const inputCarrito = document.querySelectorAll(".input-carrito");
  const btnsRestar = document.querySelectorAll(".restar")
  if(btnsRestar) {
    for (let index = 0; index < btnsRestar.length; index++) {

      btnsRestar[index].addEventListener("click", (e)=> {
        inputCarrito[index].value--
        const idProducto = (e.target.dataset.id).split("-") 
        let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${ idProducto[1] }`))
        getProductActualizar.cantidad =  Number(inputCarrito[index].value)
        localStorage.setItem(`producto-${idProducto[1] }`, JSON.stringify(getProductActualizar));

        const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
        const inputPrecio = document.querySelector(`[data-id="price-${ idProducto[1] }"]`).innerHTML = `$${ subTotalProducto }` 
        mostrarSubtotalHtml()
      })

    }
  }
} 


export function eventoSumar(id) {
  console.log("individual")
  const mas = document.querySelector(`[data-id="sumar-${ id }"]`)
  console.log(mas)
  mas.addEventListener("click", () => {

    console.log("se dio click en evento sumar individual")
    const input = document.querySelector(`[data-id="input-${ id }"]`)
    console.log(input.value)
    let valorInput = Number(input.value)
    console.log(valorInput)
    valorInput++
    console.log(valorInput)

    let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${id}`))
    getProductActualizar.cantidad =  valorInput
    localStorage.removeItem(`producto-${id}`) 
    localStorage.setItem(`producto-${ id }`, JSON.stringify(getProductActualizar));
    console.log(getProductActualizar)

    const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
    const subTotalPorProducto = document.querySelector(`[data-id="price-${ id }"]`).innerHTML = `$${ subTotalProducto }` 
    const subTotalTodos = mostrarSubtotalHtml()
  })
}


export function eventoRestar(id) {
  const restar = document.querySelector(`[data-id="restar-${ id }"]`)
  restar.addEventListener("click", () => {

    const input = document.querySelector(`[data-id="input-${ id }"]`)
    let valorInput = Number(input.value)
    console.log(valorInput)
    valorInput--

    let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${id}`))
    getProductActualizar.cantidad =  valorInput;
    
    console.log(getProductActualizar)
    localStorage.removeItem(`producto-${id}`) 
    localStorage.setItem(`producto-${ id }`, JSON.stringify(getProductActualizar));

    const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
    const subTotalPorProducto = document.querySelector(`[data-id="price-${ id }"]`).innerHTML = `$${ subTotalProducto }` 
    const subTotalTodos =  mostrarSubtotalHtml()
  })
}
export function eventoInputCantidad(id) {
  const inputCantidad = document.querySelector(`[data-id="input-${ id }"]`)
  inputCantidad.addEventListener("change", (input) => {
      let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${id}`))
      let valorInput = Number(input.value)
      getProductActualizar.cantidad =  valorInput
      localStorage.setItem(`producto-${ id }`, JSON.stringify(getProductActualizar));
      const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
      const subTotalPorProducto = document.querySelector(`[data-id="price-${ id }"]`).innerHTML = `$${ subTotalProducto }` 
      const subTotalTodos = mostrarSubtotalHtml()
  })
}
export function borrarItemCarrito() {
  const btnBorrar = document.querySelectorAll('.btn-borrar') 
  let resta = 0
  
  for (let i = 0; i <= btnBorrar.length - 1; i++) {
    btnBorrar[i].addEventListener('click', (e) => {
      const obtenerSubtotal = document.querySelector(".sub-total").textContent.split("$")
      const subtotal = parseInt(obtenerSubtotal[1])
      console.log(subTotal)

      let id = (e.target.dataset.id).split("-")

      new Promise (function(resolve, reject) {
        resolve( restarSubtotal(id))
        reject(console.log("Error"))

      })
      .then(function() {
        e.target.parentNode.parentNode.removeChild(document.querySelector(`[data-id="producto-${ id[1] }"]`))
        localStorage.removeItem(`producto-${ id[1] }`)
        const getIds = JSON.parse(localStorage.getItem("productoIds"))
        ids = getIds.filter((elementId) => elementId != Number( id[1] ))
        console.log(ids)
        localStorage.removeItem("productoIds")
        ids.length > 0 ?  localStorage.setItem(`productoIds`, JSON.stringify(ids)) : ""
        
        mostrarNumeroArticulosHtml()
        if(location.pathname === "/tienda.html")  deshabilitarBtnAgregar(id[1], false)
      })

      function restarSubtotal (id) {
        const obtenerCosto = document.querySelector(`[data-id="price-${id[1]}"]`).textContent.split("$")
        console.log(obtenerCosto)
        if(obtenerCosto) {
          const costo = parseInt(obtenerCosto[1])
          resta = subtotal - costo
          subTotalHtml.innerHTML = `$${resta}`
        }
      }
    })}
  }

export function htmlCarritoLocalStorage () {
  if (datosProductosAgregados) { 
    document.querySelector(".producto-vacio").innerHTML = ""
    datosProductosAgregados.forEach((product) => {
      ids = JSON.parse(localStorage.getItem(`productoIds`)) 
      // Construir html del carrito - Que viene de localStorage
      articulos++; // antes lo tenia abajo y me funcionaba mal

      // element, classname, content, dataset, src 
      const imgCarrito = createElementHtml("img", ["img-comprar"], "", "", product.image)
    
      // Seccion Contenido
      const divContenidoCarrito = createElementHtml("div", ["div-contenido-carrito", "centrar-texto"])
      const nombreProducto = createElementHtml("p", [], product.name)
      const precioProducto = createElementHtml("p", [], `$${ product.price }`, `price-${product.id}`)
      divContenidoCarrito.append(nombreProducto, precioProducto);

      // Seccion Stock
      const divStock = createElementHtml("div", ["stock"])
      const spanRestar = createElementHtml("span", ["restar"], "-", `restar-${product.id}`)
      const spanSumar = createElementHtml("span", ["sumar"], "+", `sumar-${product.id}`)
      const inputCarrito = createElementHtml("input", ["input-carrito", "centrar-texto"], "", `input-${product.id}`)
      inputCarrito.value = product.cantidad;
      divStock.append(spanRestar, inputCarrito, spanSumar);
      divContenidoCarrito.append(divStock);

      // Borrar
      const btnBorrar = createElementHtml("span", ["btn-borrar"], "x", `borrar-${product.id}`)
  
      const productoCarrito = createElementHtml("div", ["producto-carrito"], "", `producto-${product.id}`)
      productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
      productosCarrito.append(productoCarrito);

      // Me aparecen 2 producto-carrito's creados antes en el HTML
      
      numbCompras.textContent = articulos;
      sumaSub = product.cantidad * product.price
      document.querySelector(`[data-id="price-${product.id}"]`).textContent=  `$${sumaSub}`;
      total = total + sumaSub
      subTotalHtml.innerHTML = `$${total}`;
      
    });
  } 


  mostrarSubtotalHtml()
}


export function getProductosLocal() {
  llenarIds();
  
  const promise = new Promise(function (resolve, reject) {
    resolve(traerIdsLocalStorage(arrayIds))
  })
  promise
    .then(function () {
      htmlCarritoLocalStorage()
  })
}


