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
This introduced a double rendering problem, I'm certain multiple state setters are going off, but I'm not certain how to handle it.

# Project notes
## Jest config
Make sure you copy the jest config file to your project, or it trips when it tries to use Typescript.
