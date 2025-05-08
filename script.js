document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const movesCount = document.getElementById('moves-count');
    const timeValue = document.getElementById('time');
    const restartButton = document.getElementById('restart');
    
    let cards;
    let interval;
    let firstCard = false;
    let secondCard = false;
    let moves = 0;
    let seconds = 0;
    let minutes = 0;
    let firstCardValue;
    let secondCardValue;
    
    // Items array
    const items = [
        '🍎', '🍌', '🍒', '🍓', 
        '🍐', '🍊', '🍋', '🥭'
    ];
    
    // Timer
    const timeGenerator = () => {
        seconds += 1;
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        
        // Format time before displaying
        let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
        let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
        timeValue.innerHTML = `${minutesValue}:${secondsValue}`;
    };
    
    // Calculate moves
    const movesCounter = () => {
        moves++;
        movesCount.innerHTML = moves;
    };
    
    // Pick random objects from the items array
    const generateRandom = (size = 4) => {
        // Temporary array
        let tempArray = [...items];
        // Initialize cardValues array
        let cardValues = [];
        // Size should be double (4*4 matrix)/2 since pairs of objects would exist
        size = (size * size) / 2;
        // Random object selection
        for (let i = 0; i < size; i++) {
            const randomIndex = Math.floor(Math.random() * tempArray.length);
            cardValues.push(tempArray[randomIndex]);
            // Once selected, remove the object from temp array
            tempArray.splice(randomIndex, 1);
        }
        return cardValues;
    };
    
    const matrixGenerator = (cardValues, size = 4) => {
        gameContainer.innerHTML = "";
        cardValues = [...cardValues, ...cardValues];
        // Simple shuffle
        cardValues.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < size * size; i++) {
            gameContainer.innerHTML += `
                <div class="card" data-card-value="${cardValues[i]}">
                    <div class="card-back"></div>
                    <div class="card-front">${cardValues[i]}</div>
                </div>
            `;
        }
        
        // Grid
        gameContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        // Cards
        cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.addEventListener("click", () => {
                // If selected card is not matched yet then only run (i.e., the card is still on the game board)
                if (!card.classList.contains("matched") && !card.classList.contains("card-flipped")) {
                    // Flip the clicked card
                    card.classList.add("card-flipped");
                    // If it's the first card (!firstCard since firstCard is initially false)
                    if (!firstCard) {
                        // Current card becomes firstCard
                        firstCard = card;
                        // Current card's value becomes firstCardValue
                        firstCardValue = card.getAttribute("data-card-value");
                    } else {
                        // Increment moves since user selected second card
                        movesCounter();
                        // Current card becomes secondCard
                        secondCard = card;
                        // Current card's value becomes secondCardValue
                        secondCardValue = card.getAttribute("data-card-value");
                        
                        // If both cards match
                        if (firstCardValue === secondCardValue) {
                            // Add matched class so these cards would be ignored next time
                            firstCard.classList.add("matched");
                            secondCard.classList.add("matched");
                            // Set firstCard to false since next card would be first now
                            firstCard = false;
                            // Check if the game is over
                            if (document.querySelectorAll(".matched").length === cardValues.length) {
                                setTimeout(() => {
                                    // Stop the timer
                                    clearInterval(interval);
                                    alert(`You won! \nMoves: ${moves} \nTime: ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);
                                }, 1000);
                            }
                        } else {
                            // If cards don't match, flip them back
                            let [tempFirst, tempSecond] = [firstCard, secondCard];
                            firstCard = false;
                            secondCard = false;
                            
                            // Add disabled class to prevent further clicks during this time
                            gameContainer.classList.add("disabled");
                            
                            setTimeout(() => {
                                tempFirst.classList.remove("card-flipped");
                                tempSecond.classList.remove("card-flipped");
                                gameContainer.classList.remove("disabled");
                            }, 900);
                        }
                    }
                }
            });
        });
    };
    
    // Start game
    const initializer = () => {
        moves = 0;
        seconds = 0;
        minutes = 0;
        
        // Controls and buttons visibility
        movesCount.innerHTML = moves;
        timeValue.innerHTML = `00:00`;
        
        // Generate matrix of size 4x4
        let cardValues = generateRandom();
        matrixGenerator(cardValues);
        
        // Start timer
        clearInterval(interval);
        interval = setInterval(timeGenerator, 1000);
    };
    
    // Initialize game
    initializer();
    
    // Restart button
    restartButton.addEventListener('click', () => {
        cards.forEach((card) => {
            card.classList.remove("card-flipped");
            card.classList.remove("matched");
        });
        
        // Reset game
        firstCard = false;
        secondCard = false;
        initializer();
    });
}); 