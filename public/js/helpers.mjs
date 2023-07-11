let datosProductosAgregados = []
let productList = []
let arrayIds = []
let ids = []

let total = 0;
let sumaSub = 0;
let articulos = 0;

const productosCarrito = document.querySelector(".productos-carrito");
const numbCompras = document.querySelector('.numero-compras')
const subTotal = document.querySelector('.sub-total')

// Traer los Productos de la BD
export async function fetchProducts() {
  let productos = await (await fetch('/api/productos')).json()

  let { registros } = productos;

  productList = registros;

  llenarIds()
}


export function llenarIds () {
  productList.forEach(element => {
    arrayIds.push(element.id)
  });
  console.log(arrayIds)
  return arrayIds;
}


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

export function getProductosLocal() {
    const promise = new Promise(function (resolve, reject) {
      resolve(arrayIds.forEach(id => {
        let data = JSON.parse(localStorage.getItem(`producto-${ id }`)) 
        if(data) datosProductosAgregados.push(data)
      }))
    })
  
    promise.then(function () {
      if (datosProductosAgregados) { 
        console.log(datosProductosAgregados)
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