// Create Gameboard factory.

// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or
// not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
// Gameboards should keep track of missed attacks so they can display them properly.
// Gameboards should be able to report whether or not all of their ships have been sunk.

function compareArrays (arrayOne, arrayTwo){
  for (let i = 0; i <= arrayOne.length; i++){
    if (arrayOne[i] !== arrayTwo[i]){
      return false
    }
  }
  return true
}

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
          coordinates: [letters[j], i],
          ship: false,
          hit: false,
        });
      }
    }
    return boardFields;
  }

  return {
    fields: createEmptyBoard(),
    addShip(newShipLocation) {
      let newShip = Ship(newShipLocation.length);
      ////
        for (let i = 0, newCoordinatesUsed = 0; i < newShipLocation.length; i++){
          //console.log(this.fields[i].coordinates)
          console.log(j)
          if (compareArrays(this.fields[i].coordinates, newShipCoordinates /* can be up to 4!, make another loop?*/)){

          }
            //field with location the same as newShipLocation
            //assign newShip to its ship parameter
        }
      ////
    },
  };
}

module.exports = { Ship, Gameboard, compareArrays };
