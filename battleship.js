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
    addShip(... args) {
      let newShip = Ship(args.length);
      let fieldsToFill = args

      //check if fields are blocked
      for (let i = 0; i < fieldsToFill.length; i++){
        if (findField(fieldsToFill[i][0], fieldsToFill[i][1], this).blocked){
          throw "addShip - Invalid field"
        }
      }

      for (let i = 0; i < this.fields.length; i++){
        for (let j = 0; j < fieldsToFill.length; j++){
          if ((this.fields[i].X === fieldsToFill[j][0]) && (this.fields[i].Y === fieldsToFill[j][1])){
            this.fields[i].ship = newShip
            this.fields[i].blocked = true
            let currentX = this.fields[i].X
            let currentY = this.fields[i].Y

            let board = this

            function blockSurroundingFields(Xmodifier, Ymodifier){
              let XtoBeBlocked = letters[letters.findIndex(e => e === currentX) + Xmodifier]
              if (XtoBeBlocked){
                let YtoBeBlocked = currentY + Ymodifier
  
                if ((YtoBeBlocked < 11)&&(YtoBeBlocked > 0)){
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
    receiveAttack(targetX, targetY){
      let attackedField = findField(targetX, targetY, this)
      if (attackedField.ship){
        attackedField.ship.hit()
      }
      attackedField.hit = true
      if (this.gameOverCheck()){
        this.gameOver = true
      }
    },
    gameOverCheck(){
      let unsunkShips = []
      for (let field in this.fields){
        if (this.fields[field].ship){
          if (!this.fields[field].ship.sunk){
            unsunkShips.push(this.fields[field].ship)
          }
        }
      }
      if (unsunkShips.length < 1){
        return true
      } else {
        return false
      }
      
    },
    checkFieldHitStatus(X, Y){
      if (findField(X, Y, this).hit){
        return true
      } else {
        return false
      }
    }
  };
}


function findField(coordX, coordY, board){
  return board.fields.find(e => (e.X === coordX) && (e.Y === coordY))
}

function Player(type = "human"){//later add intelligent target picking, i.e. try to find rest of fields taken by already hit ship
  return {
    type,
    attackBoard(board, X, Y){
      if (!findField(X, Y, board).hit){
        board.receiveAttack(X, Y)
      }
      else {
        return false
      }
    },
    randomAttack(board){
      let fieldsNotAttackedYet = board.fields.filter(f => f.hit === false)
      if (fieldsNotAttackedYet.length !== 0){
        let target = fieldsNotAttackedYet[Math.floor(Math.random()*fieldsNotAttackedYet.length)]
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

module.exports = { Ship, Gameboard, findField, Player, game };
