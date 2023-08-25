// Create the main game loop and a module for DOM interaction.
// At this point it is appropriate to begin crafting your User Interface.
// The game loop should set up a new game by creating Players and Gameboards.
// For now just populate each Gameboard with predetermined coordinates.
// You can implement a system for allowing players to place their ships later.
// We’ll leave the HTML implementation up to you for now, but you should display both the player’s
// boards and render them using information from the Gameboard class.
// You need methods to render the gameboards and to take user input for attacking.
// For attacks, let the user click on a coordinate in the enemy Gameboard.
// The game loop should step through the game turn by turn using only methods from other objects.
// If at any point you are tempted to write a new function inside the game loop,
//step back and figure out which class or module that function should belong to.
// Create conditions so that the game ends once one player’s ships have all been sunk.
// This function is appropriate for the Game module.


//MOST URGENT:
//move handling of events to DOMManagement
//after each shot, the computer shoots 2x more: 1x, 2x, 4x, 8x etc - ERROR TO BE FIXED
//removing event listeners after field has been clicked & shot made
//handle ending of game when all ships of a player are sunk

//finish basic game loop
//add random ship placement
//add manual ship placement
//put pointer cursor when on shootable field

let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function Ship(length = 1) {
  return {
    length,
    hits: 0,
    sunk: false,
    isSunk() {
      if (this.hits === this.length) {
        this.sunk = true;
      }
    },
    hit() {
      this.hits++;
      this.isSunk();
    },
  };
}

function Gameboard(player = null, visible = true) {
  function createEmptyBoard() {
    let boardFields = [];
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < 10; j++) {
        boardFields.push({
          X: letters[j],
          Y: i,
          ship: false,
          hit: false,
          blocked: false
        });
      }
    }
    return boardFields;
  }

  return {
    player,
    visible,
    fields: createEmptyBoard(),
    gameOver: false,
    addShip(...args) {//ex. (["A", 1], ["B", 1])
      let newShip = Ship(args.length);
      let fieldsToFill = args
      //check if fields are blocked
      for (let i = 0; i < fieldsToFill.length; i++) {
        if (findField(fieldsToFill[i][0], fieldsToFill[i][1], this) === undefined) {
          throw "addShip - Invalid field"
        } else if (findField(fieldsToFill[i][0], fieldsToFill[i][1], this).blocked) {
          throw "addShip - Blocked field"
        }
      }

      for (let i = 0; i < this.fields.length; i++) {
        for (let j = 0; j < fieldsToFill.length; j++) {
          if ((this.fields[i].X === fieldsToFill[j][0]) && (this.fields[i].Y === fieldsToFill[j][1])) {
            this.fields[i].ship = newShip
            this.fields[i].blocked = true
            let currentX = this.fields[i].X
            let currentY = this.fields[i].Y

            let board = this

            function blockSurroundingFields(Xmodifier, Ymodifier) {
              let XtoBeBlocked = letters[letters.findIndex(e => e === currentX) + Xmodifier]
              if (XtoBeBlocked) {
                let YtoBeBlocked = currentY + Ymodifier

                if ((YtoBeBlocked < 11) && (YtoBeBlocked > 0)) {
                  findField(XtoBeBlocked, YtoBeBlocked, board).blocked = true
                }
              }
            }

            blockSurroundingFields(-1, -1)
            blockSurroundingFields(-1, 0)
            blockSurroundingFields(-1, 1)

            blockSurroundingFields(0, -1)
            blockSurroundingFields(0, 1)

            blockSurroundingFields(1, -1)
            blockSurroundingFields(1, 0)
            blockSurroundingFields(1, 1)

            fieldsToFill.splice(i, 1)
            break
          }
        }
      }
    },
    placeShipRandomly(size) {

      let attemptedStarterFields = []
      let board = this

      function attemptPlacing() {
        let coordsToFill = []

        //let randomField = this.fields[Math.floor(Math.random()*this.fields.length)]
        coordsToFill.push([randomField.X, randomField.Y])

        let nearbyFields = []

        let Xup = letters[letters.findIndex(e => e === randomField.X) + 1]
        let Xdown = letters[letters.findIndex(e => e === randomField.X) - 1]
        let Yup = randomField.Y + 1
        let Ydown = randomField.Y - 1
        //also check if the field is not blocked before pushing
        if (letters.includes(Xup)) {
          nearbyFields.push([Xup, randomField.Y])
        }
        if (letters.includes(Xdown)) {
          nearbyFields.push([Xdown, randomField.Y])
        }
        if (Yup < 10) {
          nearbyFields.push([randomField.X, Yup])
        }
        if (Ydown > 0) {
          nearbyFields.push([randomField.X, Ydown])
        }
        //pick random nearbyField to add to coordsToFill
        //continue the same path, up or down for X or Y
        //for as long as size requires
        //recursion?
        //if nearbyFields are empty for particular field, retry on a different one
        //keep track of checked combinations?
        //if none is possible - retry whole function
        //if too many retries fail (81) = throw error

        //place ships //ex. addShip(["A", 1], ["B", 1])

      }
      attemptPlacing()

    },
    receiveAttack(targetX, targetY) {
      let attackedField = findField(targetX, targetY, this)
      console.log(targetX, targetY, this)
      if (attackedField.ship) {
        attackedField.ship.hit()
      }
      attackedField.hit = true
      if (this.gameOverCheck()) {
        this.gameOver = true
      }
    },
    gameOverCheck() {
      let unsunkShips = []
      for (let field in this.fields) {
        if (this.fields[field].ship) {
          if (!this.fields[field].ship.sunk) {
            unsunkShips.push(this.fields[field].ship)
          }
        }
      }
      if (unsunkShips.length < 1) {
        return true
      } else {
        return false
      }

    },
    checkFieldHitStatus(X, Y) {
      if (findField(X, Y, this).hit) {
        return true
      } else {
        return false
      }
    }
  };
}


function findField(coordX, coordY, board) {
  return board.fields.find(e => (e.X == coordX) && (e.Y == coordY))
}

function Player(type = 'human', designation = null) {//later add intelligent target picking, i.e. try to find rest of fields taken by already hit ship
  return {
    type,
    designation,
    attackBoard(board, X, Y) {
      if (!findField(X, Y, board).hit) {
        board.receiveAttack(X, Y)
      }
      else {
        return false
      }
    },
    randomAttack(board) {
      console.log('random attack performed once')
      let fieldsNotAttackedYet = board.fields.filter(f => f.hit === false)
      if (fieldsNotAttackedYet.length !== 0) {
        let target = fieldsNotAttackedYet[Math.floor(Math.random() * fieldsNotAttackedYet.length)]
        this.attackBoard(board, target.X, target.Y)
      } else {
        return
      }
    }

  }

}


const DOMManagement = (() => {
  const computerPlayButton = document.getElementById('computer-play-button')
  computerPlayButton.addEventListener('click', () => {
    displayBoard('player-one-area', 'playerOneBoard')
    displayBoard('player-two-area', 'playerTwoBoard')
    document.getElementById('centered-button-container').remove()
    game.startGame()
  })

  function displayBoard(parent, boardName) {
    let boardHeading = document.createElement('h3')
    boardHeading.innerText = (boardName === 'playerOneBoard') ? 'Player' : 'Opponent'
    document.getElementById(parent).appendChild(boardHeading)


    const boardContainer = document.createElement('div')
    // boardContainer.classList.add('container')
    boardContainer.classList.add('board-container')
    boardContainer.setAttribute('id', boardName)
    document.getElementById(parent).appendChild(boardContainer)
    let coordY = 1
    let coordX = letters[0]

    for (let k = 0; k < 100; k++, coordY++) {
      const newField = document.createElement('div')
      newField.classList.add('board-field')
      if (coordY > 10) {
        coordY = 1
        coordX = letters[letters.findIndex(e => e === coordX) + 1]
      }
      let playerCoord = (boardName === 'playerOneBoard') ? 'O' : 'T' //O - player One; T - player Two
      let coordinates = playerCoord + coordX + coordY
      newField.setAttribute('id', coordinates)


      boardContainer.appendChild(newField)
    }



  }

  function updateBoardDisplay(board) {//board would be O or T and based on that display ships (for now)
    let playerCoord = (board.player.designation === "O") ? "O" : "T"
    let boardID = (playerCoord === "O") ? "playerOneBoard" : "playerTwoBoard"
    let displayedBoard = document.getElementById(boardID)

    displayedBoard.classList.add("cought")

    board.fields.forEach((f) => {
      let fieldInDOM = document.getElementById(playerCoord + f.X + f.Y)
      if (f.ship && board.visible) {
        fieldInDOM.classList.add("visible-ship")
      }
      if (f.hit){
        fieldInDOM.classList.add("hit-field")
        if (f.ship){
          fieldInDOM.classList.add("hit-ship")
        }
      }
    })

    //id="playerTwoBoard"
    //DO THIS NEXT

  }

  function handleFieldClick(clickedField, targetedBoard, attacker){
    let targetedX = clickedField.id[1]



    //if the id has a 4th value, concatenate it to 3rd, otherwise just use 3rd value of id as Y
    let targetedY = (clickedField.id[3] ? clickedField.id[2].concat(clickedField.id[3]) : clickedField.id[2])
    attacker.attackBoard(targetedBoard, targetedX, targetedY)
  }

  return {
    updateBoardDisplay, handleFieldClick
  };
})();

//Create boards for both players
//randomly put correct number of ships on board
//they cannot touch

//!!! fields around sunk ship should count as hit

//players take turns

//wiktory

const game = (() => {
  let currentPlayer = null

  function startGame() {
    let playerOne = Player('human', 'O')
    let playerTwo = Player('computer', 'T')

    let boardPlayerOne = Gameboard(playerOne)
    boardPlayerOne.addShip(['A', 1])
    boardPlayerOne.addShip(['B', 8])
    let boardPlayerTwo = Gameboard(playerTwo, false)//second argument is visibility
    boardPlayerTwo.addShip(['J', 10])



    DOMManagement.updateBoardDisplay(boardPlayerOne)
    DOMManagement.updateBoardDisplay(boardPlayerTwo)

    
    
    function makeMove(player){
      if (player.type === 'human'){
        let targetedBoardDOM = document.getElementById("playerTwoBoard")//fix in case of two humans
        let targetedBoard = boardPlayerTwo


  //transfer adding event listeners to DOMManagement
  //the entire reaction to the click needs to be a single function to be able to
  //easily remove the event listener afterwards
        for (let a = 0; a < targetedBoardDOM.children.length; a++){
          targetedBoardDOM.children[a].addEventListener('click', ()=>{
            
            if (!targetedBoardDOM.children[a].classList.contains('hit-field')){
              DOMManagement.handleFieldClick(targetedBoardDOM.children[a], targetedBoard, player)
            }

            DOMManagement.updateBoardDisplay(boardPlayerOne)
            DOMManagement.updateBoardDisplay(boardPlayerTwo)
            //remove the eventListeners!
            currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne
            makeMove(currentPlayer)
          })

        }
      } else if (player.type === 'computer'){
        //let targetedBoardDOM = document.getElementById("playerOneBoard")//fix in case of two humans
        let targetedBoard = boardPlayerOne
        player.randomAttack(targetedBoard)



        //extract the below into a function
        DOMManagement.updateBoardDisplay(boardPlayerOne)
        DOMManagement.updateBoardDisplay(boardPlayerTwo)
        currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne
        makeMove(currentPlayer)
        //finish this


      }



      //stop making moves if game has ended

    }

    currentPlayer = playerOne
    makeMove(currentPlayer)
  }




  return {
    startGame
  };
})();


module.exports = { Ship, Gameboard, findField, Player, game };
