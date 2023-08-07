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
// If at any point you are tempted to write a new function inside the game loop, step back and figure out which class or module that function should belong to.
// Create conditions so that the game ends once one player’s ships have all been sunk.
// This function is appropriate for the Game module.

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

function Gameboard() {
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
    fields: createEmptyBoard(),
    gameOver: false,
    addShip(...args) {//ex. (["A", 1], ["B", 1])
      let newShip = Ship(args.length);
      let fieldsToFill = args

      //check if fields are blocked
      for (let i = 0; i < fieldsToFill.length; i++) {
        if (findField(fieldsToFill[i][0], fieldsToFill[i][1], this).blocked) {
          throw "addShip - Invalid field"
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
  return board.fields.find(e => (e.X === coordX) && (e.Y === coordY))
}

function Player(type = "human") {//later add intelligent target picking, i.e. try to find rest of fields taken by already hit ship
  return {
    type,
    attackBoard(board, X, Y) {
      if (!findField(X, Y, board).hit) {
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
//Create boards for both players
//randomly put correct number of ships on board
//they cannot touch

//!!! fields around sunk ship should count as hit

//players take turns

//wiktory

const game = (() => {
  //let boardPlayerOne = Gameboard.createEmptyBoard()


  return {
    //boardPlayerOne
  };
})();


const DOMManagement = (() => {
  const computerPlayButton = document.getElementById('computer-play-button')
  computerPlayButton.addEventListener('click', () => {
    displayBoard('player-one-area', 'playerOneBoard')
    displayBoard('player-two-area', 'playerTwoBoard')
    document.getElementById('centered-button-container').remove()
  })

  function displayBoard(parent, boardName) {
    let boardHeading = document.createElement('h3')
    boardHeading.innerText = (boardName === 'playerOneBoard') ? 'Player One' : 'Player Two'
    document.getElementById(parent).appendChild(boardHeading)


    const boardContainer = document.createElement('div')
    // boardContainer.classList.add('container')
    boardContainer.classList.add('board-container')
    boardContainer.setAttribute('id', boardName)
    document.getElementById(parent).appendChild(boardContainer)

    for (let k = 0; k < 100; k++){
       const newField = document.createElement('div')
       newField.classList.add('board-field')
       boardContainer.appendChild(newField)
    }

    // for (let i = 0; i < 10; i++) {
    //   const newRow = document.createElement('div')
    //   newRow.classList.add('row')
    //   boardContainer.appendChild(newRow)
    //   for (let j = 0; j < 10; j++){
    //     const newColumn = document.createElement('div')
    //     newColumn.classList.add('board-field')
    //     newColumn.classList.add('col')

    //     newRow.appendChild(newColumn)
    //   }
    // }


  }


  return {

  };
})();

module.exports = { Ship, Gameboard, findField, Player, game };
