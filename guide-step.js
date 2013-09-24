(function(window) {
   var utils = Dozuki.utils,
       c = utils.className,
       createElements = utils.createElements

   window.GuideStep = function(step) {
      this.data = step
      console.log(step)
      var element = createElements({
         tag: 'section',
         c: "guide-step",
         children: [createMedia(step)]
      })

      this.getElement = function() {
         return element
      }
   }

   function createMedia(step) {
      var media = step.media;
      if (media.type == 'image') {
         return createImages(step);
      } else {
         return "a video";
      }
   }

   function createImages(step) {
      return createElements({
         c: 'large-media',
         children: [createElements({
            tag: 'img',
            src: step.media.data[0].standard
         })]
      })
   }
})(window)
