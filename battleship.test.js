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
  expect(newBoard.fields.find(e => (e.X === newShipCoords[0]) &&(e.Y === newShipCoords[1])).ship).toBeTruthy()

});

test("add ship two mast ship", () => {
  let newBoard = battleship.Gameboard();
  let newShipCoords = [
    ["A", 1],
    ["B", 1]
  ];
  newBoard.addShip(newShipCoords[0], newShipCoords[1]);
  expect(newBoard.fields.find(e => (e.X === newShipCoords[0][0]) &&(e.Y === newShipCoords[0][1])).ship).toBeTruthy()

});




test("receive attack function - sinking of one mast ship", ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1]);
  expect(newBoard.fields.find(e => (e.X === "A") && (e.Y === 1)).ship.sunk).toBe(false)
  newBoard.receiveAttack("A", 1)
  expect(newBoard.fields.find(e => (e.X === "A") && (e.Y === 1)).ship.sunk).toBe(true)
})

test("receive attack function - sinking of two mast ship", ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.addShip(["A", 1], ["B", 1]);
  newBoard.receiveAttack("A", 1)
  newBoard.receiveAttack("B", 1)
  expect(newBoard.fields.find(e => (e.X === "A") && (e.Y === 1)).ship.sunk).toBe(true)
})


test("receive attack function - marking hit field", ()=>{
  let newBoard = battleship.Gameboard();
  newBoard.receiveAttack("A", 1)
  expect(newBoard.fields.find(e => (e.X === "A") && (e.Y === 1)).ship).toBe(false)
  expect(newBoard.fields.find(e => (e.X === "A") && (e.Y === 1)).hit).toBe(true)
})

//switch the finds to a function

// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or
// not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.

// Gameboards should keep track of missed attacks so they can display them properly.

// Gameboards should be able to report whether or not all of their ships have been sunk.
