const battleship = require("./battleship.js");

test("Ship factory function", () => {
  let newShip = battleship.Ship();
  expect(newShip.length).toBe(1);
  expect(newShip.hits).toBe(0);
  expect(newShip.sunk).toBe(false);
});

test("Other length ship", () => {
  expect(battleship.Ship(4).length).toBe(4);
});

test("Working hit() method", () => {
  let newShip = battleship.Ship();
  newShip.hit();
  expect(newShip.hits).toBe(1);
  expect(newShip.sunk).toBe(true);
});

test("bigger ship survives one git", () => {
  let newShip = battleship.Ship(4);
  newShip.hit();
  expect(newShip.hits).toBe(1);
  expect(newShip.sunk).toBe(false);
});

test("imports the Gameboard", () => {
  expect(typeof battleship.Gameboard()).toEqual("object");
});


test("check coordinates", () => {
  let newBoard = battleship.Gameboard();
  expect(newBoard.fields[0].X).toEqual("A");
  expect(newBoard.fields[0].Y).toEqual(1);
  expect(newBoard.fields[newBoard.fields.length - 1].X).toEqual("J");
  expect(newBoard.fields[newBoard.fields.length - 1].Y).toEqual(10);
});


test("add ship one mast ship", () => {
  let newBoard = battleship.Gameboard();
  let newShipCoords = ["A", 1]
  newBoard.addShip(newShipCoords);
  expect(battleship.findField(newShipCoords[0], newShipCoords[1], newBoard).ship).toBeTruthy()

});

test("add ship two mast ship", () => {
  let newBoard = battleship.Gameboard();
  let newShipCoords = [
    ["A", 1],
    ["B", 1]
  ];
  newBoard.addShip(newShipCoords[0], newShipCoords[1]);
  expect(battleship.findField(newShipCoords[0][0], newShipCoords[0][1], newBoard).ship).toBeTruthy()

});




test("receive attack function - sinking of one mast ship", ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);
  expect(battleship.findField("A", 1, newBoard).ship.sunk).toBe(false)
  newBoard.receiveAttack("A", 1)
  expect(battleship.findField("A", 1, newBoard).ship.sunk).toBe(true)
})

test("receive attack function - sinking of two mast ship", ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)
  newBoard.receiveAttack("B", 1)
  expect(battleship.findField("A", 1, newBoard).ship.sunk).toBe(true)
})


test("receive attack function - marking hit field", ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.receiveAttack("A", 1)
  expect(battleship.findField("A", 1, newBoard).ship).toBe(false)
  expect(battleship.findField("A", 1, newBoard).hit).toBe(true)
})

test('all ships have not been sunk', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)
  expect(newBoard.gameOverCheck()).toBe(false)
  expect(newBoard.gameOver).toBe(false)
})

test('all ships have been sunk', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)
  newBoard.receiveAttack("B", 1)
  expect(newBoard.gameOverCheck()).toBe(true)
  expect(newBoard.gameOver).toBe(true)
})

test('checking field status on the gameboard',()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)

  expect(newBoard.checkFieldHitStatus("A", 1)).toBe(true)
  expect(newBoard.checkFieldHitStatus("B", 2)).toBe(false)
  expect(newBoard.checkFieldHitStatus("A", 2)).toBe(false)

  
})


test('human player attacks field', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);

  let humanPlayer = battleship.Player()

  humanPlayer.attackBoard(newBoard, "A", 1)

  expect(battleship.findField("A", 1, newBoard).hit).toBe(true)
  expect(newBoard.gameOverCheck()).toBe(true)
  expect(newBoard.gameOver).toBe(true)
})

test('attacking the same field twice is rejected', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);

  let humanPlayer = battleship.Player()

  humanPlayer.attackBoard(newBoard, "A", 1)

  expect(humanPlayer.attackBoard(newBoard, "A", 1)).toBe(false)
  expect(battleship.findField("A", 1, newBoard).hit).toBe(true)
})

test('computer player attacks a random field once', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);

  let computerPlayer = battleship.Player("computer")

  computerPlayer.randomAttack(newBoard)

  let attackedFields = []

  for (let field in newBoard.fields){
    if (newBoard.fields[field].hit){
      attackedFields.push(newBoard.fields[field])
    }
  }
  expect(attackedFields.length).toBe(1)
})

test('computer player 99 fields without repeating', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);

  let computerPlayer = battleship.Player("computer")
  for (let i = 1; i < 100; i++){
    computerPlayer.randomAttack(newBoard)
  }

  let attackedFields = []

  for (let field in newBoard.fields){
    if (newBoard.fields[field].hit){
      attackedFields.push(newBoard.fields[field])
    }
  }
  expect(attackedFields.length).toBe(99)
})

test('try attacking more then 100 fields', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);

  let computerPlayer = battleship.Player("computer")
  for (let i = 1; i <= 101; i++){
    computerPlayer.randomAttack(newBoard)
  }

  let attackedFields = []

  for (let field in newBoard.fields){
    if (newBoard.fields[field].hit){
      attackedFields.push(newBoard.fields[field])
    }
  }
  expect(attackedFields.length).toBe(100)
  expect(newBoard.gameOver).toBe(true)
})

test('fields surrounding ship are all blocked', ()=>{
  let newBoard = battleship.Gameboard();
  let newShipCoords = ["D", 4]
  newBoard.addShip(newShipCoords);

  let blockedFields = []

  newBoard.fields.forEach((field) =>{
    if (field.blocked){
      blockedFields.push(field.X + field.Y)
    }
  })
  expect(blockedFields.length).toBe(9)
  expect(blockedFields.includes("C3")).toBe(true)
  expect(blockedFields.includes("C4")).toBe(true)
  expect(blockedFields.includes("C5")).toBe(true)
  expect(blockedFields.includes("D3")).toBe(true)
  expect(blockedFields.includes("D4")).toBe(true)
  expect(blockedFields.includes("D5")).toBe(true)
  expect(blockedFields.includes("E3")).toBe(true)
  expect(blockedFields.includes("E4")).toBe(true)
  expect(blockedFields.includes("E5")).toBe(true)

})

test.only('placing ship on blocked field is not allowed', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["D", 4]);

  expect(()=>{newBoard.addShip(["D", 5])}).toThrowError("addShip - Invalid field")
})

test.skip('correct number of ships is placed on board', ()=>{
  let boardPlayerOne = battleship.game.createBoardPlayerOne()
  let boardPlayerTwo = battleship.game.createBoardPlayerOne()

  function checkNumberOfShipsOfParticularSize(board, size){
    let shipsFound = []
    // iterate through board.fields, if field has ship of size
    //give it an ordinal, so that you can avoid duplicates, and add to ships found 
    //then return length

  }
  //use this function for all required ship sizes

})


