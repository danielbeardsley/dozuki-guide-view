Dozuki.GuideView = function (guide) {
   var utils = Dozuki.utils,
       createElements = utils.createElements,
       stepElements = [],
       stepController;
   this.guide = guide;

   $('body').append(createUI());

   function createUI() {
      var container = createElements({
         tag: 'div',
         c: 'guide-view'
      })
      stepController = new Dozuki.StepsController(
         guide.steps,
         container);
      new Dozuki.Transitions.classBased(stepController);

      container.append(createTopBar());
      new Dozuki.KeyboardControl(stepController);
      new Dozuki.FullScreen(container);
      stepController.on('stepChange', function(number) {
         Dozuki.utils.adjustAllResponsiveImages();
      });
      stepController.showNext(
         function() {$('#loading').addClass('fade')});

      var resizeResponsiveImages = _.debounce(
       Dozuki.utils.adjustAllResponsiveImages, 500);
      $(window).resize(resizeResponsiveImages);

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
      stepController.on('stepChange', function(number) {
         $('#stepNumber').text(number);
      });
      $('#stepCount').text(guide.steps.length);
      return $('#header')
      .on('click', '.previous', function() {stepController.showPrev();})
      .on('click', '.next',     function() {stepController.showNext();});
   }
};

Dozuki.Transitions = {
   immediate: function (stepController) {
      stepController.on('stepChange',
      function (number, fromStep, toStep) {
         if (fromStep) fromStep.getElement().hide();
         toStep.getElement().show();
      });
   },
   classBased: function (stepController) {
      stepController.on('stepChange',
      function (number, fromStep, toStep, direction) {
         if (fromStep) {
            setClass(fromStep, direction * -1);
         }
         setClass(toStep, 0);
      });
      stepController.on('stepPreload',
      function (step, direction) {
         setClass(step, direction);
      });

      function setClass(step, direction) {
         var element = step.getElement();
         element.removeClass('backward current forward');
         element.addClass(direction == 0 ?
                          'current' :
                          (direction > 0 ? 'forward' : 'backward'));
         element.show();
      }
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
Dozuki.StepsController = function(steps, containerEl) {
   var self = this;
   var renderedSteps = {};
   var currentStepNumber = -1;

   function show(number, direction, callback) {
      var fromStep = getStep(currentStepNumber);
      var toStep = getStep(number);
      currentStepNumber = number;
      self.trigger('stepChange', number+1, fromStep, toStep, direction);
      if (callback)
         setTimeout(callback, 200);
   }

   this.show = show;

   this.showNext =
   function showNext(callback) {
      var number = currentStepNumber + 1;
      if (number >= steps.length)
         return; 
      preloadStep(number + 1, +1)
      show(number, +1, callback);
   }

   this.showPrev =
   function showPrev() {
      var number = currentStepNumber - 1;
      if (number < 0)
         return; 
      preloadStep(number - 1, -1)
      show(number, -1);
   }

   function getStep(number) {
      if (number < 0 || number >= steps.length) return null;

      var step = renderedSteps[number];
      if (step) return step;

      step = renderedSteps[number] = new GuideStep(steps[number]);
      var stepEl = step.getElement();
      stepEl.hide();
      containerEl.append(stepEl);
      return step;
   }

   /**
    * Load the resources needed for the provided step. Effectively just add it
    * to the DOM
    */
   function preloadStep(number, direction) {
      var step = getStep(number);
      if (step) {
         self.trigger('stepPreload', step, direction);
      }
   }
}

Dozuki.utils.eventize(Dozuki.StepsController);

Dozuki.KeyboardControl = function(stepsController) {
   $(document).keyup(function(event) {
      switch (event.which) {
         case 37: stepsController.showPrev();
            break;
         case 39: stepsController.showNext();
            break;
      }
   });
}

Dozuki.FullScreen = function(container) {
   var element = container[0];
   var expandControl = $(Dozuki.utils.html(
      '<span class="fa-stack fa-lg fullscreen">\
         <i class="fa fa-square-o fa-stack-2x"></i>\
         <i class="fa fa-expand fa-stack-1x"></i>\
      </span>'));
   expandControl.click(fullScreen);
   container.children('#header').append(expandControl);

   function fullScreen() {
      var propName = 'RequestFullScreen';
      var func = element['moz' + propName] ||
                 element['ms' + propName] ||
                 element['webkit' + propName] ||
                 element[propName];
      if (func) {
         func.call(element);
      }
   }
}
