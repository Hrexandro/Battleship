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


//should be able to place ships at specific coordinates by calling the ship factory function.
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

// Gameboards should be able to report whether or not all of their ships have been sunk.
//do this next

test('all ships have not been sunk', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)
  newBoard.receiveAttack("B", 1)
  expect(newBoard.gameOverCheck()).toBe(false)
  //expect(newBoard.gameOver).toBe(false)
})

test('all ships have been sunk', ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)
  newBoard.receiveAttack("B", 1)
  expect(newBoard.gameOverCheck()).toBe(true)
  //expect(newBoard.gameOver).toBe(true)
})