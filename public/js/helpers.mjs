export let datosProductosAgregados = []
export let productList = []
export let arrayIds = []
let ids = []

export let total = 0;
export let subTotal = 0;
let sumaSub = 0;
let articulos = 0;

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

function htmlCarrito () {
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
      const precioProducto = createElementHtml("p", [], product.price, `price-${product.id}`)
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
      sumaSub = product.cantidad * product.price
      document.querySelector(`[data-id="price-${product.id}"]`).textContent= sumaSub
      total = total + sumaSub
      subTotalHtml.innerHTML = `$${total}`;
    });
  }
}

export function getProductosLocal() {
    llenarIds();
    const promise = new Promise(function (resolve, reject) {
      resolve(arrayIds.forEach(id => {
        let data = JSON.parse(localStorage.getItem(`producto-${ id }`)) 
        if(data) datosProductosAgregados.push(data)
      }))

      return datosProductosAgregados
    })
  
    promise.then(function () {
      htmlCarrito()
  })

  promise.then(function () {
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
  })
  promise.then( () => datosProductosAgregados)
  }

  