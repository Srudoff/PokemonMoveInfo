const pokeSelect = document.getElementById("pokeSelect");
const pokeImg = document.getElementById("pokeImg"); 
const moveList = document.getElementById("moveList"); 
const pokeMoves = document.getElementById("pokemoves");
const output = document.getElementById("output");

let typeUrl;
let moveType;
let moveColor;
let slot;

let colorTile = (typeName) => 
{
    switch(typeName)
    {
        case "poison":
            moveColor = "darkViolet";
            break; 
        case "normal":
            moveColor = "blanchedAlmond"; 
            break;   
        case "fire":
            moveColor = "tomato"; 
            break;
        case "water":
            moveColor = "cornflowerBlue";
            break;    
        case "steel":
            moveColor = "cadetBlue";
            break;                              
        case "electric":
            moveColor = "yellow";
            break;
        case "bug":
            moveColor = "oliveDrab";
            break;
        case "grass":
            moveColor = "lawnGreen";
            break;
        case "psychic":
            moveColor = "deepPink";
            break;
        case "ground":
            moveColor = "darkGoldenRod";
            break;
        case "ghost":
            moveColor = "mediumSlateBlue";
            break;
        case "fairy":
            moveColor = "plum";
            break;
        case "fighting":
            moveColor = "indianRed";
            break;
        case "rock":
            moveColor = "sienna";
            break;
        case "dark":
            moveColor = "slateGray";
            break;
        case "dragon":
            moveColor = "darkCyan";
            break;
        case "ice":
            moveColor = "darkTurquoise";
            break;
        case "flying":
            moveColor = "lightBlue";
            break;
        default:
            moveColor = "midnightBlue";
    }
}


fetch('https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0')
    .then(response => response.json()) 
    .then(data => {
        const pokeList = data.results;

        for(i = 0; i < data.count; i++) 
        {
            const opt = document.createElement("option");
            opt.textContent = pokeList[i]["name"];
            opt.value = i + 1; 
            pokeSelect.appendChild(opt); 
        }
        
        document.getElementById("pokeSelectBtn").addEventListener("click", function() {
            let selectedPoke = pokeSelect.value - 1;
            fetch(pokeList[selectedPoke]["url"]) 
                .then(response => response.json())
                .then(pokemon => {
                    moveArr = pokemon.moves;
                    typeArr = [];

                    pokeImg.src = pokemon.sprites.front_default; 

                    if(moveList.childElementCount > 0 || pokemoves.childElementCount >= 3) 
                    {                        
                        moveList.innerHTML = ''; 
                        pokemoves.innerHTML = '';
                    }
                    
                    moveArr.forEach(learnableMove => 
                    {
                        var move = document.createElement("div"); 
                        move.textContent = learnableMove.move["name"];
                        move.className = "move-tile";
                        move.id = "move-tile"
                        moveList.appendChild(move);
                        
                        fetch(learnableMove.move["url"])
                        .then(response => response.json())
                        .then(moveInfo => {
                            learnableMove.move["type"] = moveInfo.type.name;
                            learnableMove.move["class"] = moveInfo.damage_class["name"];
                            typeArr.push(moveInfo.type.name);
                            typeArr.forEach(type => {colorTile(type)});
                            move.style.backgroundColor = moveColor;
                            learnableMove.move["typeUrl"] = moveInfo.type.url;
                            move.addEventListener("click", function() 
                            {
                                featureMove(learnableMove.move["name"], learnableMove.move["type"], learnableMove.move["class"]);
                                calculateEffectiveness(moveInfo.type.url);
                                outputInfo();
                            });
                        });
                    });
                    
                });
        });

    });
      
featureMove = (content, type, damageClass) =>
{
    if(pokemoves.children.length <= 3)
    {
        slot = document.createElement("div");
        slot.textContent = content;
        slot.className = "slot";
        slot["damageClass"] = damageClass;
        slot["name"] = content;
        slot["type"] = type;
        colorTile(type);
        slot.style.backgroundColor = moveColor;
        pokeMoves.appendChild(slot);
        slot.addEventListener("click", function() {this.remove();});
    }

}

document.getElementById("randomButton").addEventListener("click", function()
{
    if(pokemoves.children.length <= 3)
    {
        randomPick = Math.floor(Math.random() * moveList.children.length);
        featureMove(moveArr[randomPick].move["name"], moveArr[randomPick].move["type"], moveArr[randomPick].move["class"]);
        calculateEffectiveness(moveArr[randomPick].move["typeUrl"])
        outputInfo();
    }

});

calculateEffectiveness = (type) =>
{
    
    fetch(type)
        .then(response => response.json())
        .then(typeInfo => 
        {
            strongAgainst = typeInfo.damage_relations.double_damage_to;
            
            for(let i = 0; i < strongAgainst.length; i++) 
            {
                weakType = document.createElement("div");
                weakType.textContent = strongAgainst[i]["name"];
                if(slot["damageClass"] != "status")
                {
                    addWeakTypes(weakType);
                }
            }
        });     
}
    
addWeakTypes = (weakness) =>
{
    output.appendChild(weakness);
}

outputInfo = () =>
{
    if(slot["damageClass"] != "status")
    {
        output.textContent = `${slot["name"].toUpperCase()} is a ${slot["type"]} type ${slot["damageClass"]} move. It is super effective against the following Pokemon types: `
    }
    else
    {
        output.textContent = `${slot["name"].toUpperCase()} is a ${slot["type"]} type ${slot["damageClass"]} move.`
    }
}