Dozuki.GuideView = function (guide) {
   var utils = Dozuki.utils,
       createElements = utils.createElements,
       stepElements = [],
       stepController;
   this.guide = guide;

   $$('body').append(createUI());

   function createUI() {
      var container = createElements({
         tag: 'div',
         c: 'guide-view',
         children: [createTopBar()]
      })
      stepController = new Dozuki.StepsController(
         guide.steps,
         container,
         Dozuki.Transitions.immediate);
      stepController.show(0);
      return container;
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
      var prev = createElements({
         tag:  'a',
         c:    'previous',
         text: '< Previous Step',
         on: {
            click: function() { stepController.showPrev(); }
         }
      });
      var next = createElements({
         tag:  'a',
         c:    'next',
         text: 'Next Step >',
         on: {
            click: function() { stepController.showNext(); }
         }
      });
      return createElements({
         tag: 'header',
         children: [prev,next]
      });
   }
};

Dozuki.Transitions = {
   immediate: function immediateTransition(fromStep, toStep) {
      if (fromStep) fromStep.getElement().hide();
      toStep.getElement().show();
   }
}

/**
 * Represents a collection of rendered steps.
 *
 * Exposes methods to show a particular step, advance or retreate to the next
 * step, and allows for a custom transition function.
 *
 * @param steps 0-based array of step objects straight from the API
 * @param transitionFunc function(from, to) where both from and to are
 *        GuideStep objects. This function should transition the UI from one
 *        step to another.
 */
Dozuki.StepsController = function(steps, containerEl, transitionFunction) {
   var renderedSteps = {};
   var currentStepNumber = -1;

   function show(number) {
      var fromStep = getStep(currentStepNumber);
      var toStep = getStep(number);
      transitionFunction(fromStep, toStep);
      currentStepNumber = number;
   }
   this.show = show;

   this.showNext =
   function showNext() {
      if (currentStepNumber >= steps.length)
         return; 
      show(currentStepNumber + 1);
   }

   this.showPrev =
   function showPrev() {
      if (currentStepNumber <= 0)
         return; 
      show(currentStepNumber - 1);
   }

   function getStep(number) {
      if (number < 0 || number >= steps.length) return null;

      var step = renderedSteps[number];
      if (step) return step;

      step = renderedSteps[number] = new GuideStep(steps[number]);
      var stepEl = step.getElement();
      stepEl.hide();
      $$(containerEl).append(stepEl);
      return step;
   }
}

