(function(window) {
   var utils = Dozuki.utils,
       c = utils.className,
       createElements = utils.createElements

   window.GuideStep = function(step) {
      this.data = step
      console.log(step)
      var element = createElements({
         tag: 'section',
         c: c("guide"),
         text: "Blah"
      })

      this.getElement = function() {
         return element
      }
   }
})(window)
