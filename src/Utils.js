import {
  pipe,
  prop,
  cond,
  equals,
  always,
  last,
  prepend,
  __,
  subtract,
  when,
  gt,
  any,
  either,
  lt,
  init,
  curry,
  append,
  tail,
} from "ramda";

import * as constants from "./constants";

export const getDirection = pipe(
  prop("keyCode"),
  cond([
    [equals(37), always(constants.LEFT)],
    [equals(38), always(constants.UP)],
    [equals(39), always(constants.RIGHT)],
    [equals(40), always(constants.DOWN)],
  ])
);

export const getSnakeDotsWithVirtualTail = prepend("[]");

export const updateSpeed = when(gt(__, 20), subtract(__, 10));

const isOutOfBounds = any(either(lt(__, 0), gt(__, 98)));
const hasSnakeOutOfBounds = pipe(last, isOutOfBounds);

const hasSnakeCollapsed = (snakeDots) => {
  const head = last(snakeDots);
  const body = init(snakeDots);
  return any(equals(head), body);
};

export const isGameOver = either(hasSnakeOutOfBounds, hasSnakeCollapsed);

export const hasSnakeEats = curry((food, snakeDots) =>
  equals(food, last(snakeDots))
);

export const updateSnakeDots = curry((direction, snakeDots) => {
  const head = last(snakeDots);
  const body = tail(snakeDots);
  const newHead = cond([
    [equals(constants.RIGHT), always([head[0] + 2, head[1]])],
    [equals(constants.LEFT), always([head[0] - 2, head[1]])],
    [equals(constants.DOWN), always([head[0], head[1] + 2])],
    [equals(constants.UP), always([head[0], head[1] - 2])],
  ])(direction);
  return append(newHead, body);
});
