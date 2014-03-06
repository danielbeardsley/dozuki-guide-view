(function(window) {
   var utils = Dozuki.utils,
       c = utils.className,
       createElements = utils.createElements

   window.GuideStep = function(step) {
      this.data = step
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

   /**
    * Creates and returns a series of nested UL/LI tags that represent the step
    * lines.
    */
   function createStepText(step) {
      return utils.render(
      '<ul class="step-lines"> \
      {{#lines}} \
         <li class="step-line indent-{{level}}">{{&text_rendered}}</li> \
      {{/lines}} \
      </ul>', step);
   }

   function createThumbnails(step) {
      var thumbs = _.map(step.media.data, function(image) { 
         return utils.responsiveImage({
            c: 'thumb',
            initialWidth: 150
         }, image, 'step-thumb')
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
         
         children: [utils.responsiveImage({
            id: 'step-media-' + step.stepid,
            useParentWidth: true,
            initialWidth: document.body.clientWidth
         }, step.media.data[0], 'step-image')]
      })
   }
})(window)
