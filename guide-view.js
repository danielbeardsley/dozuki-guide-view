Dozuki.GuideView = function (guide) {
   this.guide = guide;
   var stepElemets = [];

   for (var i=0; i< guide.steps.length; i++) {
      var guideStep = new GuideStep(guide.steps[i]);
      stepElemets.push(guideStep.getElement());
   }

   var root = createElements({
      tag: 'div',
      c: 'guide-view',
      children: stepElemets
   });
};

