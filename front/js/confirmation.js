const productID = window.location.href;
const url = new URL(productID);
let showOrderId = url.searchParams.get("orderId");

// on affiche l'ID dans le html
document.querySelector("#orderId").innerHTML = showOrderId;