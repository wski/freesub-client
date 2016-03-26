'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = function () {
  function PubSub(address) {
    var _this = this;

    _classCallCheck(this, PubSub);

    this.socket = new WebSocket(address);
    this.connected = false;
    this.client = this.clientid();

    this.socket.onopen = function (event) {
      _this.connected = true;
    };
  }

  _createClass(PubSub, [{
    key: 'clientid',
    value: function clientid() {
      var d = new Date().getTime();
      var uuid = 'client-xxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      return uuid;
    }
  }, {
    key: 'stringify',
    value: function stringify(data, cb) {
      try {
        cb(JSON.stringify(data));
      } catch (e) {
        console.warn('attempted to send invalid data to the pubsub server.');
      }
    }
  }, {
    key: 'publish',
    value: function publish(channel, data, attempt) {
      var _this2 = this;

      // If we're connected, let's go ahead and publish our payload.
      if (this.connected) {
        // It looks like our first attempt failed, let's let them know it went through finally.
        if (attempt) {
          console.log('Connection established. Successfully sent payload after ' + attempt + ' attempt(s).');
        }
        // Safely stringify our data before sending it to the server.
        this.stringify({
          channel: channel,
          payload: data,
          metadata: {
            time: Date.now(),
            client: this.client,
            type: 'publish'
          }
        }, function (payload) {
          _this2.socket.send(payload);
        });
      } else {
        // Crap, Something is wrong and we're not connected yet, let's try again later.
        console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
        setTimeout(function () {
          var attempts = attempt ? attempt : 0;
          _this2.publish(channel, data, attempts + 1);
        }, 500);
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(channel, cb, attempt) {
      var _this3 = this;

      if (this.connected) {
        // It looks like our first attempt failed, let's let them know it went through finally.
        if (attempt) {
          console.log('Connection established. Successfully sent payload after ' + attempt + ' attempt(s).');
        }
        // Safely stringify our data before sending it to the server.
        this.stringify({
          channel: channel,
          metadata: {
            time: Date.now(),
            client: this.client,
            type: 'subscribe'
          }
        }, function (payload) {
          _this3.socket.send(payload);
          _this3.socket.onmessage = function (msg) {
            if (JSON.parse(msg.data).channel === channel) {
              cb(JSON.parse(msg.data));
            }
          };
        });
      } else {
        // Crap, Something is wrong and we're not connected yet, let's try again later.
        console.warn('Failed to publish, not connected to server, attempting again in 1 second.');
        setTimeout(function () {
          var attempts = attempt ? attempt : 0;
          _this3.subscribe(channel, cb, attempts);
        }, 500);
      }
    }
  }]);

  return PubSub;
}();

;