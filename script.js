
function appendNewCard(parentElement) {
  let cardElement = document.createElement("div");
  cardElement.className = "card";
  
  let cardDownElement = document.createElement("div");
  cardDownElement.className = "card-down";

  let cardUpElement = document.createElement("div");
  cardUpElement.className = "card-up";

  parentElement.appendChild(cardElement);
  cardElement.appendChild(cardDownElement);
  cardElement.appendChild(cardUpElement);

  return cardElement;
}

function shuffleCardImageClasses() {
  let cardImages = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6"];

  let shuffleCards = _.shuffle(cardImages);

  return shuffleCards;
}

function createCards(parentElement, shuffledImageClasses) {
  let cards = [];

  for (let i = 0; i < 12; i++)
  {
    let newCard = appendNewCard(parentElement);
    
    newCard.classList.add(shuffledImageClasses[i]);

    let cardObj = {index:i, element:newCard, imageClass: shuffledImageClasses[i]};

    cards.push(cardObj);
  }

  return cards;
}

function doCardsMatch(cardObject1, cardObject2) {
  return cardObject1.imageClass === cardObject2.imageClass;
}

let counters = {};

function incrementCounter(counterName, parentElement) {
  if (!(counterName in counters))
  {
    counters[counterName] = 0;
  }

  counters[counterName]++;

  parentElement.innerHTML = counters[counterName];
}

let clickAudio = new Audio('./audio/click.wav');
let matchAudio = new Audio('./audio/match.wav');
let winAudio = new Audio('./audio/win.wav')

function flipCardWhenClicked(cardObject) {
  cardObject.element.onclick = function() {
    if (cardObject.element.classList.contains("flipped")) {
      return;
    }
  
    clickAudio.play();

    cardObject.element.classList.add("flipped");

    setTimeout(function() {
      onCardFlipped(cardObject);
    }, 500);
  };
}

let lastCardFlipped = null;

function onCardFlipped(newlyFlippedCard) {
  incrementCounter("flip", document.querySelector("#flip-count"));

  if (lastCardFlipped === null)
  {
    lastCardFlipped = newlyFlippedCard;
    return;
  }
  else
  {
    if (doCardsMatch(newlyFlippedCard, lastCardFlipped))
    {
      incrementCounter("match", document.querySelector("#match-count"));

      newlyFlippedCard.element.style.animation = "matchAnim 1s";
      lastCardFlipped.element.style.animation = "matchAnim 1s";

      if (counters["match"] < 6)
      {
        matchAudio.play();
      }
      else
      {
        winAudio.play();

        document.querySelector("#my-canvas").classList.add("active");

        setTimeout(winAlert, 3000);
      }
    }
    else
    {
      newlyFlippedCard.element.classList.remove("flipped");
      lastCardFlipped.element.classList.remove("flipped");
    }

    lastCardFlipped = null;
  }
}


// Set up the game.
let cardObjects = 
  createCards(document.getElementById("card-container"), shuffleCardImageClasses());

if (cardObjects != null) {
  for (let i = 0; i < cardObjects.length; i++) {
    flipCardWhenClicked(cardObjects[i]);
  }
}

let confettiSettings = { target: 'my-canvas' };
 confetti = new ConfettiGenerator(confettiSettings);
confetti.render();

function winAlert() {
  if (confirm("YOU WON! Want to Play Again?")) {
    location.reload();
  }
}

runAllTests()