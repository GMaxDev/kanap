const baseUrl = "http://localhost:3000/api"
const promise = fetch(`${baseUrl}/products`) //Envoi une requête
//double quote inversée pour traduire la variable

promise
    .then(response => response.json()) //récupère la réponse et la formate en json
    .then(data => data.forEach(element => {
        console.log(element)
        document.getElementById("items").innerHTML += 
        `<a href="./product.html?id=${element._id}">
            <article>
              <img src="${element.imageUrl}" alt="${element.altTxt}">
              <h3 class="productName">${element.name}</h3>
              <p class="productDescription">${element.description}</p>
            </article>
          </a>`
    }))
    .catch(error => console.log(`Erreur serveur: ${error}`))

