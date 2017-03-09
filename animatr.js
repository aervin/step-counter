const Animatr = function(config, callback) {
  let self = this;

  self.getAnimations = function() {
    let animationsArray = [];
    if (self.config.animations && self.config.animations.length >= 1) {
      animationsArray = self.config.animations;
    }
    return animationsArray;
  };

  self.init = function() {
    for (let i = 0; i < self.target.length; i++) {
      setTimeout(
        function() {
          for (let j = 0; j < self.animations.length; j++) {
            try {
              self.setProperty(i, self.animations[j]);
            } catch (error) {
              throw Error(error);
            }
          }
        },
        self.config.chainDelay * i
      );
    }
    if (self.callback) {
      self.callback();
    }
  };

  self.setProperty = function(targetIndex, a) {
    const key = Object.keys(a)[0];
    self.target[targetIndex].style[key] = a[key];
  };

  self.validateCallback = function() {
    if (callback && typeof callback === "function") {
      return callback;
    } else {
      return null;
    }
  };

  self.validateConfig = function() {
    if (config && config.target) {
      return config;
    }
    throw Error(
      "Invalid configuration passed to Animatr instance. Is the 'target' property set?"
    );
  };

  self.validateTarget = function() {
    if (!self.config.target || typeof self.config.target !== "string") {
      throw Error("The 'target' property must be a string.");
    } else {
      const targets = document.querySelectorAll(self.config.target);
      switch (targets.length) {
        case 0:
          throw Error("No target element found.");
        default:
          return targets;
      }
    }
  };

  self.config = self.validateConfig();
  self.target = self.validateTarget();
  self.callback = self.validateCallback();
  self.animations = self.getAnimations();
};
