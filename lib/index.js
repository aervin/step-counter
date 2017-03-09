"use strict";

var Counter = function Counter(config, callback) {
  var self = this;

  self.config = config;
  self.config.delay = self.config.delay || 0;
  self.callback = callback || null;

  /**
     * Check if callback function exists; fire 
     * if so.
     */
  self.fireCallback = function () {
    if (self.callback && typeof self.callback === "function") {
      self.callback();
    }
  };

  /**
    * Final checks and initialization. This
    * method starts the counter.
    */
  self.init = function () {
    setTimeout(function () {
      if (self.config && self.config.startingValue < self.config.endingValue) {
        self.intervalId = setInterval(self.writeValueToTarget, 1);
        return;
      }
    }, self.config.delay);
  };

  /**
     * Set the counter's initial value.
     */
  self.setInitialValue = function () {
    if (self.config.endingValue - self.config.startingValue >= (self.config.threshold || 251)) {
      return self.config.endingValue - 250;
    }
    return self.config.startingValue;
  };

  /**
     * Make sure queryselectorall() returns
     * exactly one element. 
     */
  self.validateTarget = function () {
    if (self.config.selector && typeof self.config.selector === "string") {
      var elementList = document.querySelectorAll(self.config.selector);
      switch (elementList.length) {
        case 1:
          return elementList[0];
        case 0:
          throw Error("Zero DOM elements found for selector '" + self.config.selector + "'.");
        default:
          throw Error("A Counter cannot have more than one target element.");
      }
    }
    throw Error("Invalid 'selector' configuration.");
  };

  /**
     * Write new value to target element's 
     * inner HTML.
     */
  self.writeValueToTarget = function () {
    var diff = self.config.endingValue - self.value;
    if (diff >= 1) {
      self.value++;
      self.target.innerHTML = self.config.dollar ? '$' + self.value.toString() : self.value;
      return;
    }
    if (diff > 0) {
      self.value += diff;
      self.target.innerHTML = self.config.dollar ? '$' + self.value.toString() : self.value;
      return;
    }
    window.clearInterval(self.intervalId);
    self.fireCallback();
  };

  self.target = self.validateTarget();
  self.value = self.setInitialValue();
};