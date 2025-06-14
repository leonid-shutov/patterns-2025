"use strict";

class Person {
  constructor(name) {
    this.name = name;
  }
}

const createPerson = (name) => new Person(name);

module.exports = { Person, createPerson };
