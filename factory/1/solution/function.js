"use strict";
/** @typedef {import('./function.d.ts').Color} Color */
/** @typedef {import('./function.d.ts').Level} Level */
/** @typedef {import('./function.d.ts').Options} Options */

/** @type {Record<Color, string>} */
const colorToAnsi = {
  white: "\x1b[1;37m",
  yellow: "\x1b[1;33m",
  red: "\x1b[0;31m",
};

/** @type {Record<Level, string>} */
const levelToAnsi = {
  info: colorToAnsi.white,
  warning: colorToAnsi.yellow,
  error: colorToAnsi.red,
};

/**
 * @param {Options} options
 */
const ansiFromOptions = (options) => {
  if (options.level !== undefined) return levelToAnsi[options.level];
  if (options.color !== undefined) return levelToAnsi[options.color];
};

/**
 * @param {Options} options
 */
const logger = (options) => {
  const ansi = ansiFromOptions(options);
  return (message) => {
    const date = new Date().toISOString();
    console.log(`${ansi}${date}\t${message}`);
  };
};

module.exports = { logger };
