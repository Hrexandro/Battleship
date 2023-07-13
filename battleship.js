// Create Gameboard factory.

// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or
// not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

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
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let boardFields = [];
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < 10; j++) {
        boardFields.push({
          X: letters[j],
          Y: i,
          ship: false,
          hit: false,
        });
      }
    }
    return boardFields;
  }

  return {
    fields: createEmptyBoard(),
    addShip(... args) {
      let newShip = Ship(args.length);
      let fieldsToFill = args

      for (let i = 0; i < this.fields.length; i++){
        for (let j = 0; j < fieldsToFill.length; j++){
          if ((this.fields[i].X === fieldsToFill[j][0]) && (this.fields[i].Y === fieldsToFill[j][1])){
            this.fields[i].ship = newShip
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
    }
  };
}


function findField(coordX, coordY, board){
  return board.fields.find(e=>(e.X === coordX) &&(e.Y === coordY))
}


module.exports = { Ship, Gameboard, findField };
