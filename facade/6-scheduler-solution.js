'use strict';

const { EventEmitter } = require('node:events');

class Logger {
  static color(level) {
    return Logger.COLORS[level] || Logger.COLORS.info;
  }

  #output;

  constructor(output) {
    this.#output = output;
  }

  log(level, s) {
    const date = new Date().toISOString();
    const color = Logger.color(level);
    this.#output.log(color + date + '\t' + s + '\x1b[0m');
  }

  warn(s) {
    this.log('warn', s);
  }

  error(s) {
    this.log('error', s);
  }

  info(s) {
    this.log('info', s);
  }
}

Logger.COLORS = {
  warn: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
};

class Task {
  #events;
  #exec;

  constructor(name, exec) {
    this.#events = new EventEmitter();

    this.name = name;

    this.#exec = exec;
    this.running = false;
    this.count = 0;
  }

  on(...args) {
    return this.#events.on(...args);
  }

  run() {
    if (this.running) return false;

    this.running = true;

    this.#events.emit('begin', this);

    this.#exec((err, res) => {
      if (err) this.#events.emit('error', err, this);

      this.#events.emit('end', res, this);

      this.count++;

      this.running = false;
    });

    return true;
  }
}

class TimeoutTask extends Task {
  #timer = null;
  #timestamp;

  constructor(name, timestamp, exec) {
    super(name, exec);

    this.#timestamp = timestamp;
  }

  get active() {
    return this.#timer !== null;
  }

  start() {
    this.stop();

    if (this.running) return false;

    const timeout = new Date(this.#timestamp) - new Date();

    if (timeout < 0) return false;

    this.#timer = setTimeout(() => void this.run(), timeout);

    return true;
  }

  stop() {
    if (!this.active || this.running) return false;

    clearTimeout(this.timer);

    this.timer = null;

    return true;
  }

  run() {
    if (!this.active) return false;
    return super.run();
  }
}

class IntervalTask extends Task {
  #timer = null;
  #interval;

  constructor(name, interval, exec) {
    super(name, exec);

    this.#interval = interval;
  }

  get active() {
    return this.#timer !== null;
  }

  start() {
    this.stop();

    if (this.running) return false;

    this.#timer = setInterval(() => void this.run(), this.#interval);

    return true;
  }

  stop() {
    if (!this.active || this.running) return false;

    clearInterval(this.timer);

    this.timer = null;

    return true;
  }

  run() {
    if (!this.active) return false;
    return super.run();
  }
}

const isDate = (strToTest) => {
  const dateToTest = new Date(strToTest);
  return dateToTest instanceof Date && !isNaN(dateToTest.getTime());
};

class AsyncTask {
  constructor(name, time, exec) {
    let AsyncTaskStrategy;

    if (typeof time === 'number') {
      AsyncTaskStrategy = IntervalTask;
    } else if (isDate(time)) {
      AsyncTaskStrategy = TimeoutTask;
    } else {
      throw new Error('Invalid time argument');
    }

    return new AsyncTaskStrategy(name, time, exec);
  }
}

class Scheduler {
  #events;
  #logger;
  #tasks = new Map();

  constructor(options) {
    this.#events = new EventEmitter();

    this.#logger = new Logger(options.output);
  }

  on(...args) {
    return this.#events.on(...args);
  }

  task(name, time, exec) {
    this.stop(name);

    const task = new AsyncTask(name, time, exec);

    this.#tasks.set(name, task);

    task.on('error', (err) => {
      this.#logger.error(task.name + '\t' + err.message);

      this.#events.emit('error', err, task);
    });

    task.on('begin', () => {
      this.#logger.info(task.name + '\tbegin');
    });

    task.on('end', (res = '') => {
      this.#logger.warn(task.name + '\tend\t' + res);
    });

    task.start();

    return task;
  }

  stop(name) {
    const task = this.#tasks.get(name);

    if (task) {
      task.stop();
      this.#tasks.delete(name);
    }
  }

  stopAll() {
    for (const name of this.#tasks.keys()) {
      this.stop(name);
    }
  }
}

// Usage

const scheduler = new Scheduler({ output: console });

scheduler.on('error', (err, task) => {
  console.log(`Error in ${task.name}:\n ${err.stack}`);
  //process.exit(1);
});

scheduler.task('name1', '2019-03-12T14:37Z', (done) => {
  setTimeout(() => {
    done(null, 'task successed');
  }, 1000);
});

scheduler.task('name2', '2019-03-12T14:37Z', (done) => {
  setTimeout(() => {
    done(new Error('task failed'));
  }, 1100);
});

scheduler.task('name3', 500, (done) => {
  setTimeout(() => {
    done(null, 'task successed');
  }, 1200);
});

scheduler.task('name4', 800, (done) => {
  setTimeout(() => {
    done(new Error('task failed'));
  }, 2000);
});
