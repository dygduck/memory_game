// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * Create a list that holds all of your cards
 */
var cardTypes = [
  "diamond",
  "paper-plane-o",
  "anchor",
  "bolt",
  "cube",
  "leaf",
  "bicycle",
  "bomb"
];

var deck = [];
var clicks = [];
var matchedCardTypes = [];
var stars = 3;
var movesElem = null;
var timerElem = null;
var starsElem = null;
// Timer to keep track of time
var timer;
// Time when game start
var startTime;
// Time when timer is paused
var previousTime=0;


// For each card type, add a card to the deck array two times.
cardTypes.forEach(function(cardType, i) {
  deck.push({ id: i*2, type: cardType, open: false, match: false });
  deck.push({ id: i*2+1, type: cardType, open: false, match: false });
});


shuffle(deck);
// creates
function createCardElem(card) {
  return '<li class="card" id="'+ card.id + '"><i class="fa fa-' + card.type + '"></i></li>';
};

//this function takes a deck and appends elements to list.
function renderDeck(deck) {
  var deckElem = $(".deck");
  deckElem.empty();
  deck.forEach(function(card) {
    deckElem.append(createCardElem(card));
    setupClickListener(card);
  });
};


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function handleClick(card) {
  var count = clicks.length;
  if (clicks.length === 0){
    startTimer();
  }
  if (card.open || card.match) {
    return;
  }
  if (count % 2 === 0) {
    clicks.push(card);
    showCard(card);
    if (count >= 2) {
      var openCard1 = clicks[count - 1];
      var openCard2 = clicks[count - 2];
      if (!openCard1.match) {
        hideCard(openCard1);
      }
      if (!openCard2.match) {
        hideCard(openCard2);
      }
    }
  }
  else {
    clicks.push(card);
    showCard(card);
    var openCard = clicks[count - 1];
    if (openCard.type === card.type && openCard.id !== card.id) {
      matchCards(card, openCard);
    }
  }
  updateMoves();
  updateStars();
}

 function setupClickListener(card) {
   //set up the event listener for a card. If a card is clicked:
   //display the card's symbol.
   $("#" + card.id).click(function() {
     //alert("Handler for"+ id +".click() called.");
     handleClick(card);
   });
 }

function showCard(card) {
  //if the cards match, mark the card visible.
  card.open = true;
  $("#" + card.id).addClass("open show");
}

function hideCard(card) {
  //if the cards do not match, mark the card as invisible.
  card.open = false;
  $("#" + card.id).removeClass("open show");
}

function matchCards(card1, card2) {
  //if the cards match, keep them in the open position. And add
  // matched cards into matchedCardTypes, once they are all
  // matched stop the timer and alert the message.
  card1.match = true;
  card2.match = true;
  $("#" + card1.id).addClass("match");
  $("#" + card2.id).addClass("match");
  $("#" + card1.id).removeClass("open show");
  $("#" + card2.id).removeClass("open show");
  matchedCardTypes.push(card1.type);
  if (matchedCardTypes.length === cardTypes.length) {
    endGame();
  }
}

function endGame() {
  // once the game ends, it stops the timer and pops up a message
  stopTimer();
  var text = "Congrats! You did it! Your timing is: " + getTime() + " and your rating was: " + stars + " stars!";
  $("#win-message").text(text);
  $(".modal").css("display", "block");
}

function restartGame() {
  $(".modal").css("display", "none");
  deck = [];
  cardTypes.forEach(function(cardType, i) {
    deck.push({ id: i*2, type: cardType, open: false, match: false });
    deck.push({ id: i*2+1, type: cardType, open: false, match: false });
  });
  shuffle(deck);
  clicks = [];
  updateMoves();
  updateStars();
  matchedCardTypes = [];
  resetTimer();
  renderDeck(deck);
  startTimer();
}

function updateMoves() {
  // updates the number shown by movesElement.
  $(movesElem).html(clicks.length);
  return clicks.length;
}


function updateStars(){
  if (clicks.length <= 16) {
    stars = 3;
    $(".stars li:nth-child(3)").show();
    $(".stars li:nth-child(2)").show();
    $(".stars li:nth-child(3)").show();
  }
  else if (clicks.length <= 20) {
    stars = 2;
    $(".stars li:nth-child(3)").hide();
  }
  else {
    stars = 1;
    $(".stars li:nth-child(3)").hide();
    $(".stars li:nth-child(2)").hide();
  }
}

function countTime(){
  var now = new Date().getTime();
  var difference = now - startTime + previousTime;
  var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((difference % (1000 * 60)) / 1000);
  return [difference, minutes, seconds];
}

var time = countTime();

function startTimer() {
  startTime = new Date().getTime();
  timer = setInterval(function() {
    time = countTime();
    $(".timer").text(time[1] + ":" + ("0" + time[2]).slice(-2));
  }, 1000);
}

function getTime() {
  time = countTime();
  previousTime=time[0];
  var text = time[1] + ":" + ("0" + time[2]).slice(-2);
  $(".time").text(text);
  // console.log("time", time);
  // return time.slice(1,2)+ ":" + time.slice(2);
  return text;
}

function stopTimer() {
  clearInterval(timer);
}

function resetTimer() {
  previousTime = 0;
  clearInterval(timer);
  $(".timer").text("0:00");
}

/*

 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 $(document).ready(function() {
   console.log($(".moves"));
   movesElem = $(".moves")[0];
   // When the user clicks on (x), close the modal
   $(".close").on("click", function() {
     $(".modal").css("display", "none");
   });
   // When the user clicks on Click to play again, close the modal and restart the game
   $("#play-again-button").on("click", function() {
     restartGame();
   });
   $("#restart").on("click", function() {
     restartGame();
   });
   renderDeck(deck);
   // startTimer();
});
