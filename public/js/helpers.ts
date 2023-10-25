export let productList : Producto[] = []
export let arrayIds : Array<number> = []

interface Producto {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
    stock: number;
    cantidad: number;
}



export async function fetchProducts() : Promise <Producto[]> {
    let productos = await (await fetch('/api/productos')).json()
  
    let { registros } = productos;
  
    productList = registros;
  
    return productList;
  }


export function llenarIds () :  Array<number> {
    productList.forEach(element => {
      arrayIds.push(element.id)
    });
    return arrayIds;
}

// content?: - implica que es un argumento opcional
function createElementHtml(element: string, classname?: string[], content?: string, dataset?: string, src?: string)
    : HTMLElement {
        const elementoEtiqueta = document.createElement(element);

        if (classname) {
            elementoEtiqueta.className = (classname || []).join(' ');
        }

        if (content) {
            elementoEtiqueta.textContent = content;
        }

        if (dataset) {
            elementoEtiqueta.dataset.id = dataset;
        }

        if (src) {
            if (elementoEtiqueta instanceof HTMLImageElement) {
                elementoEtiqueta.src = src;
            } else {
                console.warn("El elemento no admite la propiedad 'src'.");
            }
        }

    return elementoEtiqueta;
}

//const divElement = createElementHtml("div", ["clase1", "clase2"], "Contenido del div", "123", "");
//const imgElement = createElementHtml("img", ["imagen-clase"], "", "456", "imagen.jpg");

