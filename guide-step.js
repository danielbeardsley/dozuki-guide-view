(function(window) {
   var c = Dozuki.utils.className;

   window.GuideStep = function(step) {
      this.data = step;
      var element = createElements({
         tag: 'section',
         c: c("guide"),
         text: "Blah"
      });
   }
})(window)
