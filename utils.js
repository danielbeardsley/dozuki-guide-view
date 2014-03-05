Dozuki.utils = (function() {
   var imageSizes = [
      {width: 50, name: 'mini'},
      {width: 96, name: 'thumbnail'},
      {width: 300, name: 'standard'},
      {width: 592, name: 'medium'},
      {width: 800, name: 'large'},
      {width: 1600, name: 'huge'},
      {width: 9999999, name: 'original'}
   ];

   // This is used when iterating over properties in an object, to ensure we can
   // check if a property is actually used in the object, vs it's prototype chain
   var hasOwnProperty = function(obj, prop){
      var proto = obj.__proto__ || obj.constructor.prototype;
      return (prop in obj) &&
         (!(prop in proto) || proto[prop] !== obj[prop]);
   }

   // if the native version exists, use that
   if(Object.prototype.hasOwnProperty){
      hasOwnProperty = function(obj, prop){
         return obj.hasOwnProperty(prop);
      }
   }

   var templates = {};
   var utils = {
      /**
       * Given a Constructor function, this adds both .on() and .trigger() to
       * its prototype allowing the consumption and broadcasting of events.
       */
      eventize: function (constructor) {
         constructor.prototype.on = function(event, callback) {
            if (!this._events) this._events = {};
            if (!this._events[event]) this._events[event] = [];
            this._events[event].push(callback);
         };
         constructor.prototype.trigger = function(event) {
            if (!this._events) return;
            var args = $.makeArray(arguments);
            $.each(this._events[event], function(i, handler) {
               handler.apply(this, args.slice(1));
            });
         }
      },

      /**
       * Given a handlebars template and some data, render it and return the
       * DOM element.
       */
      render: function (template, data) {
         if (!templates[template]) {
            templates[template] = Handlebars.compile(template);
         }
         return utils.html(templates[template](data));
      },

      /**
       * Returns a DOM element constructed with the given HTML.
       */
      html: function (html) {
         var div = document.createElement('div');
         div.innerHTML = html;
         return div.firstElementChild;
      },

      responsiveImage: function (options, urls) {
         var devPixelRatio = (window.devicePixelRatio || 1);
         var desiredDevicePixels = options.desiredWidth * devPixelRatio;
         var appropriateSize = getImageSizeWiderThan(desiredDevicePixels, urls);

         delete options.desiredWidth;
         options.src = urls[appropriateSize];
         options.tag = 'img';

         return createElements(options);
      },

      /**
       * Helper function to create a DOM structure
       *
       * Pass it an object like the following:
       *
       * config = {
       *    tag: 'span', // not required, defaults to 'div'
       *    c  : 'list_of css-classes', // not required
       *    // All other properties will be passed straight through to new
       *    // Element(...)
       *    children : [array of DOM elements or config objects that will be
       *    passed to this function]
       * }
       */
      createElements: createElements,

      hasOwnProperty: hasOwnProperty,

      className: function (name) {
         return "dozuki-" + name;
      }
   };

   return utils;

   function createElements(config){
      if (typeof(config) === 'string') {
         return document.createTextNode(config);
      }

      // If this is already a DOM element, just return it;
      if (config.tagName || (config[0] && config[0].tagName)) return config;

      // parameters with special meanings
      var children   = config.children,
          tag        = config.tag,
          html       = config.html,
          text       = config.text,
          events     = config.on,
          className  = config.c;

      // Don't want these getting through as attributes
      delete config.children;
      delete config.tag;
      delete config.on;
      delete config.c;
      delete config.html;
      delete config.text;

      var el = createElement(tag || 'div');

      if (className) {
         el.attr('class', className);
      }

      if (html) {
         el.html(html);
      }

      if (text) {
         el.append(createElements(text));
      }

      for (var k in config) {
         if (!hasOwnProperty(config, k))
            continue;

         el.attr(k, config[k]);
      }

      if (children) {
         for (var i = 0; i < children.length; i++) {
            el.append(createElements(children[i]));
         }
      }

      if (events) {
         for (var eventName in events) {
            el.on(eventName, events[eventName]);
         }
      }

      return el;
   }

   function createElement(tag){
      return $(document.createElement(tag));
   }

   function getImageSizeWiderThan(width, urls) {
      var largestExistingSize;
      for (var i=0; i< imageSizes.length; i++) {
         if (urls[imageSizes[i].name]){
            largestExistingSize = imageSizes[i].name;
            if (imageSizes[i].width > width) { 
               return imageSizes[i].name;
            }
         }
      }
      return largestExistingSize;
   }
})();
