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
         children: [createMedia(step), createSideBar(step)]
      })

      this.getElement = function() {
         return element
      }
   }

   function createSideBar(step) {
      var thumbs = createThumbnails(step)
      var stepText = createStepText(step)
      return createElements({
         c: 'side-bar',
         children: [thumbs, stepText]
      });
   }

   function createStepText(step) {
      var lines = _.map(step.lines, function(line) {
         return createElements({
            tag: 'p',
            html: line.text_rendered
         })
      })
      return createElements({
         c: 'step-lines',
         children: lines
      })
   }

   function createThumbnails(step) {
      var thumbs = _.map(step.media.data, function(image) { 
         return createElements({
            tag: 'img',
            c: 'thumb',
            src: image.thumbnail
         })
      })
      return createElements({
         c: 'step-thumbs',
         children: thumbs
      })
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
            src: step.media.data[0].medium
         })]
      })
   }
})(window)
