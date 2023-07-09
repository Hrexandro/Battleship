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

//to test Gameboard
//should be a board of coordinates

test("check coordinates", () => {
  let newBoard = battleship.Gameboard();
  expect(newBoard.fields[0].coordinates).toEqual(["A", 1]);
  expect(newBoard.fields[newBoard.fields.length - 1].coordinates).toEqual([
    "J",
    10,
  ]);
});
///make & check a function for array comparison

test("identical arrays", () => {
  expect(battleship.compareArrays(["A", 1], ["A", 1])).toBe(true);
});

test("different arrays", () => {
  expect(battleship.compareArrays(["A", 2], ["A", 1])).toBe(false);
});

//later
test("add ship", () => {
  let newBoard = battleship.Gameboard();
  let newShipCoords = [
    ["A", 1],
    ["B", 1],
  ];
  newBoard.addShip(newShipCoords);
  expect(newBoard.fields.find(e => (e.coordinates[0][0] === newShipCoords[0][0] && e.coordinates[0][1] === newShipCoords[0][1])).ship).toBe(true);
});

//should be able to place ships at specific coordinates by calling the ship factory function.

// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or
// not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.

// Gameboards should keep track of missed attacks so they can display them properly.

// Gameboards should be able to report whether or not all of their ships have been sunk.
