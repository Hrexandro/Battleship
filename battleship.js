// Create Player.
// Players can take turns playing the game by attacking the enemy Gameboard.
// The game is played against the computer, so make the ‘computer’ 
// capable of making random plays. The AI does not have to be smart, 
// but it should know whether or not a given move is legal. 
// (i.e. it shouldn’t shoot the same coordinate twice).

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
    //let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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
    gameOver: false,
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

// Create Player.
// Players can take turns playing the game by attacking the enemy Gameboard.
// The game is played against the computer, so make the ‘computer’ 
// capable of making random plays. The AI does not have to be smart, 
// but it should know whether or not a given move is legal. 
// (i.e. it shouldn’t shoot the same coordinate twice).

function Player(type = "human"){
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
    //rewrite random attack because it's going to be inefficient if most fields already have been hit
    //solution: make a list of fields that have not been attacked yet
    //then attack random one of these fields
    randomAttack(board){
      let attackDone = false
      while (!attackDone){
        let XTarget = letters[Math.floor(Math.random() * 10)]
        let YTarget = Math.floor(Math.random() * 10) + 1
        if (!board.checkFieldHitStatus(XTarget, YTarget)){
          this.attackBoard(board, XTarget, YTarget)
          attackDone = true
        }
      }
      
    }
  }

}
module.exports = { Ship, Gameboard, findField, Player };
