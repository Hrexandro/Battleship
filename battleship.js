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


//add random ship placement - placeShipRandomly do this
//add manual ship placement
//put pointer cursor when on shootable field



//CURRENT ISSUES

//sometimes one field fom the random placement does not have a ship placed in it
//in both the display and the code; happens generally on the side of the board

//somethimes there is an error, because nextField and nearbyFields are empty for some reason

let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

//to delete after finishing random placement
let testRandomlyFilledBoard = null
let verifiedBoardState = null

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
      console.log("args are")
      console.log(args)
      console.log(...args)
      let newShip = Ship(args.length);
      let fieldsToFill = args
      console.log("fields to fill are")
      console.log(fieldsToFill)
      //check if fields are blocked
      for (let i = 0; i < fieldsToFill.length; i++) {
        if (findField(fieldsToFill[i][0], fieldsToFill[i][1], this) === undefined) {
          throw "addShip - Invalid field"
        } else if (!this.verifyIfFieldIsNotBlocked(fieldsToFill[i][0], fieldsToFill[i][1])) {
          console.log("the field is:")
          console.log (fieldsToFill[i][0], fieldsToFill[i][1])
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
    verifyIfFieldIsNotBlocked(Xcoord, Ycoord) {
      return !findField(Xcoord, Ycoord, this).blocked
    },
    placeShipRandomly(size) {

      let attemptedStarterFields = []//check this as well
      let board = this

      let coordsToFill = []//starting point of the ship we are about to place
      let direction = null


      function attemptPlacing(currentField) {


        function checkFieldAdditionSuitability(checkedField){//checkedField should be array of [X, Y]
          if (letters.includes(checkedField[0])){
            console.log("valid letter (X)")
            console.log(checkedField[0])
            if ((checkedField[1] < 10) && (checkedField[1] > 0)){
              console.log("valid number (Y)")
              console.log(checkedField[1])
              if (board.verifyIfFieldIsNotBlocked(checkedField[0], checkedField[1])){
                console.log("is not blocked")
                if (!coordsToFill.find(e => (e[0] === checkedField[0]) && (e[1] === checkedField[1]))){
                  console.log("has not already been added to fill")
                  return checkedField

                  //nearbyFields.push(checkedField)
                }
              }
            }
          } else {
            return false
          }

        }

        function findNewRandomField(){//to roll recursively, in case the field was already tried
          let returnedField = board.fields[Math.floor(Math.random() * board.fields.length)]
          if (!attemptedStarterFields.find(e => (e[0] == returnedField.X) && (e[1] == returnedField.Y))){
            console.log('should return current randomField')
            return returnedField
          } else {
            return findNewRandomField()
          }

        }

        function recursivelyRandomlyFindSuitableField(){
          let currentlyChecked = findNewRandomField()
          if (checkFieldAdditionSuitability([currentlyChecked.X, currentlyChecked.Y])){
            console.log("recursivelyRandomlyFindSuitableField is returning")
            console.log(currentlyChecked)
            return currentlyChecked
          } else {
            return recursivelyRandomlyFindSuitableField()
          }
        }


        console.log(currentField)
        if (coordsToFill.length >= size) {
          return
        }
        if (!currentField) {
          //!!!!
          //for test purposes we are starting at the problematic border area
          currentField = findField("F", 1, board)
          //currentField = recursivelyRandomlyFindSuitableField()
          console.log("!!!!!")
          console.log(currentField)
        }



        //console.log(currentField)

        if (coordsToFill.length < 1) {
          //if this is the first field, mark it as one of the attempted beginnings
          attemptedStarterFields.push(currentField.X.concat(currentField.Y))
        }

        coordsToFill.push([currentField.X, currentField.Y])

        let nearbyFields = []

        let Xup = letters[letters.findIndex(e => e === currentField.X) + 1]
        let Xdown = letters[letters.findIndex(e => e === currentField.X) - 1]
        let Yup = currentField.Y + 1
        let Ydown = currentField.Y - 1


        function addToNearbyFieldsIfSuitable(fieldToCheckAndAdd){
          console.log("addToNearbyFieldsIfSuitable is checking")
          console.log(fieldToCheckAndAdd)
          if (checkFieldAdditionSuitability(fieldToCheckAndAdd)){
            nearbyFields.push(fieldToCheckAndAdd)
          }
        }

        console.log([Xup, currentField.Y, "down"])
        addToNearbyFieldsIfSuitable([Xdown, currentField.Y, "up"])
        console.log([Xdown, currentField.Y, "up"])
        addToNearbyFieldsIfSuitable([Xdown, currentField.Y, "up"])
        console.log([Xdown, currentField.Y, "up"])
        addToNearbyFieldsIfSuitable([currentField.X, Yup, "right"])
        console.log([currentField.X, Ydown, "left"])
        addToNearbyFieldsIfSuitable([currentField.X, Ydown, "left"])



        //TEMPORARY, change to directional later
        let nextField = nearbyFields[Math.floor(Math.random() * nearbyFields.length)]
        console.log("next field, then nearbyFields logged below")
        console.log(nextField)
        console.log(nearbyFields)
        console.log(findField(nearbyFields[0], nearbyFields[1], board))


        //check if something horribly wrong has happened - nextField is empty yet here we are
        if (!nextField){
          console.log("restarting due to something going horribly wrong")
          coordsToFill = []
          nearbyFields = []
          attemptPlacing()
        } else {
          attemptPlacing(findField(nextField[0], nextField[1], board))
          //coordsToFill.push(nextField)
          //console.log(coordsToFill)
          if (!direction) {
            direction = nextField[3]
          }
          if (direction === "up") {
  
            //continue with this
          }
          //console.log(direction)
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
      //take the coords from coordstofill
      console.log("final coordsToFill")
      console.log(coordsToFill)//one of the fields is lost between those, it is here, but not inside addShip
      console.log(...coordsToFill)
      board.addShip(...coordsToFill)//make correct coordinates

    },
    receiveAttack(targetX, targetY) {
      let attackedField = findField(targetX, targetY, this)
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
        let explosion = new Audio("explosion.mp3");
        explosion.play();
        board.receiveAttack(X, Y)
      }
      else {
        return false
      }
    },
    randomAttack(board) {
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
  console.log(computerPlayButton)
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
      if (f.hit) {
        fieldInDOM.classList.add("hit-field")
        if (f.ship) {
          fieldInDOM.classList.add("hit-ship")
        }
      }
    })

  }

  function handleFieldClick(clickedField, targetedBoard, attacker) {
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
    boardPlayerOne.placeShipRandomly(6)
    verifiedBoardState = boardPlayerOne

    testRandomlyFilledBoard = boardPlayerOne
    //boardPlayerOne.addShip(['B', 8])
    let boardPlayerTwo = Gameboard(playerTwo, false)//second argument is visibility
    boardPlayerTwo.addShip(['J', 10])



    DOMManagement.updateBoardDisplay(boardPlayerOne)
    DOMManagement.updateBoardDisplay(boardPlayerTwo)



    function makeMove(player) {
      function removeListenersFromBoard(clearedBoard) {
        for (let b = 0; b < clearedBoard.children.length; b++) {
          clearedBoard.children[b].removeEventListener('click', fieldClickEvent)
        }
      }
      function handleGameOver() {
        removeListenersFromBoard(document.getElementById('playerTwoBoard'))
        removeListenersFromBoard(document.getElementById('playerOneBoard'))
        console.log(`game over, player ${currentPlayer.designation} won`)
      }

      if (player.type === 'human') {
        let targetedBoardDOM = document.getElementById("playerTwoBoard")//fix in case of two humans
        let targetedBoard = boardPlayerTwo

        function fieldClickEvent(event) {
          if (!event.target.classList.contains('hit-field')) {
            DOMManagement.handleFieldClick(event.target, targetedBoard, player)
            DOMManagement.updateBoardDisplay(boardPlayerOne)
            DOMManagement.updateBoardDisplay(boardPlayerTwo)
            removeListenersFromBoard(document.getElementById('playerTwoBoard'))
            removeListenersFromBoard(document.getElementById('playerOneBoard'))

            if (targetedBoard.gameOver) {
              handleGameOver(targetedBoardDOM)
            } else {
              currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne
              setTimeout(makeMove, 500, currentPlayer);
            }
          }
        }

        for (let a = 0; a < targetedBoardDOM.children.length; a++) {
          targetedBoardDOM.children[a].addEventListener('click', fieldClickEvent)
        }


      } else if (player.type === 'computer') {

        //let targetedBoardDOM = document.getElementById("playerOneBoard")//fix in case of two humans
        let targetedBoard = boardPlayerOne


        player.randomAttack(targetedBoard)


        //extract the below into a function
        DOMManagement.updateBoardDisplay(boardPlayerOne)
        DOMManagement.updateBoardDisplay(boardPlayerTwo)
        console.log(targetedBoard)
        if (targetedBoard.gameOver) {
          handleGameOver()
        } else {
          console.log('not game over choice')
          currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne
          makeMove(currentPlayer)
        }
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
