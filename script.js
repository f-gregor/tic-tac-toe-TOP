const gameManager = (() => {
    const messageDialog = document.querySelector(".main>dialog");
    const settingsDialog = document.querySelector(".header>dialog");

    const displayManager = (() => {
        const header = document.querySelector(".header");
        const message = document.querySelector(".message");

        const displayMove = (attribute) => {
            const targetTile = document.querySelector((".data-attribute-" + String(attribute)));
            targetTile.textContent = currentPlayer.getMarker();
            targetTile.classList.add(currentPlayer.getId());
        }

        const updateScore = () => {
            header.querySelector(".player-one>.score").textContent = player1.getScore();
            header.querySelector(".player-two>.score").textContent = player2.getScore();
        }

        const clearBoard = () => {
            document.querySelectorAll(".tile").forEach((tile) => {
                tile.textContent = "";
                tile.classList.remove("player-one");
                tile.classList.remove("player-two");
            });
        }

        const updatePlayerLabel = () => {
            const span = document.querySelector("span");
            span.classList.remove("player-two");
            span.classList.remove("player-one");
            span.classList.add(currentPlayer.getId());
            span.textContent = currentPlayer.getPlayerName();
        }

        const updatePlayerNames = () => {
            header.querySelector(".player-one>.name").textContent = player1.getPlayerName();
            header.querySelector(".player-two>.name").textContent = player2.getPlayerName();
            document.querySelector("span").textContent = currentPlayer.getPlayerName();
        }

        const showEndOfRoundMessage = (roundResult) => {
            if (roundResult === 'draw') {
                message.innerHTML = "The round ended in a draw.";
            } else {
                message.innerHTML = "<span class=" + currentPlayer.getId() + 
                                    ">" + currentPlayer.getPlayerName() + "</span> won the round!";
            }

            messageDialog.showModal();
        }

        return {displayMove, updateScore, clearBoard, updatePlayerLabel, showEndOfRoundMessage, updatePlayerNames};

    })();

    function createPlayer(id, initialName, marker) {
        let displayName = initialName;
        let score = 0;
    
        const setPlayerName = (newName) => displayName = newName;
        const getPlayerName =() => displayName;
        const getMarker = () => marker;
        const incrementScore = () => score++;
        const getScore = () => score;
        const getId = () => id;
        const resetScore = () => score = 0;
    
        return {setPlayerName, getPlayerName, getMarker, incrementScore, getScore, getId, resetScore};
    }

    const player1 = createPlayer("player-one", "Player One", "X");
    const player2 = createPlayer("player-two", "Player Two", "O");

    let gameboard = [];
    let currentPlayer = player1;

    const winningMove = () => {
        for(let i = 0; i < 3; i++) {
            if(gameboard[0+i] === currentPlayer.getMarker() &&
               gameboard[3+i] === currentPlayer.getMarker() &&
               gameboard[6+i] === currentPlayer.getMarker())
               return true;
        };

        for(let i = 0; i < 3; i++) {
            if(gameboard[3*i+0] === currentPlayer.getMarker() &&
               gameboard[3*i+1] === currentPlayer.getMarker() &&
               gameboard[3*i+2] === currentPlayer.getMarker())
               return true;
        };

        if(gameboard[0] === currentPlayer.getMarker() &&
           gameboard[4] === currentPlayer.getMarker() &&
           gameboard[8] === currentPlayer.getMarker()) 
           return true;

        if(gameboard[2] === currentPlayer.getMarker() &&
           gameboard[4] === currentPlayer.getMarker() &&
           gameboard[6] === currentPlayer.getMarker())
           return true;

        return false;
    }

    const boardIsFull = () => {
        for(let i = 0;i<9;i++) {
            if (gameboard[i] === undefined) return false;
        }
        return true;
    }

    const isValidMove = (index) => {
        return (gameboard[index] === undefined);
    }

    const makeMove = (index) => {
        if (!isValidMove(index)) return;

        gameboard[index] = currentPlayer.getMarker();
        displayManager.displayMove(index + 1);

        if (winningMove()){
            displayManager.showEndOfRoundMessage('win');
            currentPlayer.incrementScore();
            displayManager.updateScore();
        }

        switchCurrentPlayer();
        
        if (boardIsFull()) displayManager.showEndOfRoundMessage('draw');
    }

    const switchCurrentPlayer = () => {
        (currentPlayer === player1) ? currentPlayer = player2 : currentPlayer = player1;
        displayManager.updatePlayerLabel();
    }

    const resetBoard = () => {
        gameboard = [];
        displayManager.clearBoard();
    }

    const run = () => {
        tiles = document.querySelectorAll(".tile");

        tiles.forEach((tile) => {
            tile.addEventListener('click', (event) => {
                const targetIndex = event.target.classList[1].split("-")[2] - 1;
                makeMove(Number(targetIndex));
            })
        });

        document.querySelector("button.restart").addEventListener('click', () => {
            player1.resetScore();
            player2.resetScore();
            currentPlayer = player1;

            displayManager.updateScore();
            displayManager.updatePlayerLabel();
            displayManager.clearBoard();
        });

        messageDialog.addEventListener('close', () => {
            resetBoard();
        })

        document.querySelector(".settings").addEventListener('click', (event) => {
            event.preventDefault();
            settingsDialog.showModal();
        });

        document.querySelector(".header > dialog button:nth-of-type(2)").addEventListener('click', (event) => {
            event.preventDefault();
            settingsDialog.close();
        })

        document.querySelector(".header form").addEventListener('submit', (event) => {
            const formData = new FormData(event.target);

            player1.setPlayerName(formData.get('player1-name'));
            player2.setPlayerName(formData.get('player2-name'));

            document.querySelector(":root").style.setProperty("--player-one-color", formData.get("player1-color"))
            document.querySelector(":root").style.setProperty("--player-two-color", formData.get("player2-color"))
            
            displayManager.updatePlayerNames();
        });
    }

    return {run};

})();

gameManager.run();