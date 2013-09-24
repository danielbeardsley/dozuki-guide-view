Dozuki.GuideView = function (guide) {
   var utils = Dozuki.utils,
       createElements = utils.createElements,
       stepElements = []
   this.guide = guide;

   $$('body').append(createUI());

   function createUI() {
      var children = createSteps()
      children.splice(0,0,createIntro());
      return createElements({
         tag: 'div',
         c: 'guide-view',
         children: children.reverse()
      })
   }

   function createSteps() {
      return _.map(guide.steps, function(step) {
         return new GuideStep(step).getElement();
      })
   }

   function createIntro() {
      return createElements({
         html:  guide.introduction_rendered
      })
   }
};

