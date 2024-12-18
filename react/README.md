# 7 kata tasks
https://eugenkiss.github.io/7guis/tasks/

## Counter
Setting up the project, learning enough of React to get started.

## Temperature Converter
Fahr-en-heit: Spelling the name was hard.

Test cases were fun to math my way around.

## Flight Booker
The most difficult part was writing enough test cases to separate the logic. There's difficulty in separating the pure logic from what to display.

Right now keep the front end as dumb as possible, so I don't have to test inputs.

## Timer
I was almost done when I noticed a surprise requirement: The timer has to stop when it maxes out and start once the duration is increased.
UseEffect when you need an external system (like a timer).
Also, in the Use Effect you need to delete the timer - JavaScript scopes the timer outside the page so rerendering will not get rid of it.

## CRUD
Finally.
Lots of testing but otherwise it's looking good.
I just need to design and css it.

## Circle Drawer
I'm not doing right clicks. Just click in the circle to draw the diagram.

### Undo/Redo
Keep a stack of undo operations (last operation is the first one to remove).
Each operation has the way to do it and a way to undo it (so radius change needs to store the radius before the change.)

When you add a new operation, clear the redo stack.

When it's time to undo something, pop the undo stack, apply the undo method, and push it onto the redo stack.

When it's time to redo, pop the redo stack, reapply the action method, and push it onto the undo stack.

### Rendering in Canvas
Had to cobble information about React, TypeScript and canvas.

- useRef gives a handle that React can track in a useEffect.
- TypeScript has event handlers. You need to specify the correct types.
- canvas isn't too bad to mess with, but you're limited to Rectangles and Circles as primitives. Keep that in mind when rendering custom shapes and the performance hit they cause.

### Visual Testing in Playwright
The built-in way compares a screenshot to the one with the same name in your test folder.
- If you haven't generated one, the test fails and generates it for you.
- If your app changes, it will notice a difference and fail the test.

But it doesn't really know what it should expect - Playwright only sees a canvas element when it messes with the DOM.
Visual Testing is brittle as a result.
- I can't just write out my expectations.
- Different browsers, hardware and OSes will produce different screenshots.
- "toHaveScreenshot" is an odd name for "compare to known screenshot and complain if the difference is too great."

### Research
- MDN canvas tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
- Canvas in React: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
- Playwright Canvas testing: https://stackoverflow.com/questions/77184584/how-to-use-playwright-to-simulate-the-click-event-on-a-canvas-element
- Playwright testing using AI model detection: https://medium.com/@BioCatchTechBlog/automating-canvas-testing-with-playwright-and-object-detection-models-8d58235b17b7
- Playwright visual comparisons: https://playwright.dev/docs/test-snapshots

# Project notes
## Jest config
Make sure you copy the jest config file to your project, or it trips when it tries to use Typescript.
