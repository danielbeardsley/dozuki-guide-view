Dozuki.GuideView = function (guide) {
   var utils = Dozuki.utils,
       createElements = utils.createElements,
       stepElements = []
   this.guide = guide;

   var root = createElements({
      tag: 'div',
      c: 'guide-view',
      children: createSteps()
   })

   $$('body').append(root);

   function createSteps() {
      return _.map(guide.steps, function(step) {
         return new GuideStep(step).getElement();
      })
   }

   function createIntro() {

   }
};

