const Counter = function(config, callback) {

    let self = this;

    self.config = config;
    self.callback = callback || null;
    self.target = self.validateTarget();
    self.value = self.setInitialValue();

    /**
     * Check if callback function exists; fire 
     * if so.
     */
    self.fireCallback() {
        if(self.callback && typeof self.callback === 'function') {
            self.callback();
        }
    }
    
    /**
     * Final checks and initialization.
     */
    self.init = function() {
        if(self.config && self.config.startingValue < self.config.endingValue) {
            setInterval(self.writeValueToTarget, 1);
            return;
        }
        throw Error('A Counter\'s starting value must be lower than its ending value.');
    }

    /**
     * Set the counter's initial value.
     */
    self.setInitialValue = function() {
      if((self.config.endingValue - self.config.startingValue) >= (self.config.threshold || 251)) {
          return self.config.endingValue - 250;
      }
      return self.config.startingValue;
    };

    /**
     * Make sure queryselectorall() returns
     * exactly one element. 
     */
    self.validateTarget = function() {
        if(self.config.selector && typeof self.config.selector === 'string') {
            const elementList = document.querySelectorAll(self.config.selector);
            switch(elementList.length) {
                case 1:
                    return elementList[0];
                case 0:
                    throw Error(`Zero DOM elements found for selector '${self.config.selector}'.`);
                default:
                    throw Error('A Counter cannot have more than one target element.');
            }
        }
        throw Error('Invalid \'selector\' configuration.');
    };

    /**
     * Write new value to target element's 
     * inner HTML.
     */
    self.writeValueToTarget = function() {
        const diff = self.config.endingValue - self.value;
        if(diff >= 1) {
            self.value++;
            self.target.innerHTML = self.value;
            return;
        }
        if(diff > 0) {
            self.value += diff;
            self.target.innerHTML = self.value;
            return;
        }
        window.clearInterval(self.intervalId);
        self.fireCallback();
    }
}

module.exports = Counter; 