const myCart = JSON.parse(localStorage.getItem("myCart"));
const submitBtn = document.querySelector("#order");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

const baseUrl = "http://localhost:3000/api"
const promise = fetch(`${baseUrl}/products`)
let cart = JSON.parse(localStorage.getItem("myCart"))
let myProduct = {}
let cartPriceTotal = 0
let cartKanapTotal = 0

function showTotal(){
  for(let i in cart){

    let promise = fetch(`${baseUrl}/products/${cart[i].ID}`)
    promise
    .then(response => response.json())
    .then(data => {
  
      document.querySelector("#cart__items").innerHTML +=
  
      `<article class="cart__item" data-id="${cart[i].ID}" data-color="${cart[i].Color}">
      <div class="cart__item__img">
        <img src="${cart[i].Picture}" alt="${cart[i].PictureTxt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${cart[i].Name}</h2>
          <p>${cart[i].Color}</p>
          <p>${data.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].Quantity}" onchange="changeQuantity('${cart[i].Name}', '${cart[i].Color}')">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
  
    cartPriceTotal += (data.price * cart[i].Quantity)
    cartKanapTotal += parseInt(cart[i].Quantity)
  
    document.getElementById("totalQuantity").innerHTML =
    `${cartKanapTotal}`
    document.getElementById("totalPrice").innerHTML =
    `${cartPriceTotal}`

        
    // Gestion Bouton "Supprimer"

    const deleteBtn = document.querySelectorAll(".deleteItem");

    // Pour itérer sur tous les boutons supprimés. A la selection dans le DOM, le résultat est rendu sous forme d'un array
    for(let b = 0; b < deleteBtn.length; b++){
      deleteBtn[b].addEventListener("click", function(event){
        let removeProductId = myCart[b].ID;
        let removeProductColor = myCart[b].Color

        // Ici filter() sert a garder uniquement les produits qui n'ont pas été sélectionnés 
        const myNewCart = myCart.filter(element => element.ID !== removeProductId || element.Color !== removeProductColor);

        localStorage.setItem("myCart", JSON.stringify(myNewCart));

        alert("Ce produit a bien été supprimé du panier");

        location.reload();
      })
    }

    function changeQuantity() {
      const quantitySelecter = document.querySelectorAll(".itemQuantity");
    
      for (let p = 0; p < quantitySelecter.length; p++){
          quantitySelecter[p].addEventListener("change" , function(){
     
              const oldQuantity = myCart[p].Quantity;
              const quantityChanged = quantitySelecter[p].valueAsNumber;
              
              const quantityControl = myCart.find(element => element.quantityChanged !== oldQuantity);
    
            if(quantityChanged >= 1){
              if(quantityChanged >100){
                quantityChanged = 100
              }
              quantityControl.Quantity = quantityChanged;
              myCart[p].Quantity = quantityControl.Quantity;
            }
            else{
              myCart.filter(element => element.Quantity >= 1)
            }
              localStorage.setItem("myCart", JSON.stringify(myCart));
              location.reload();
          })
      }
    }

    changeQuantity()

    });
  }
}

showTotal();


//  Controle des informations user

const userForm = document.querySelectorAll("form input");

function datasUserControl() {

  // Controle du prenom
  const firstNameValidation = document.querySelector("#firstNameErrorMsg");
    firstName.addEventListener("change", function (e) {
        if (/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(e.target.value)) {
            firstNameValidation.innerHTML = "";
        } else {
            firstNameValidation.innerHTML = "Le prénom doit commencer par une majuscule et ne contenir que des lettres.";
        }
    })

  // Controle du nom
  const lastNameValidation = document.querySelector("#lastNameErrorMsg");
  lastName.addEventListener("change", function (e) {
      if (/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(e.target.value)) {
          lastNameValidation.innerHTML = "";
      } else {
          lastNameValidation.innerHTML = "Nom incorrect"
      }
  })

  // Controle de l'adresse postale (du type "1 rue de maréchal leclerc")
  const addressValidation = document.querySelector("#addressErrorMsg");
  address.addEventListener("change", function(e){
    if(/^.{3,144}$/.test(e.target.value)){
      addressValidation.innerHTML = "";
    }
    else{
      addressValidation.innerHTML = "Adresse incorrect"
    }
  })

  // Controle de la ville
  const cityValidation = document.querySelector("#cityErrorMsg");
  city.addEventListener("change", function (e) {
      if (/^[A-Z][A-Za-z\é\è\ê\-]+$/.test(e.target.value)) {
          cityValidation.innerHTML = "";
      } else {
          cityValidation.innerHTML = "Veuillez renseigner une ville existante et commencer par une majuscule"
      }
  })

  // Controle de l'adresse mail
  const emailValidation = document.querySelector("#emailErrorMsg");
  email.addEventListener("change", function (e) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value)) {
          emailValidation.innerHTML = "";
      } else {
          emailValidation.innerHTML = "Adresse email incorrect !"
      }
  })
}


datasUserControl();



// Envoyer les données user et récupère l'ID de la commmande


submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if(firstName.value !== "" && lastName.value !== "" && address.value !== "" && city.value !== "" && email.value !== ""){
    let productsInfo = [];
 
    for (let i = 0; i < myCart.length; i++) {
        productsInfo.push(myCart[i].ID);
    }
 
    const userInfo = {
        contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
        },
        products: productsInfo
    }
      const options = {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json"
      }
    }
      
    fetch("http://localhost:3000/api/products/order", options)
    .then((response) => {return response.json()})
    .then((data) => {
      
      // Passe le "orderId" en paramètre de l'url
      window.location.href = `confirmation.html?orderId=${data.orderId}`;
      localStorage.clear()
    })
    .catch((err) => {
      console.log(err)
    })
  }
  })

