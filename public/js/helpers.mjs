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

export function traerIdsLocalStorage (ids) {
  //console.log(ids)
  ids.forEach(id => {
      let data = JSON.parse(localStorage.getItem(`producto-${ id }`)) 
      if(data) datosProductosAgregados.push(data)
      else return;
  })
  
}

export function mostrarSubtotalPorProducto (producto) {
  const subTotalProducto = calcularSubTotalProducto(producto)
  const spanPrecio = document.querySelector(`[data-id="price-${ producto.id }"]`).innerHTML = `$${ subTotalProducto }`
}

export function calcularSubTotalProducto(product) {
  console.log(product)

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
      console.log(precio)
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

  if(btnsSumar) {
    for (let index = 0; index < btnsSumar.length; index++) {

      btnsSumar[index].addEventListener("click", (e)=> {
        inputCarrito[index].value++;
        const idProducto = (e.target.dataset.id).split("-") 
        let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${ idProducto[1] }`))
        getProductActualizar.cantidad =  Number(inputCarrito[index].value)
        localStorage.setItem(`producto-${idProducto[1] }`, JSON.stringify(getProductActualizar));
        console.log(getProductActualizar)
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
  const mas = document.querySelector(`[data-id="sumar-${ id }"]`)
  console.log(mas)
  mas.addEventListener("click", () => {
    const input = document.querySelector(`[data-id="input-${ id }"]`)
    input.value++
      let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${id}`))
      getProductActualizar.cantidad =  Number(input.value)
      localStorage.setItem(`producto-${ id }`, JSON.stringify(getProductActualizar));
      console.log(getProductActualizar)
      const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
      const inputPrecio = document.querySelector(`[data-id="price-${ id }"]`).innerHTML = `$${ subTotalProducto }` 
      mostrarSubtotalHtml()
  })
}


export function eventoRestar(id) {
  const restar = document.querySelector(`[data-id="restar-${ id }"]`)
  restar.addEventListener("click", () => {
    const input = document.querySelector(`[data-id="input-${ id }"]`)
    input.value--
      let getProductActualizar =  JSON.parse(localStorage.getItem(`producto-${id}`))
      getProductActualizar.cantidad =  Number(input.value)
      localStorage.setItem(`producto-${ id }`, JSON.stringify(getProductActualizar));
      console.log(getProductActualizar)
      const subTotalProducto  =  calcularSubTotalProducto(getProductActualizar)
      const inputPrecio = document.querySelector(`[data-id="price-${ id }"]`).innerHTML = `$${ subTotalProducto }` 
      mostrarSubtotalHtml()
  })
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
let productoCarrito = document.querySelectorAll(".producto-carrito")

export function getProductosLocal() {
  llenarIds();
  
  const promise = new Promise(function (resolve, reject) {
    resolve(traerIdsLocalStorage(arrayIds))
  })
  promise
    .then(function () {
      htmlCarritoLocalStorage()
  })
  .then(function () {
    //productoCarrito = document.querySelectorAll(".producto-carrito")
    console.log(productosCarrito.children)
    console.log(productosCarrito.children.length)
    
})}


