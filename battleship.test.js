const battleship = require ('./battleship.js')

test('Ship factory function', () => {
  let newShip = battleship.Ship()
  expect(newShip.length).toBe(1);
  expect(newShip.hits).toBe(0);
  expect(newShip.sunk).toBe(false);
});

test('Other length ship', () => {
  expect(battleship.Ship(4).length).toBe(4);
});

test('Working hit() method', () => {
  let newShip = battleship.Ship()
  newShip.hit()
  expect(newShip.hits).toBe(1);
  expect(newShip.sunk).toBe(true)
});

test('bigger ship survives one git', () => {
  let newShip = battleship.Ship(4)
  newShip.hit()
  expect(newShip.hits).toBe(1);
  expect(newShip.sunk).toBe(false)
});

test('imports the Gameboard',()=>{
  expect(typeof battleship.Gameboard()).toEqual('object')
})

//to test Gameboard
//should be a board of coordinates

//should be able to place ships at specific coordinates by calling the ship factory function.

// Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or
// not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.

// Gameboards should keep track of missed attacks so they can display them properly.

// Gameboards should be able to report whether or not all of their ships have been sunk.