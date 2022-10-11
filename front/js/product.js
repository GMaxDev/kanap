const baseUrl = "http://localhost:3000/api"
const productID = window.location.search.substring(4)//récupère le param. en excluant une partie de la chaine initiale
let myProduct = {}
const promise = fetch(`${baseUrl}/products/${productID}`)
let firstColor = 0

promise
    .then(response => response.json())
    .then(data => {
        //J'affiche toute les données grâce à la promesse que j'ai récupérée en json
        document.getElementsByClassName("item__img")[0].innerHTML =
        `<img src="${data.imageUrl}" alt="${data.altTxt}">`
        document.getElementById("title").innerHTML =
        `${data.name}`
        document.getElementById("price").innerHTML =
        `${data.price}`
        document.getElementById("description").innerHTML =
        `${data.description}`

        //je liste les couleurs avec une boucle
        data.colors.forEach(element => {
            document.getElementById("colors").innerHTML +=
            `<option value="${element}">${element}</option>`
        });


        myProduct = {
            ID: productID,
            Name: data.name,
            Picture: data.imageUrl,
            PictureTxt: data.altTxt,
            //Price: data.price
        }
    })

    let button = document.getElementById("addToCart")
    button.addEventListener("click", () =>{
        const kanapColor = document.getElementById("colors").value
        const kanapQuantity = document.querySelector("#quantity").value
        const kanapName = document.getElementById("title").value

        myProduct.Color = kanapColor
        myProduct.Quantity = kanapQuantity


        let myCart = JSON.parse(localStorage.getItem('myCart'))

        if (kanapColor != "" && kanapQuantity > 0){
            window.alert("L'ajout au panier a été effectué")

            if (myCart === null){
                let cartTab = []
                cartTab.push(myProduct)
                localStorage.setItem('myCart', JSON.stringify(cartTab))
            }
            else{

                let existenceCart = JSON.parse(localStorage.getItem("myCart"))
                //console.log(existenceCart)
                const productControl = existenceCart.find(kanap => kanap.ID == productID && kanap.Color == kanapColor)
                if (productControl){
                    let finalQuantity = parseInt(myProduct.Quantity) + parseInt(productControl.Quantity)
                    //console.log(finalQuantity)
                    
                    let findID = existenceCart.findIndex((kanap) => kanap.ID == productID && kanap.Color == kanapColor)

                    existenceCart[findID].Quantity = finalQuantity
                    localStorage.setItem('myCart', JSON.stringify(existenceCart))
                }
                else{
                    myCart.push(myProduct)
                    localStorage.setItem('myCart', JSON.stringify(myCart))
                }
            }
        }
        else{
            window.alert("Erreur lors de l'ajout au panier. Vérifier la couleur et la quantité")
        }

        
})