Dozuki.utils = (function() {
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

   return {
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
      createElements: function createElements(config){
         if (typeof(config) === 'string') {
            return document.createTextNode(config);
         }

         // If this is already a DOM element, just return it;
         if (config.tagName) return config;

         // parameters with special meanings
         var children   = config.children,
             tag        = config.tag,
             html       = config.html,
             className  = config.c;

         // Don't want these getting through as attributes
         delete config.children;
         delete config.tag;
         delete config.c;
         delete config.html;

         var el = createElement(tag || 'div');

         if (className) {
            el.className = className;
         }

         if (html) {
            el.innerHTML = html;
         }

         for (var k in config) {
            if (!hasOwnProperty(config, k))
               continue;

            el.setAttribute(k, config[k]);
         }

         if (children) {
            for (var i = 0; i < children.length; i++) {
               el.appendChild(createElements(children[i]));
            }
         }

         return el;
      },

      hasOwnProperty: hasOwnProperty,

      className: function (name) {
         return "dozuki-" + name;
      }
   };

   function createElement(tag){
      return document.createElement(tag);
   }
})();
