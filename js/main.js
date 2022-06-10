/*
// Listing HTML
			<section class="drink-item">
				<section class="description">
					<h2>Name</h2>
					<img src="" alt="">		
				</section>
				<section class="ingredients">
					<h3>Ingredients</h3>
                    <ul><ul>
				</section>
				<section class="instructions">
					<h4>Instructions</h4>
				</section>
			</section>
*/
const sectionDrinks = document.querySelector('.drinks')
const h3Error = document.querySelector(".error")

document.querySelector('button').addEventListener('click', getDrink)

function getDrink() {
    let userInput = document.querySelector('input').value
    const inputFormatted = userInput.split(' ').join('-')
    // console.log(inputFormatted)
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputFormatted}`

    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            // Data object w/ "drinks" property containing ARRAY of drink objects
            let drinks = data['drinks']
            // for each drink... create listing w/ relevant drink information
            // -> create DOM elements
            for (let index = 0; index < drinks.length; index++) {
                let sectionItem = document.createElement("section")
                sectionItem.className = "drink-item"
                // Description section
                let sectionDesc = document.createElement("section")
                sectionDesc.className = "description"
                let h2Elem = document.createElement("h2")
                h2Elem.innerText = drinks[index].strDrink
                sectionDesc.appendChild(h2Elem)
                let imgElem = document.createElement("img")
                imgElem.src = drinks[index].strDrinkThumb
                sectionDesc.appendChild(imgElem)
                sectionItem.appendChild(sectionDesc)
                // Description Ingredients
                let sectionIng = document.createElement("section")
                sectionIng.className = "ingredients"
                let h3Elem = document.createElement("h3")
                h3Elem.innerText = "Ingredients"
                sectionIng.appendChild(h3Elem)
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
                sectionIng.appendChild(ulIng)
                sectionItem.appendChild(sectionIng)
                // Instructions section
                let sectionInstr = document.createElement("section")
                sectionInstr.className = "instructions"
                let h4Elem = document.createElement("h4")
                h4Elem.innerText = drinks[index].strInstructions
                sectionInstr.appendChild(h4Elem)
                sectionItem.appendChild(sectionInstr)
                // Append sections to DOM
                sectionDrinks.appendChild(sectionItem)
            }})
        .catch(err => {
            h3Error.innerText = `No ${userInput}s today! Try something else...`
        })
}