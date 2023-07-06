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