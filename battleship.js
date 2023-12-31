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

function Gameboard(player = null, visible = true) {
  function createEmptyBoard() {
    let boardFields = [];
    for (let i = 1; i < 11; i++) {
      for (let j = 0; j < 10; j++) {
        boardFields.push({
          X: letters[j],
          Y: i,
          ship: false,
          hit: false,
          blocked: false,
        });
      }
    }
    return boardFields;
  }

  return {
    player,
    visible,
    fields: createEmptyBoard(),
    gameOver: false,
    applyFunctionToSurroundingFields(
      appliedFunction,
      targetedFieldCoords /* [X, Y]*/
    ) {
      //use this to mark surrounding fields as hit after sinking a ship

      appliedFunction(targetedFieldCoords, -1, -1);
      appliedFunction(targetedFieldCoords, -1, 0);
      appliedFunction(targetedFieldCoords, -1, 1);
      appliedFunction(targetedFieldCoords, 0, -1);
      appliedFunction(targetedFieldCoords, 0, 1);
      appliedFunction(targetedFieldCoords, 1, -1);
      appliedFunction(targetedFieldCoords, 1, 0);
      appliedFunction(targetedFieldCoords, 1, 1);
    },
    addShip(...args) {
      //ex. (["A", 1], ["B", 1])
      let newShip = Ship(args.length);
      let fieldsToFill = args;
      for (let i = 0; i < fieldsToFill.length; i++) {
        if (
          findField(fieldsToFill[i][0], fieldsToFill[i][1], this) === undefined
        ) {
          throw "addShip - Invalid field";
        } else if (
          !this.verifyIfFieldIsNotBlocked(
            fieldsToFill[i][0],
            fieldsToFill[i][1]
          )
        ) {
          console.log("the field is:");
          console.log(fieldsToFill[i][0], fieldsToFill[i][1]);
          throw "addShip - Blocked field";
        }
      }

      for (let i = 0; i < this.fields.length; i++) {
        for (let j = 0; j < fieldsToFill.length; j++) {
          if (
            this.fields[i].X === fieldsToFill[j][0] &&
            this.fields[i].Y === fieldsToFill[j][1]
          ) {
            this.fields[i].ship = newShip;
            this.fields[i].blocked = true;
            let currentX = this.fields[i].X;
            let currentY = this.fields[i].Y;

            let board = this;

            function blockSurroundingFields(current, Xmodifier, Ymodifier) {
              let XtoBeBlocked =
                letters[letters.findIndex((e) => e === current[0]) + Xmodifier];
              if (XtoBeBlocked) {
                let YtoBeBlocked = current[1] + Ymodifier;

                if (YtoBeBlocked < 11 && YtoBeBlocked > 0) {
                  findField(XtoBeBlocked, YtoBeBlocked, board).blocked = true;
                }
              }
            }

            this.applyFunctionToSurroundingFields(blockSurroundingFields, [
              currentX,
              currentY,
            ]);

            break;
          }
        }
      }
    },
    verifyIfFieldIsNotBlocked(Xcoord, Ycoord) {
      return !findField(Xcoord, Ycoord, this).blocked;
    },
    placeShipRandomly(size) {
      let attemptedStarterFields = []; //check this as well
      let board = this;

      let coordsToFill = []; //starting point of the ship we are about to place
      let direction = null;
      let nextField = null;

      function attemptPlacing(currentField) {
        let Xup = null;
        let Xdown = null;
        let Yup = null;
        let Ydown = null;

        function defineDirectionalVariables() {
          Xup = letters[letters.findIndex((e) => e === currentField.X) + 1];
          Xdown = letters[letters.findIndex((e) => e === currentField.X) - 1];
          Yup = currentField.Y + 1;
          Ydown = currentField.Y - 1;
        }

        if (currentField) {
          defineDirectionalVariables();
        }

        function checkFieldAdditionSuitability(checkedField) {
          if (letters.includes(checkedField[0])) {
            if (checkedField[1] < 10 && checkedField[1] > 0) {
              if (
                board.verifyIfFieldIsNotBlocked(
                  checkedField[0],
                  checkedField[1]
                )
              ) {
                if (
                  !coordsToFill.find(
                    (e) => e[0] === checkedField[0] && e[1] === checkedField[1]
                  )
                ) {
                  return checkedField;
                }
              }
            }
          } else {
            return false;
          }
        }
        if (direction === "up") {
          if (checkFieldAdditionSuitability([Xdown, currentField.Y, "up"])) {
            nextField = [Xdown, currentField.Y, board];
          } else {
            nextField = null;
          }
        } else if (direction === "down") {
          if (checkFieldAdditionSuitability([Xup, currentField.Y, "down"])) {
            nextField = [Xup, currentField.Y, board];
          } else {
            nextField = null;
          }
        } else if (direction === "right") {
          if (checkFieldAdditionSuitability([currentField.X, Yup, "right"])) {
            nextField = [currentField.X, Yup, board];
          } else {
            nextField = null;
          }
        } else if (direction === "left") {
          if (checkFieldAdditionSuitability([currentField.X, Ydown, "left"])) {
            nextField = [currentField.X, Ydown, board];
          } else {
            nextField = null;
          }
        } else {
          function findNewRandomField() {
            //to roll recursively, in case the field was already tried
            let listOfUnblockedFields = [];

            for (let c = 0; c < board.fields.length; c++) {
              if (
                board.verifyIfFieldIsNotBlocked(
                  board.fields[c].X,
                  board.fields[c].Y
                )
              ) {
                listOfUnblockedFields.push(board.fields[c]);
              }
            }

            let returnedField =
              listOfUnblockedFields[
              Math.floor(Math.random() * listOfUnblockedFields.length)
              ];
            if (
              !attemptedStarterFields.find(
                (e) => e[0] == returnedField.X && e[1] == returnedField.Y
              )
            ) {
              return returnedField;
            } else {
              return findNewRandomField();
            }
          }

          if (coordsToFill.length >= size) {
            return;
          }
          if (!currentField) {
            currentField = findNewRandomField();
            defineDirectionalVariables();
          }

          if (coordsToFill.length < 1) {
            //!!!if this is the first field, mark it as one of the attempted beginnings
            attemptedStarterFields.push(currentField.X.concat(currentField.Y));
          }
          coordsToFill.push([currentField.X, currentField.Y]);

          let nearbyFields = [];
          function addToNearbyFieldsIfSuitable(fieldToCheckAndAdd) {
            if (checkFieldAdditionSuitability(fieldToCheckAndAdd)) {
              nearbyFields.push(fieldToCheckAndAdd);
            }
          }

          addToNearbyFieldsIfSuitable([Xdown, currentField.Y, "up"]);
          addToNearbyFieldsIfSuitable([Xup, currentField.Y, "down"]);
          addToNearbyFieldsIfSuitable([currentField.X, Yup, "right"]);
          addToNearbyFieldsIfSuitable([currentField.X, Ydown, "left"]);

          nextField =
            nearbyFields[Math.floor(Math.random() * nearbyFields.length)];
        }
        if (!nextField) {
          console.log("restarting due to placement error");
          coordsToFill = [];
          direction = null;
          nearbyFields = [];
          nextField = null;
          attemptPlacing();
        } else {
          if (!direction) {
            direction = nextField[2];
          } else if (coordsToFill.length >= size) {
            return;
          }

          if (size > 1) {
            coordsToFill.push([nextField[0], nextField[1]]);
            attemptPlacing(findField(nextField[0], nextField[1], board));
          }
        }
      }
      attemptPlacing();
      board.addShip(...coordsToFill);
    },
    receiveAttack(targetX, targetY) {
      let board = this;

      let attackedField = findField(targetX, targetY, board);
      if (attackedField.ship) {
        attackedField.ship.hit();
        if (attackedField.ship.sunk) {
          function hitSurroundingFields(current, Xmodifier, Ymodifier) {
            let XtoBeHit =
              letters[letters.findIndex((e) => e === current[0]) + Xmodifier];
            if (XtoBeHit) {
              let YtoBeHit = current[1] + Ymodifier;
              if (YtoBeHit < 11 && YtoBeHit > 0) {
                findField(XtoBeHit, YtoBeHit, board).hit = true;
              }
            }
          }

          let fieldsContainingSunkShip = board.fields.filter((e) => e.ship === attackedField.ship)

          console.log(fieldsContainingSunkShip);

          for (let a = 0; a < fieldsContainingSunkShip.length; a++) {
            this.applyFunctionToSurroundingFields(hitSurroundingFields, [fieldsContainingSunkShip[a].X, fieldsContainingSunkShip[a].Y])
          }
        }
      }
      attackedField.hit = true;
      if (this.gameOverCheck()) {
        this.gameOver = true;
      }
    },
    gameOverCheck() {
      let unsunkShips = [];
      for (let field in this.fields) {
        if (this.fields[field].ship) {
          if (!this.fields[field].ship.sunk) {
            unsunkShips.push(this.fields[field].ship);
          }
        }
      }
      if (unsunkShips.length < 1) {
        return true;
      } else {
        return false;
      }
    },
    checkFieldHitStatus(X, Y) {
      if (findField(X, Y, this).hit) {
        return true;
      } else {
        return false;
      }
    },
  };
}

function findField(coordX, coordY, board) {
  return board.fields.find((e) => e.X == coordX && e.Y == coordY);
}

function Player(type = "human", designation = null) {
  return {
    type,
    designation,
    attackBoard(board, X, Y) {
      if (!findField(X, Y, board).hit) {
        let explosion = new Audio("explosion.mp3");
        explosion.play();
        board.receiveAttack(X, Y);
      } else {
        return false;
      }
    },
    randomAttack(board) {
      let fieldsNotAttackedYet = board.fields.filter((f) => f.hit === false);
      if (fieldsNotAttackedYet.length !== 0) {
        let target =
          fieldsNotAttackedYet[
          Math.floor(Math.random() * fieldsNotAttackedYet.length)
          ];
        this.attackBoard(board, target.X, target.Y);
      } else {
        return;
      }
    },
  };
}

const game = (() => {
  let currentPlayer = null;

  function handleGameOver() {

    DOMManagement.displayGameOverContent(currentPlayer.designation)
    console.log(`game over, player ${currentPlayer.designation} won`);
  }


  function startGame() {
    console.log("game starting")
    let playerOne = Player("human", "O");
    let playerTwo = Player("computer", "T");

    let boardPlayerOne = Gameboard(playerOne);
    console.log(boardPlayerOne)

    function placeShipsOnBoard(targetedBoard, largest) {
      for (let size = largest, numberOfShips = 1; size > 0; size--, numberOfShips++) {
        for (let iterationes = numberOfShips; iterationes > 0; iterationes--) {
          targetedBoard.placeShipRandomly(size)
        }
      }

    }
    placeShipsOnBoard(boardPlayerOne, 4)
    verifiedBoardState = boardPlayerOne;

    let boardPlayerTwo = Gameboard(playerTwo, false); //second argument is visibility
    placeShipsOnBoard(boardPlayerTwo, 4)
    DOMManagement.updateBoardDisplay(boardPlayerOne);
    DOMManagement.updateBoardDisplay(boardPlayerTwo);

    function makeMove(player) {

      if (player.type === "human") {
        let targetedBoardDOM = document.getElementById("playerTwoBoard"); //fix in case of two humans
        let targetedBoard = boardPlayerTwo;
        function removeListenersFromBoard(clearedBoard) {
          for (let b = 0; b < clearedBoard.children.length; b++) {
            clearedBoard.children[b].removeEventListener(
              "click",
              fieldClickEvent
            );
          }
        }

        function fieldClickEvent(event) {
          if (!event.target.classList.contains("hit-field")) {
            DOMManagement.handleFieldClick(event.target, targetedBoard, player);
            DOMManagement.updateBoardDisplay(boardPlayerOne);
            DOMManagement.updateBoardDisplay(boardPlayerTwo);
            removeListenersFromBoard(document.getElementById("playerTwoBoard"));
            removeListenersFromBoard(document.getElementById("playerOneBoard"));

            if (targetedBoard.gameOver) {
              handleGameOver(targetedBoardDOM);
            } else {
              currentPlayer =
                currentPlayer === playerOne ? playerTwo : playerOne;
              setTimeout(makeMove, 500, currentPlayer);
            }
          }
        }

        function removeListenersFromBoard(clearedBoard) {
          for (let b = 0; b < clearedBoard.children.length; b++) {
            clearedBoard.children[b].removeEventListener(
              "click",
              fieldClickEvent
            );
          }
        }
        for (let a = 0; a < targetedBoardDOM.children.length; a++) {
          targetedBoardDOM.children[a].addEventListener(
            "click",
            fieldClickEvent
          );
        }
      } else if (player.type === "computer") {
        //fix in case of two humans
        let targetedBoard = boardPlayerOne;

        player.randomAttack(targetedBoard);

        DOMManagement.updateBoardDisplay(boardPlayerOne);
        DOMManagement.updateBoardDisplay(boardPlayerTwo);

        if (targetedBoard.gameOver) {
          handleGameOver();
        } else {

          currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
          makeMove(currentPlayer);
        }
      }

    }

    currentPlayer = playerOne;
    makeMove(currentPlayer);
  }


  return {
    startGame,
  };
})();

const DOMManagement = (() => {

  function removeAllChildren(element) {
    const counter = element.children.length;
    for (let m = 0; m <= counter; m++) {
      if (element.children[0]) {
        element.children[0].remove();
      }
    }
  }

  const computerPlayButton = document.getElementById("computer-play-button");

  computerPlayButton.addEventListener("click", () => {
    setUpBoardsAndStartGame()
    computerPlayButton.remove()
  });

  function setUpBoardsAndStartGame() {
    displayBoard("player-one-area", "playerOneBoard");
    displayBoard("player-two-area", "playerTwoBoard");

    game.startGame();
  }

  function displayBoard(parent, boardName) {
    let boardHeading = document.createElement("h3");
    boardHeading.innerText =
      boardName === "playerOneBoard" ? "Player" : "Opponent";
    document.getElementById(parent).appendChild(boardHeading);

    const boardContainer = document.createElement("div");

    boardContainer.classList.add("board-container");
    boardContainer.setAttribute("id", boardName);
    document.getElementById(parent).appendChild(boardContainer);
    let coordY = 1;
    let coordX = letters[0];

    for (let k = 0; k < 100; k++, coordY++) {
      const newField = document.createElement("div");
      newField.classList.add("board-field");
      if (coordY > 10) {
        coordY = 1;
        coordX = letters[letters.findIndex((e) => e === coordX) + 1];
      }
      let playerCoord = boardName === "playerOneBoard" ? "O" : "T"; //O - player One; T - player Two
      let coordinates = playerCoord + coordX + coordY;
      newField.setAttribute("id", coordinates);

      boardContainer.appendChild(newField);
    }
  }

  function updateBoardDisplay(board) {
    //board would be O or T and based on that display ships (for now)
    let playerCoord = board.player.designation === "O" ? "O" : "T";
    let boardID = playerCoord === "O" ? "playerOneBoard" : "playerTwoBoard";
    let displayedBoard = document.getElementById(boardID);

    displayedBoard.classList.add("cought");

    board.fields.forEach((f) => {
      let fieldInDOM = document.getElementById(playerCoord + f.X + f.Y);
      if (f.ship && board.visible) {
        fieldInDOM.classList.add("visible-ship");
      }
      if (f.hit) {
        fieldInDOM.classList.add("hit-field");
        if (f.ship) {
          fieldInDOM.classList.add("hit-ship");
        }
      }
    });
  }

  function handleFieldClick(clickedField, targetedBoard, attacker) {
    let targetedX = clickedField.id[1];

    //if the id has a 4th value, concatenate it to 3rd, otherwise just use 3rd value of id as Y
    let targetedY = clickedField.id[3]
      ? clickedField.id[2].concat(clickedField.id[3])
      : clickedField.id[2];
    attacker.attackBoard(targetedBoard, targetedX, targetedY);
  }

  function displayGameOverContent(winner) {
    let message = document.createElement('h3')
    message.innerText = `${winner} is the winner!`
    document.getElementById("game-area-container").appendChild(message)

    let restartButton = document.createElement('button')
    restartButton.classList.add("btn")
    restartButton.classList.add("btn-dark")
    restartButton.innerText = "RESTART"
    document.getElementById("game-area-container").appendChild(restartButton)

    restartButton.addEventListener('click', () => {
      removeAllChildren(document.getElementById('player-one-area'))
      removeAllChildren(document.getElementById('player-two-area'))
      setUpBoardsAndStartGame()
      restartButton.remove()
      message.remove()
    })


  }

  return {
    updateBoardDisplay,
    handleFieldClick,
    displayGameOverContent
  };
})();



module.exports = { Ship, Gameboard, findField, Player, game };
