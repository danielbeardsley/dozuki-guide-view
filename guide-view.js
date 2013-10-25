Dozuki.GuideView = function (guide) {
   var utils = Dozuki.utils,
       createElements = utils.createElements,
       stepElements = []
   this.guide = guide;

   $$('body').append(createUI());

   function createUI() {
      var children = createSteps()
      // Temporarily hide the intro during development
      // children.splice(0,0,createIntro());
      children.push(createTopBar())
      return createElements({
         tag: 'div',
         c: 'guide-view',
         children: children.reverse()
      })
   }

   function createSteps() {
      // For the time being, just grab the first step
      var steps = [guide.steps[0]];
      return _.map(steps, function(step) {
         return new GuideStep(step).getElement();
      })
   }

   function createIntro() {
      return createElements({
         html:  guide.introduction_rendered
      })
   }

   function createTopBar() {
      return createElements({
         tag: 'header',
         children: [{
            tag:  'a',
            c:    'previous',
            text: '< Previous Step'
         },{
            tag:  'a',
            c:    'next',
            text: 'Next Step >'
         }]
      });
   }
};

