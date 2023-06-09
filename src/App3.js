import React, { memo, useCallback, useEffect, useRef } from "react";
import Snake from "./Snake";
import Food from "./Food";
import Button from "./Button";
import Menu from "./Menu";
import * as constants from "./constants";
import {
  updateSnakeDots,
  getDirection,
  getSnakeDotsWithVirtualTail,
  updateSpeed,
  hasSnakeEats,
  isGameOver,
} from "./Utils";

const App3 = memo(() => {
  const [direction, setDirection] = React.useState(constants.RIGHT);
  const [snakeDots, setSnakeDots] = React.useState(constants.INITIAL_DOTS);
  const directionRef = useRef(direction);

  const [food, setFood] = React.useState(getRandomFood());
  const [speed, setSpeed] = React.useState(constants.INITIAL_SPEED);
  const [route, setRoute] = React.useState(constants.MENU);

  const onRouteChange = useCallback(() => {
    setRoute(constants.GAME);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (route === constants.GAME) {
        setSnakeDots((snakeDots) =>
          updateSnakeDots(directionRef.current)(snakeDots)
        );
      }
    }, speed);

    return () => clearInterval(interval);
  }, [speed, route, direction]);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, []);

  useEffect(() => {
    if (route === constants.GAME && isGameOver(snakeDots)) {
      gameOver();
    } else if (hasSnakeEats(food)(snakeDots)) {
      setFood(getRandomFood());
      setSpeed(updateSpeed(speed));
      setSnakeDots(getSnakeDotsWithVirtualTail(snakeDots));
    }
  }, [snakeDots, direction, route]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  function gameOver() {
    alert(`Game Over. Your score is ${snakeDots.length - 2}`);
    setSnakeDots(constants.INITIAL_DOTS);
    setDirection(constants.RIGHT);
    setSpeed(constants.INITIAL_SPEED);
    setFood(getRandomFood());
    setRoute(constants.MENU);
  }

  function keyDownHandler(e) {
    setDirection(getDirection(e));
  }

  function getRandomFood() {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
  }

  return (
    <div>
      {route === constants.MENU ? (
        <div>
          <Menu onRouteChange={onRouteChange} />
        </div>
      ) : (
        <div>
          <div className="game-area">
            <Snake snakeDots={snakeDots} />
            <Food dot={food} />
          </div>
          {/* <Button
            onDown={this.onDown}
            onLeft={this.onLeft}
            onRight={this.onRight}
            onUp={this.onUp}
          /> */}
        </div>
      )}
    </div>
  );
});

export default App3;
