let results = document.querySelector('.results')
let cardIndex = 0

document.querySelector('button').addEventListener('click', getDrink)

function getDrink() {
    // Clear existing elements inside drinks section
    removeAllChildNodes(results)
    // User query thecocktaildb.com
    let userInput = document.querySelector('input').value
    const inputFormatted = userInput.split(' ').join('-')
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputFormatted}`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            // Data object w/ "drinks" property containing ARRAY of drink objects
            let drinks = data['drinks']

            // Slide control div
            let controlPanel = document.createElement("div")
            controlPanel.className = "control-panel"

            let buttonPrevious = document.createElement("button")
            buttonPrevious.className = "control"
            buttonPrevious.setAttribute('id', "previous")
            let chevronLeft = document.createElement("i")
            chevronLeft.className = "fa-solid fa-chevron-left"
            buttonPrevious.appendChild(chevronLeft)

            let buttonNext = document.createElement("button")
            buttonNext.className = "control"
            buttonNext.setAttribute('id', "next")
            let chevronRight = document.createElement("i")
            chevronRight.className = "fa-solid fa-chevron-right"
            buttonNext.appendChild(chevronRight)

            controlPanel.appendChild(buttonPrevious)
            controlPanel.appendChild(buttonNext)

            // Drinks div(s)
            let divDrinks = document.createElement("div")
            divDrinks.className = "drinks slideshow"

            // create card div w/ relevant info per drink
            // -> create DOM elements
            for (let index = 0; index < drinks.length; index++) {
                let card = document.createElement("div")
                card.className = index != 0 ? "card" : "card show"
                // drink image in thumb div
                let thumb = document.createElement("div")
                thumb.className = "thumb"
                let thumbURL = drinks[index].strDrinkThumb
                thumb.style.setProperty('background-image', `url('${thumbURL}')`)
                // drink info in article element
                article = document.createElement("article")
                let h1Elem = document.createElement("h1")
                h1Elem.innerText = drinks[index].strDrink
                article.appendChild(h1Elem)
                // Ingredients list
                let ulIng = document.createElement("ul")
                let objIngredients = {}
                // parse drink keys with associated properties to find, set ingredients
                // ISSUE: the following only works if there are under 10 ingredients:
                // -> key[key.length-1] only takes the last char, assumes it's a single-digit number
                for (const [key, prop] of Object.entries(drinks[index])) {
                    if (key.startsWith('strMeasure') && prop !== null) {
                        objIngredients[key[key.length-1]] = prop
                    }
                }
                for (const [key, prop] of Object.entries(drinks[index])) {
                    if (key.startsWith('strIngredient') && prop !== null) {
                        if (objIngredients[key[key.length-1]]) {
                            objIngredients[key[key.length-1]] += prop
                        }
                    }
                }
                // console.log(Object.keys(objIngredients).length)
                for (let ing in objIngredients) {
                    if (objIngredients[ing] !== "") {
                        let liNew = document.createElement("li")
                        liNew.innerText = objIngredients[ing]
                        ulIng.appendChild(liNew)
                    }
                }
                article.appendChild(ulIng)
                // Instructions
                let pInstructions = document.createElement("p")
                pInstructions.innerText = drinks[index].strInstructions
                article.appendChild(pInstructions)
                // Append image, info elements to card div
                card.appendChild(thumb)
                card.appendChild(article)
                divDrinks.appendChild(card)
            }
            // Add click event listeners
            buttonPrevious.addEventListener('click', previousCard)
            buttonNext.addEventListener('click', nextCard)            
            // Append drinks div to results section
            results.appendChild(controlPanel)
            results.appendChild(divDrinks)
        })
        .catch(err => {
            let h3Error = document.createElement("h3")
            h3Error.className = "error"
            h3Error.innerText = `No ${userInput}s today! You can searching for something else.`
            results.appendChild(h3Error)
        })
}

// Card slide functions
function goToCard(n) {
  let cards = document.querySelectorAll('.card')
  cards[cardIndex].className = 'card'
  cardIndex = (n + cards.length) % cards.length
  cards[cardIndex].className = 'card show'
}

function nextCard() {
    goToCard(cardIndex + 1)
}

function previousCard() {
    goToCard(cardIndex - 1)
}

// Remove elements from results section
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
