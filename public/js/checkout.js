let array = [];
let divPedido = document.querySelector(".contenido-pedido");
let cantidadPedido = document.querySelector(".cantidad-pedido");
let infoPedido = document.querySelector(".info-pedido");

window.onload = () => {
  checkoutHTML();
};

let ids = JSON.parse(localStorage.getItem(`productoIds`)) 
let datosProductosAgregados = []

function getProductosLocal() {
  ids.forEach(id => {
      let data = JSON.parse(localStorage.getItem(`producto-${ id }`)) 
      if(data) datosProductosAgregados.push(data)
  })
  return datosProductosAgregados;
}


function checkoutHTML(product) {
  let pedidoHTML = "";

  const datosProductos = getProductosLocal()
  datosProductos.forEach((product) => {
    console.log(product);
    let { name, image, price, id, cantidad } = product;

    ids.push(id);

    let subTotalPedido =  price * cantidad;
    pedidoHTML += `
      <div class="producto-pedido">
        <img class="imagen-pedido" src="${image}" alt="foto-${name}" />
        <div class="info-pedido">
          <h3 class="nombre-pedido">${name}</h3>
          <p class="cantidad-pedido">${cantidad}</p>
          <p class="precio-pedido">$${subTotalPedido}</p>
        </div>
      </div> `;
    divPedido.innerHTML = pedidoHTML;

    // Promocion
    const promo = document.createElement("p");
    promo.classList.add("codigo-promo");
    promo.textContent = "Ingresa un codigo de promocion";
    // Pedido
    const divTotalPedido = document.createElement("div");
    divTotalPedido.classList.add("div-total-pedido");
    const ulTotal = document.createElement("ul");
    // SubTotal
    const liSub = document.createElement("li");
    const pCategoriaSub = document.createElement("p");
    pCategoriaSub.textContent = "SubTotal:";
    const pSub = document.createElement("p");
    pSub.textContent = "MUCHO!";
    // Envio
    const liEnvio = document.createElement("li");
    const pCategoriaEnvio = document.createElement("p");
    pCategoriaEnvio.textContent = "Envio:";
    const pEnvio = document.createElement("p");
    pEnvio.textContent = "Gratis";
    // Total
    const liTotal = document.createElement("li");
    liTotal.classList.add("liTotal");
    const pCategoriaTotal = document.createElement("h2");
    pCategoriaTotal.textContent = "Total:";
    const pTotal = document.createElement("p");
    pTotal.textContent = "MUCHO MAS!";

    liSub.append(pCategoriaSub, pSub);
    liEnvio.append(pCategoriaEnvio, pEnvio);
    liTotal.append(pCategoriaTotal, pTotal);
    ulTotal.append(liSub, liEnvio, liTotal);
    divTotalPedido.append(promo, ulTotal);
    divPedido.append(divTotalPedido);

    console.log(ids);
  });

  // console.log(JSON.parse(localStorage.getItem(`producto-carrito${i}`)))
}

/*
  const imgPedido = document.querySelector('.nombre-pedido')
  imgPedido.src = image
  const namePedido = document.querySelector('.nombre-pedido')
  namePedido.textContent = name
  const cantidadPedido = document.querySelector('.cantidad-pedido')
  const precioPedido = document.querySelector('.precio-pedido')
  precioPedido.textContent = price
  */

// Pagar los productos
async function pay() {
  let shipping = {
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    phone: document.querySelector("#phone").value,
    adress: document.querySelector("#adress").value,
    city: document.querySelector("#city").value,
    state: document.querySelector("#state").value,
    postalCode: document.querySelector("#postalCode").value,
  };

  try {
    const data = [shipping, ids];
    const preference = await (
      await fetch("/api/pay", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    console.log(preference)
    const script = document.createElement("script");
    script.src =
      "https://www.mercadopago.com.uy/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference.preferenceId;
    // Opcion de MP para personalizar el botton
    script.setAttribute("data-button-label", "Pagar con Mercado Pago");
    document.getElementById("order-actions").innerHTML = "";
    document.querySelector("#order-actions").appendChild(script);
  } catch (error) {
    console.log(error);
  }
}
