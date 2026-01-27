/*
how to see changes:

localStorage.clear();
location.reload(true);
*/

const container = document.getElementById('hexes-list');
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search...';
searchInput.id = 'search-box';
searchInput.className = 'search-bar';
container.parentElement.insertBefore(searchInput, container);

let hexesData = JSON.parse(localStorage.getItem('hexesData')) || [
  {
    path: 'hexes/mindsreflection.png',
    name: "Mind's Reflection",
    description: 'Adds me, the caster, to the stack.',
    inputs: [''],
    outputs: ['Entity']
  },
  {
    path: 'hexes/compasspurification.png',
    name: "Compass' Purification",
    description: 'Transforms an entity on the stack into the position of its eyes. I should probably use this on myself.',
    inputs: ['Entity'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/compasspurificationII.png',
    name: "Compass' Purification II",
    description: 'Transforms an entity on the stack into the position it is standing. I should probably use this on other entities.',
    inputs: ['Entity'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/alidadespurification.png',
    name: "Alidade's Purification",
    description: 'Transforms an entity on the stack into the direction it\'s looking in, as a unit vector.',
    inputs: ['Entity'],
    outputs: ['Vector']
  },
    {
    path: 'hexes/archersdistillationpng',
    name: "Archer's Distillation",
    description: 'Combines two vectors (a position and a direction) into the answer to the question: If I stood at the position and looked in the direction, what block would I be looking at? Costs a negligible amount of media.',
    extra: 'If it doesn\'t hit anything, the vectors will combine into Null. A common sequence of patterns, the so-called raycast mantra, is Mind\'s Reflection, Compass\' Purification, Mind\'s Reflection, Alidade Purification, Archer\'s Distillation. Together, they return the vector position of the block I am looking at.',
    inputs: ['Vector', 'Vector'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/architectsdistillation.png',
    name: "Architect's Distillation",
    description: 'Like Archer\'s Distillation, but instead returns a vector representing the answer to the question: Which side of the block am I looking at? Costs a negligible amount of media.',
    extra: 'More specifically, it returns the normal vector of the face hit, or a unit vector pointing perpendicular to the face. If I am looking at a floor, it will return (0, 1, 0). If I am looking at the south face of a block, it will return (0, 0, 1).',
    inputs: ['Vector', 'Vector'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/scoutsdistillation.png',
    name: "Scout's Distillation",
    description: 'Like Archer\'s Distillation, but instead returns the entity I am looking at. Costs a negligible amount of media.',
    inputs: ['Vector', 'Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/reveal.png',
    name: "Reveal",
    description: 'Displays the top iota of the stack to me.',
    inputs: ['Any'],
    outputs: ['Any']
  },
  {
    path: 'hexes/stadiometersPurificationpng',
    name: "Stadiometer's Purification",
    description: 'Transforms an entity on the stack into its height.',
    inputs: ['Entity'],
    outputs: ['Num']
  },
  {
    path: 'hexes/pacepurification.png',
    name: "Pace Purification",
    description: 'Transforms an entity on the stack into the direction in which it\'s moving, with the speed of that movement as that direction\'s magnitude.',
    inputs: ['Entity'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/numericalreflection.png',
    name: "Numerical Reflection",
    description: 'Irritatingly, there is no easy way to draw numbers. Here is the method Nature deigned to give us.',
    extra: 'First, I draw one of the two shapes shown on the other page. Next, the angles following will modify a running count starting at 0.\nForward: Add 1\nLeft: Add 5\nRight: Add 10\nSharp Left: Multiply by 2\nSharp Right: Divide by 2.\nThe clockwise version of the pattern, on the right of the other page, will negate the value at the very end. (The left-hand counter-clockwise version keeps the number positive).\nOnce I finish drawing, the number\'s pushed to the top of the stack.',
    inputs: ['Entity'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/additivedistillation.png',
    name: "Additive Distillation",
    description: 'Perform addition.',
    extra: 'As such:\n\nWith two numbers at the top of the stack, combines them into their sum.\nWith a number and a vector, removes the number from the stack and adds it to each element of the vector.\nWith two vectors, combines them by summing corresponding components into a new vector (i.e. (1, 2, 3) + (0, 4, -1) = (1, 6, 2)).',
    inputs: ['Num|Vector', 'Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/subtractivedistillation.png',
    name: "Subtractive Distillation",
    description: 'Perform subtraction.',
    extra: 'As such:\n\nWith two numbers at the top of the stack, combines them into their difference.\nWith a number and a vector, removes the number from the stack and subtracts it from each element of the vector.\nWith two vectors, combines them by subtracting each component.\nIn all cases, the top of the stack or its components are subtracted from the second-from-the-top.',
    inputs: ['Num|Vector', 'Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/multiplicativedistillation.png',
    name: "Multiplicative Distillation",
    description: 'Perform multiplication or the dot product.',
    extra: 'As such:\n\nWith two numbers, combines them into their product.\nWith a number and a vector, removes the number from the stack and multiplies each component of the vector by that number.\nWith two vectors, combines them into their dot product.',
    inputs: ['Num|Vector', 'Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/divisiondistillation.png',
    name: "Division Distillation",
    description: 'Perform division or the cross product.',
    extra: 'As such:\n\nWith two numbers, combines them into their quotient.\nWith a number and a vector, removes the number and divides each element of the vector by it.\nWith two vectors, combines them into their cross product.\nIn the first and second cases, the second-from-the-top of the stack is divided by the top of the stack.\n\nWARNING: Never divide by zero!',
    inputs: ['Num|Vector', 'Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/lengthpurification.png',
    name: "Length Purification",
    description: 'Compute the absolute value or length.',
    extra: 'Replaces a number with its absolute value, or a vector with its length.',
    inputs: ['Num|Vector'],
    outputs: ['Num']
  },
  {
    path: 'hexes/powerdistillation.png',
    name: "Power Distillation",
    description: 'Perform exponentiation or vector projection.',
    extra: 'With two numbers, combines them by raising the first to the power of the second.\nWith a number and a vector, removes the number and raises each component of the vector to the number\'s power.\nWith two vectors, combines them into the vector projection of the top of the stack onto the second-from-the-top.\nIn the first and second cases, the first argument or its components are the base, and the second argument or its components are the exponent.',
    inputs: ['Num|Vector', 'Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/floorpurification.png',
    name: "Floor Purification",
    description: '"Floors" a number, cutting off the fractional component and leaving an integer value. If passed a vector, instead floors each of its components.',
    inputs: ['Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/ceilingpurification.png',
    name: "Ceiling Purification",
    description: '"Ceilings" a number, raising it to the next integer value if it has a fractional component. If passed a vector, instead ceils each of its components.',
    inputs: ['Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/vectorexaltation.png',
    name: "Vector Exaltation",
    description: 'Combine three numbers at the top of the stack into a vector\'s X, Y, and Z components (bottom to top).',
    inputs: ['Num', 'Num', 'Num'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/vectordisintegration.png',
    name: "Vector Disintegration",
    description: 'Split a vector into its X, Y, and Z components (bottom to top).',
    inputs: ['Vector'],
    outputs: ['Num', 'Num', 'Num']
  },
  {
    path: 'hexes/modulusdistillation.png',
    name: "Modulus Distillation",
    description: 'Takes the modulus of two numbers. This is the amount remaining after division - for example, 5 % 2 is 1, and 5 % 3 is 2. When applied on vectors, performs the above operation elementwise.',
    inputs: ['Num|Vector', 'Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/axialpurification.png',
    name: "Axial Purification",
    description: 'For a vector, coerce it to its nearest axial direction, a unit vector. For a number, return the sign of the number; 1 if positive, -1 if negative. In both cases, zero is unaffected.',
    inputs: ['Num|Vector'],
    outputs: ['Num|Vector']
  },
  {
    path: 'hexes/entropyreflection.png',
    name: "Entropy Reflection",
    description: 'Creates a random number between 0 and 1.',
    inputs: [''],
    outputs: ['Num']
  },
  {
    path: 'hexes/truereflection.png',
    name: "True Reflection",
    description: 'Adds True to the top of the stack.',
    inputs: [''],
    outputs: ['Bool']
  },
  {
    path: 'hexes/falsereflection.png',
    name: "False Reflection",
    description: 'Adds False to the top of the stack.',
    inputs: [''],
    outputs: ['Bool']
  },
  {
    path: 'hexes/nullaryreflection.png',
    name: "Nullary Reflection",
    description: 'Adds the Null influence to the top of the stack.',
    inputs: [''],
    outputs: ['Null']
  },
  {
    path: 'hexes/vectorreflectionzero.png',
    name: "Vector Reflection Zero",
    description: 'Adds (0, 0, 0) to the stack.',
    inputs: [''],
    outputs: ['Vector']
  },
  {
    path: 'hexes/vectorreflection+x-x.png',
    name: "Vector Reflection +X/-X",
    description: 'The left-hand counter-clockwise pattern adds (1, 0, 0) to the stack; the right-hand clockwise pattern adds (-1, 0, 0).',
    inputs: [''],
    outputs: ['Vector']
  },
  {
    path: 'hexes/vectorreflection+y-y.png',
    name: "Vector Reflection +Y/-Y",
    description: 'The left-hand counter-clockwise pattern adds (0, 1, 0) to the stack; the right-hand clockwise pattern adds (0, -1, 0).',
    inputs: [''],
    outputs: ['Vector']
  },
  {
    path: 'hexes/vectorreflection+z-z.png',
    name: "Vector Reflection +Z/-Z",
    description: 'The left-hand counter-clockwise pattern adds (0, 0, 1); the right-hand clockwise pattern adds (0, 0, -1).',
    inputs: [''],
    outputs: ['Vector']
  },
  {
    path: 'hexes/circlesreflection.png',
    name: "Circle's Reflection",
    description: 'Adds τ, the radial representation of a complete circle, to the stack.',
    inputs: [''],
    outputs: ['Num']
  },
  {
    path: 'hexes/arcsreflection.png',
    name: "Arc's Reflection",
    description: 'Adds π, the radial representation of half a circle, to the stack.',
    inputs: [''],
    outputs: ['Num']
  },
  {
    path: 'hexes/eulersreflection.png',
    name: "Euler's Reflection",
    description: 'Adds e, the base of natural logarithms, to the stack.',
    inputs: [''],
    outputs: ['Num']
  },
  {
    path: 'hexes/novicesgambit.png',
    name: "Novice's Gambit",
    description: "Removes the first iota from the stack.",
    extra: "This seems to be a special case of Bookkeeper's Gambit.",
    inputs: ['Any'],
    outputs: ['']
  },
  {
    path: 'hexes/jestersgambit.png',
    name: "Jester's Gambit",
    description: 'Swaps the two iotas of the stack',
    inputs: ['Any', 'Any'],
    outputs: ['Any', 'Any']
  },
  {
    path: 'hexes/rotationgambit.png',
    name: "Rotation Gambit",
    description: 'Yanks the iota third from the top of the stack to the top. [0, 1, 2] becomes [1, 2, 0].',
    inputs: ['Any', 'Any', 'Any'],
    outputs: ['Any', 'Any', 'Any']
  },
  {
    path: 'hexes/geminidecomposition.png',
    name: "Gemini Decomposition",
    description: 'Duplicates the top iota of the stack.',
    inputs: ['Any'],
    outputs: ['Any', 'Any']
  },
  {
    path: 'hexes/prospectorsgambit.png',
    name: "Prospector's Gambit",
    description: 'Copy the second-to-last iota of the stack to the top. [0, 1] becomes [0, 1, 0].',
    inputs: ['Any', 'Any'],
    outputs: ['Any', 'Any', 'Any']
  },
  {
    path: 'hexes/undertakersgambit.png',
    name: "Undertaker's Gambit",
    description: 'Copy the top iota of the stack, then put it under the second iota. [0, 1] becomes [1, 0, 1].',
    inputs: ['Any', 'Any'],
    outputs: ['Any', 'Any', 'Any']
  },
  {
    path: 'hexes/geminigambit.png',
    name: "Gemini Gambit",
    description: 'Removes the number at the top of the stack, then copies the top iota of the stack that number of times. (A count of 2 results in two of the iota on the stack, not three.)',
    inputs: ['Any', 'Num'],
    outputs: ['Many']
  },
  {
    path: 'hexes/dioscurigambit.png',
    name: "Dioscuri Gambit",
    description: 'Copy the top two iotas of the stack. [0, 1] becomes [0, 1, 0, 1].',
    inputs: ['Any', 'Any'],
    outputs: ['Any', 'Any', 'Any', 'Any']
  },
  {
    path: 'hexes/flocksreflection.png',
    name: "Flock's Reflection",
    description: 'Pushes the size of the stack as a number to the top of the stack. (For example, a stack of [0, 1] will become [0, 1, 2].)',
    inputs: [''],
    outputs: ['Num']
  },
  {
    path: 'hexes/fishermansgambit.png',
    name: "Fisherman's Gambit",
    description: 'Grabs the element in the stack indexed by the number and brings it to the top. If the number is negative, instead moves the top element of the stack down that many elements.',
    inputs: ['Num'],
    outputs: ['Any']
  },
  {
    path: 'hexes/fishermansgambitII.png',
    name: "Fisherman's Gambit II",
    description: 'Like Fisherman\'s Gambit, but instead of moving the iota, copies it.',
    inputs: ['Num'],
    outputs: ['Any']
  },
  {
    path: 'hexes/bookkeepersgambit.png',
    name: "Bookkeeper's Gambit",
    description: 'An infinite family of actions that keep or remove elements at the top of the stack based on the sequence of dips and lines.',
    extra: 'Assuming that I draw a Bookkeeper\'s Gambit pattern left-to-right, the number of iotas the action will require is determined by the horizontal distance covered by the pattern. From deepest in the stack to shallowest, a flat line will keep the iota, whereas a triangle dipping down will remove it.\nIf my stack contains 0, 1, 2 from deepest to shallowest, drawing the first pattern opposite will give me 1, the second will give me 0, and the third will give me 0, 2 (the 0 at the bottom is left untouched).',
    inputs: ['Many'],
    outputs: ['Many']
  },
  {
    path: 'hexes/swindlersgambit.png',
    name: "Swindler's Gambit",
    description: 'Rearranges the top elements of the stack based on the given numerical code, which is the index of the permutation wanted.',
    extra : 'Although I can\'t pretend to know the mathematics behind calculating this permutation code, I have managed to dig up an extensive chart of them, enumerating all permutations of up to six elements.\nIf I wish to do further study, the key word is "Lehmer Code."',
    inputs: ['Many', 'Num'],
    outputs: ['Many']
  },
  {
    path: 'hexes/augurspurification.png',
    name: "Augur's Purification",
    description: 'Convert an argument to a boolean. The number 0, Null, False, and the empty list become False; everything else becomes True.',
    inputs: ['Any'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/lengthpurification.png',
    name: "Length Purification",
    description: 'Convert a boolean to a number; True becomes 1, and False becomes 0.',
    inputs: ['Bool'],
    outputs: ['Num']
  },
  {
    path: 'hexes/negationpurification.png',
    name: "Negation Purification",
    description: 'If the argument is True, return False; if it is False, return True.',
    inputs: ['Bool'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/disjunctiondistillation.png',
    name: "Disjunction Distillation",
    description: 'Returns True if at least one of the arguments are True; otherwise returns False.',
    inputs: ['Bool', 'Bool'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/conjunctiondistillation.png',
    name: "Conjunction Distillation",
    description: 'Returns True if both arguments are true; otherwise returns False.',
    inputs: ['Bool', 'Bool'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/exclusiondistillation.png',
    name: "Exclusion Distillation",
    description: 'Returns True if exactly one of the arguments is true; otherwise returns False.',
    inputs: ['Bool', 'Bool'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/augursexaltation.png',
    name: "Augur's Exaltation",
    description: 'If the first argument is True, keeps the second and discards the third; otherwise discards the second and keeps the third.',
    inputs: ['Bool', 'Any', 'Any'],
    outputs: ['Any']
  },
  {
    path: 'hexes/equalitydistillation.png',
    name: "Equality Distillation",
    description: 'If the first argument equals the second (within a small tolerance), return True. Otherwise, return False.',
    inputs: ['Any', 'Any'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/inequalitydistillation.png',
    name: "Inequality Distillation",
    description: 'If the first argument does not equal the second (outside a small tolerance), return True. Otherwise, return False.',
    inputs: ['Any', 'Any'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/maximusdistillation.png',
    name: "Maximus Distillation",
    description: 'If the first argument is greater than the second, return True. Otherwise, return False.',
    inputs: ['Num', 'Num'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/minimusdistillation.png',
    name: "Minimus Distillation",
    description: 'If the first argument is less than the second, return True. Otherwise, return False.',
    inputs: ['Num', 'Num'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/maximusdistillationII.png',
    name: "Maximus Distillation II",
    description: 'If the first argument is greater than or equal to the second, return True. Otherwise, return False.',
    inputs: ['Num', 'Num'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/minimusdistillationII.png',
    name: "Minimus Distillation II",
    description: 'If the first argument is less than or equal to the second, return True. Otherwise, return False.',
    inputs: ['Num', 'Num'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/entitypurification.png',
    name: "Entity Purification",
    description: "Transform the position on the stack into the entity at that location (or Null if there isn't one).",
    inputs: ['Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/entitypurificationanimal.png',
    name: "Entity Purification: Animal",
    description: "Transform the position on the stack into the animal at that location (or Null if there isn't one).",
    inputs: ['Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/entitypurificationmonster.png',
    name: "Entity Purification: Monster",
    description: "Transform the position on the stack into the monster at that location (or Null if there isn't one).",
    inputs: ['Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/entitypurificationitem.png',
    name: "Entity Purification: Item",
    description: "Transform the position on the stack into the dropped item at that location (or Null if there isn't one).",
    inputs: ['Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/entitypurificationplayer.png',
    name: "Entity Purification: Player",
    description: "Transform the position on the stack into the player at that location (or Null if there isn't one).",
    inputs: ['Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/entitypurificationliving.png',
    name: "Entity Purification: Living",
    description: "Transform the position on the stack into the living creature at that location (or Null if there isn't one).",
    inputs: ['Vector'],
    outputs: ['Entity']
  },
  {
    path: 'hexes/zonedistillationanimal.png',
    name: "Zone Distillation: Animal",
    description: "Take a position and maximum distance on the stack, and combine them into a list of animals near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationnonanimal.png',
    name: "Zone Distillation.: Non-Animal",
    description: "Take a position and maximum distance on the stack, and combine them into a list of non-animal entities near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationmonster.png',
    name: "Zone Distillation: Monster",
    description: "Take a position and maximum distance on the stack, and combine them into a list of monsters near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationnonmonster.png',
    name: "Zone Distillation: Non-Monster",
    description: "Take a position and maximum distance on the stack, and combine them into a list of non-monster entities near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationitem.png',
    name: "Zone Distillation: Item",
    description: "Take a position and maximum distance on the stack, and combine them into a list of dropped items near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationnonitem.png',
    name: "Zone Distillation: Non-Item",
    description: "Take a position and maximum distance on the stack, and combine them into a list of non-dropped-item entities near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationplayer.png',
    name: "Zone Distillation: Player",
    description: "Take a position and maximum distance on the stack, and combine them into a list of players near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationnonplayer.png',
    name: "Zone Distillation: Non-Player",
    description: "Take a position and maximum distance on the stack, and combine them into a list of non-player characters near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationliving.png',
    name: "Zone Distillation: Living",
    description: "Take a position and maximum distance on the stack, and combine them into a list of living creatures near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationnonliving.png',
    name: "Zone Distillation: Non-Living",
    description: "Take a position and maximum distance on the stack, and combine them into a list of non-living entities near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/zonedistillationany.png',
    name: "Zone Distillation: Any",
    description: "Take a position and maximum distance on the stack, and combine them into a list of all entities near the position.",
    inputs: ['Vector', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/selectiondistillation.png',
    name: "Selection Distillation",
    description: "Remove the number at the top of the stack, then replace the list at the top with the nth element of that list (where n is the number you removed). Replaces the list with Null if the number is out of bounds.",
    inputs: ['List', 'Num'],
    outputs: ['Any']
  },
  {
    path: 'hexes/selectionexaltation.png',
    name: "Selection Exaltation",
    description: "Remove the two numbers at the top of the stack, then take a sublist of the list at the top of the stack between those indices, lower bound inclusive, upper bound exclusive. For example, the 0, 2 sublist of [0, 1, 2, 3, 4] would be [0, 1].",
    inputs: ['List', 'Num', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/integrationdistillation.png',
    name: "Integration Distillation",
    description: "Remove the top of the stack, then add it to the end of the list at the top of the stack.",
    inputs: ['List', 'Any'],
    outputs: ['List']
  },
  {
    path: 'hexes/derivationdecomposition.png',
    name: "Derivation Decomposition",
    description: "Remove the iota on the end of the list at the top of the stack, and add it to the top of the stack.",
    inputs: ['List'],
    outputs: ['List', 'Any']
  },
  {
    path: 'hexes/additivedistillation.png',
    name: "Additive Distillation",
    description: "Remove the list at the top of the stack, then add all its elements to the end of the list at the top of the stack.",
    inputs: ['List', 'List'],
    outputs: ['List']
  },
  {
    path: 'hexes/vacantreflection.png',
    name: "Vacant Reflection",
    description: "Push an empty list to the top of the stack.",
    inputs: [],
    outputs: ['List']
  },
  {
    path: 'hexes/singlespurification.png',
    name: "Single's Purification",
    description: "Remove the top of the stack, then push a list containing only that element.",
    inputs: ['Any'],
    outputs: ['List']
  },
  {
    path: 'hexes/lengthpurification.png',
    name: "Length Purification",
    description: "Remove the list at the top of the stack, then push the number of elements in the list to the stack.",
    inputs: ['List'],
    outputs: ['Num']
  },
  {
    path: 'hexes/retrogradepurification.png',
    name: "Retrograde Purification",
    description: "Reverse the list at the top of the stack.",
    inputs: ['List'],
    outputs: ['List']
  },
  {
    path: 'hexes/locatorsdistillation.png',
    name: "Locator's Distillation",
    description: "Remove the iota at the top of the stack, then replace the list at the top with the first index of that iota within the list (starting from 0). Replaces the list with -1 if the iota doesn't exist in the list.",
    inputs: ['List', 'Any'],
    outputs: ['Num']
  },
  {
    path: 'hexes/excisorsdistillation.png',
    name: "Excisor's Distillation",
    description: "Remove the number at the top of the stack, then remove the nth element of the list at the top of the stack (where n is the number you removed).",
    inputs: ['List', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/surgeonsexaltation.png',
    name: "Surgeon's Exaltation",
    description: "Remove the top iota of the stack and the number at the top, then set the nth element of the list at the top of the stack to that iota (where n is the number you removed). Does nothing if the number is out of bounds.",
    inputs: ['List', 'Num', 'Any'],
    outputs: ['List']
  },
  {
    path: 'hexes/flocksgambit.png',
    name: "Flock's Gambit",
    description: "Remove num elements from the stack, then add them to a list at the top of the stack.",
    inputs: ['Many', 'Num'],
    outputs: ['List']
  },
  {
    path: 'hexes/flocksdisintegration.png',
    name: "Flock's Disintegration",
    description: "Remove the list at the top of the stack, then push its contents to the stack.",
    inputs: ['List'],
    outputs: ['Many']
  },
  {
    path: 'hexes/speakersdistillation.png',
    name: "Speaker's Distillation",
    description: "Remove the top iota, then add it as the first element to the list at the top of the stack.",
    inputs: ['List', 'Any'],
    outputs: ['List']
  },
  {
    path: 'hexes/speakersdecomposition.png',
    name: "Speaker's Decomposition",
    description: "Remove the first iota from the list at the top of the stack, then push that iota to the stack.",
    inputs: ['List'],
    outputs: ['List', 'Any']
  },
  {
    path: 'hexes/consideration.png',
    name: "Consideration",
    description: "To use Consideration, I draw it, then another arbitrary pattern. That second pattern is added to the stack.",
    extra: 'One may find it helpful to think of this as "escaping" the pattern onto the stack, if they happen to be familiar with the science of computers.\nThe usual use for this is to copy the pattern to a Scroll or Slate using Scribe\'s Gambit, and then perhaps decorating with them.',
    inputs: ['Any'],
    outputs: ['Pattern']
  },
  {
    path: 'hexes/introspection.png',
    name: "Introspection",
    description: "Drawing Introspection makes my drawing of patterns act differently, for a time. Until I draw Retrospection, the patterns I draw are saved. Then, when I draw Retrospection, they are added to the stack as a list iota.",
    inputs: ['Any'],
    outputs: ['Pattern']
  },
  {
    path: 'hexes/retrospection.png',
    name: "Retrospection",
    description: "If I draw another Introspection, it'll still be saved to the list, but I'll then have to draw two Retrospections to get back to normal casting.",
    inputs: ['Any'],
    outputs: ['Pattern']
  },
  {
    path: 'hexes/evanition.png',
    name: "Evanition",
    description: "Finally, if I make a mistake while drawing patterns inside Intro- and Retrospection I can draw Evanition to remove the last pattern that I drew from the pattern list that is being constructed.",
    inputs: ['Any'],
    outputs: ['Pattern']
  },
  {
    path: 'hexes/scribesreflection.png',
    name: "Scribe's Reflection",
    description: "Copy the iota stored in the item in my other hand and add it to the stack.",
    inputs: [''],
    outputs: ['Any']
  },
  {
    path: 'hexes/scribesgambit.png',
    name: "Scribe's Gambit",
    description: "Remove the top iota from the stack, and save it into the item in my other hand.",
    inputs: ['Any'],
    outputs: ['Pattern']
  },
  {
    path: 'hexes/chroniclerspurification.png',
    name: "Chronicler's Purification",
    description: "Like Scribe's Reflection, but the iota is read out of an entity instead of my other hand.",
    inputs: ['Entity'],
    outputs: ['Any']
  },
  {
    path: 'hexes/chroniclersgambit.png',
    name: "Chronicler's Gambit",
    description: "Like Scribe's Gambit, but the iota is written to an entity instead of my other hand.",
    extra: "Interestingly enough, it looks like I cannot write my own Name using this spell. I get a sense that I might be endangered if I could.",
    inputs: ['Entity', 'Any'],
    outputs: []
  },
  {
    path: 'hexes/auditorsreflection.png',
    name: "Auditor's Reflection",
    description: "If the item in my other hand holds an iota I can read, returns True. Otherwise, returns False.",
    inputs: [''],
    outputs: ['Bool']
  },
  {
    path: 'hexes/auditorspurification.png',
    name: "Auditor's Purification",
    description: "Like Auditor's Reflection, but the readability of an entity is checked instead of my other hand.",
    inputs: ['Entity'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/assessorsreflection.png',
    name: "Assessor's Reflection",
    description: "If I could save an iota into the item in my other hand, returns True. Otherwise, returns False.",
    inputs: [''],
    outputs: ['Bool']
  },
  {
    path: 'hexes/assessorspurification.png',
    name: "Assessor's Purification",
    description: "Like Assessor's Reflection, but the writability of an entity is checked instead of my other hand.",
    inputs: ['Entity'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/huginnsgambit.png',
    name: "Huginn's Gambit",
    description: "Removes the top iota from the stack, and saves it to my ravenmind, storing it there until I stop casting the Hex.",
    inputs: ['Any'],
    outputs: []
  },
  {
    path: 'hexes/muninnsreflection.png',
    name: "Muninn's Reflection",
    description: "Copy the iota out of my ravenmind, which I likely just wrote with Huginn's Gambit.",
    inputs: [''],
    outputs: ['Any']
  },
  {
    path: 'hexes/sinepurification.png',
    name: "Sine Purification",
    description: "Takes the sine of an angle in radians, yielding the vertical component of that angle drawn on a unit circle. Related to the values of π and τ.",
    inputs: ['Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/cosinepurification.png',
    name: "Cosine Purification",
    description: "Takes the cosine of an angle in radians, yielding the horizontal component of that angle drawn on a unit circle. Related to the values of π and τ.",
    inputs: ['Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/tangentpurification.png',
    name: "Tangent Purification",
    description: "Takes the tangent of an angle in radians, yielding the slope of that angle drawn on a circle. Related to the values of π and τ.",
    inputs: ['Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/inversesinepurification.png',
    name: "Inverse Cosine Purification",
    description: "Takes the inverse cosine of a value with absolute value 1 or less, yielding the angle whose cosine is that value. Related to the values of π and τ.",
    inputs: ['Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/inversecosinepurification.png',
    name: "Inverse Sine Purification",
    description: "Takes the inverse sine of a value with absolute value 1 or less, yielding the angle whose sine is that value. Related to the values of π and τ.",
    inputs: ['Num'],
    outputs: ['Num']
  },

  {
    path: 'hexes/inversetangentpurification.png',
    name: "Inverse Tangent Purification",
    description: "Takes the inverse tangent of a value, yielding the angle whose tangent is that value. Related to the values of π and τ.",
    inputs: ['Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/inversetangentdistillation.png',
    name: "Inverse Tangent Distillation",
    description: "Takes the inverse tangent of a Y and X value, yielding the angle between the X-axis and a line from the origin to that point.",
    inputs: ['Num', 'Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/logarithmicdistillation.png',
    name: "Logarithmic Distillation",
    description: "Removes the number at the top of the stack, then takes the logarithm of the number at the top using the other number as its base. Related to the value of e.",
    inputs: ['Num', 'Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/disjunctiondistillation.png',
    name: "Disjunction Distillation",
    description: "Unifies two sets.",
    extra: "As such:\nWith two numbers at the top of the stack, combines them into a bitset containing every \"on\" bit in either bitset.\nWith two lists, this creates a list of every element from the first list, plus every element from the second list that is not in the first list. This is somewhat similar to Additive Distillation.",
    inputs: ['Num|List', 'Num|List'],
    outputs: ['Num|List']
  },
  {
    path: 'hexes/conjunctiondistillation.png',
    name: "Conjunction Distillation",
    description: "Takes the intersection of two sets.",
    extra: "As such:\nWith two numbers at the top of the stack, combines them into a bitset containing every \"on\" bit present in both bitsets.\nWith two lists, this creates a list of every element from the first list that is also in the second list.",
    inputs: ['Num|List', 'Num|List'],
    outputs: ['Num|List']
  },
  {
    path: 'hexes/exclusiondistillation.png',
    name: "Exclusion Distillation",
    description: "Takes the exclusive disjunction of two sets.",
    extra: "As such:\nWith two numbers at the top of the stack, combines them into a bitset containing every \"on\" bit present in exactly one of the bitsets.\nWith two lists, this creates a list of every element in both lists that is not in the other list.",
    inputs: ['Num|List', 'Num|List'],
    outputs: ['Num|List']
  },
  {
    path: 'hexes/negationpurification.png',
    name: "Negation Purification",
    description: "Takes the inversion of a bitset, changing all \"on\" bits to \"off\" and vice versa. In my experience, this will take the form of that number negated and decreased by one. For example, 0 will become -1, and -100 will become 99.",
    inputs: ['Num', 'Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/uniquenesspurification.png',
    name: "Uniqueness Purification",
    description: "Removes duplicate entries from a list.",
    inputs: ['Num', 'Num'],
    outputs: ['Num']
  },
  {
    path: 'hexes/hermesgambit.png',
    name: "Hermes' Gambit",
    description: "Remove a pattern or list of patterns from the stack, then cast them as if I had drawn them myself with my Staff (until a Charon's Gambit is encountered). If an iota is escaped with Consideration or its ilk, it will be pushed to the stack. Otherwise, non-patterns will fail.",
    extra: "This can be very powerful in tandem with Foci.\nIt also makes the bureaucracy of Nature a \"Turing-complete\" system, according to one esoteric scroll I found.\nHowever, it seems there's a limit to how many times a Hex can cast itself-- Nature doesn't look kindly on runaway spells!\nIn addition, with the energies of the patterns occurring without me to guide them, any mishap will cause the remaining actions to become too unstable and immediately unravel.",
    inputs: ['List|Pattern'],
    outputs: ['Many']
  },
  {
    path: 'hexes/irisgambit.png',
    name: "Iris' Gambit",
    description: "Cast a pattern or list of patterns from the stack exactly like Hermes' Gambit, except that a unique \"Jump\" iota is pushed to the stack beforehand.",
    extra: "When the \"Jump\"-iota is executed, it'll skip the rest of the patterns and jump directly to the end of the pattern list.\nWhile this may seem redundant given Charon's Gambit exists, this allows you to exit nested Hermes' invocations in a controlled way, where Charon only allows you to exit one.\nThe \"Jump\" iota will apparently stay on the stack even after execution is finished... better not think about the implications of that.",
    inputs: ['List|Pattern'],
    outputs: ['Many']
  },
  {
    path: 'hexes/thothsgambit.png',
    name: "Thoth's Gambit",
    description: "Remove a list of patterns and a list from the stack, then cast the given pattern over each element of the second list.",
    extra: "More specifically, for each element in the second list, it will:\nCreate a new stack, with everything on the current stack plus that element\nDraw all the patterns in the first list\nSave all the iotas remaining on the stack to a list\nThen, after all is said and done, pushes the list of saved iotas onto the main stack.\nNo wonder all the practitioners of this art go mad.",
    inputs: ['List', 'List'],
    outputs: ['List']
  },
  {
    path: 'hexes/charonsgambit.png',
    name: "Charon's Gambit",
    description: "This pattern forcibly halts a Hex. This is mostly useless on its own, as I could simply just stop writing patterns, or put down my staff.",
    extra: "But when combined with Hermes' or Thoth's Gambits, it becomes far more interesting. Those patterns serve to 'contain' that halting, and rather than ending the entire Hex, those gambits end instead. This can be used to cause Thoth's Gambit not to operate on every iota it's given. An escape from the madness, as it were.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/thanatosreflection.png',
    name: "Thanatos' Reflection",
    description: "Adds the number of patterns a Hex is still capable of evaluating to the stack. This is reduced by one for each pattern cast by the Hex.",
    inputs: [],
    outputs: ['Num']
  },
  {
    path: 'hexes/waystonereflection.png',
    name: "Waystone Reflection",
    description: "Returns the position of the Impetus of this spell circle.",
    inputs: [],
    outputs: ['Vector']
  },
  {
    path: 'hexes/lodestonereflection.png',
    name: "Lodestone Reflection",
    description: "Returns the direction the Impetus of this spell circle is facing as a unit vector.",
    inputs: [],
    outputs: ['Vector']
  },
  {
    path: 'hexes/lesserfoldreflection.png',
    name: "Lesser Fold Reflection",
    description: "Returns the position of the lower-north-west corner of the bounds of this spell circle.",
    inputs: [],
    outputs: ['Vector']
  },
  {
    path: 'hexes/greaterfoldreflection.png',
    name: "Greater Fold Reflection",
    description: "Returns the position of the upper-south-east corner of the bounds of this spell circle.",
    inputs: [],
    outputs: ['Vector']
  },
  {
    path: 'hexes/akashasdistillation.png',
    name: "Akasha's Distillation",
    description: "Read the iota associated with the given pattern out of the Akashic Library with its Record at the given position. This has no range limit. Costs about one Amethyst Dust.",
    inputs: ['Vector', 'Pattern'],
    outputs: ['Any']
  },
  {
    path: 'hexes/akashasgambit.png',
    name: "Akasha's Gambit",
    description: "Associate the iota with the given pattern in the Akashic Library with its Record at the given position. This does have a range limit. Costs about one Amethyst Dust.",
    inputs: ['Vector', 'Pattern', 'Any'],
    outputs: []
  },
  {
    path: 'hexes/explosion.png',
    name: "Explosion",
    description: "Remove a number and vector from the stack, then create an explosion at the given location with the given power.",
    extra: "A power of 3 is about as much as a Creeper's blast; 4 is about as much as a TNT blast. Nature refuses to give me a blast of more than 10 power, though.\nStrangely, this explosion doesn't seem to harm me. Perhaps it's because I am the one exploding?\nCosts a negligible amount at power 0, plus 3 extra Amethyst Dust per point of explosion power.",
    inputs: ['Vector', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/fireball.png',
    name: "Fireball",
    description: "Remove a number and vector from the stack, then create a fiery explosion at the given location with the given power.",
    extra: "Costs one Amethyst Dust, plus about 3 extra Amethyst Dusts per point of explosion power. Otherwise, the same as Explosion, except with fire.",
    inputs: ['Vector', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/impulse.png',
    name: "Impulse",
    description: "Remove an entity and direction from the stack, then give a shove to the given entity in the given direction. The strength of the impulse is determined by the length of the vector.",
    extra: "Costs units of Amethyst Dust equal to the square of the length of the vector, plus one for every Impulse except the first targeting an entity.",
    inputs: ['Entity', 'Vector'],
    outputs: []
  },
  {
    path: 'hexes/blink.png',
    name: "Blink",
    description: "Remove an entity and length from the stack, then teleport the given entity along its look vector by the given length.",
    extra: "Costs about one Amethyst Shard per two blocks travelled.",
    inputs: ['Entity', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/makenote.png',
    name: "Make Note",
    description: "Remove a vector and two numbers from the stack. Plays an instrument defined by the first number at the given location, with a note defined by the second number. Costs a negligible amount of media.",
    extra: "There appear to be 16 different instruments and 25 different notes. Both are indexed by zero.\nThese seem to be the same instruments I can produce with a Note Block, though the reason for each instrument's number being what it is eludes me.\nEither way, I can find the numbers I need to use by inspecting a Note Block through a Scrying Lens.",
    inputs: ['Vector', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/placeblock.png',
    name: "Place Block",
    description: "Remove a location from the stack, then pick a block item and place it at the given location.",
    extra: "Costs about an eighth of one Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/breakblock.png',
    name: "Break Block",
    description: "Remove a location from the stack, then break the block at the given location. This spell can break nearly anything a Diamond Pickaxe can break.",
    extra: "Costs about an eighth of one Amethyst Dust, or a negligible amount if breaking a Conjured Block or Conjured Light.",
    inputs: ['Vector'],
    outputs: []
  },
  // START
  {
    path: 'hexes/createwater.png',
    name: "Create Water",
    description: "Summon a block of water (or insert up to a bucket's worth) into a block at the given position. Costs about one Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/destroyliquid.png',
    name: "Destroy Liquid",
    description: "Drains either a liquid container at, or a body of liquid around, the given position.",
    extra: "Costs about two Charged Amethyst.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/conjureblock.png',
    name: "Conjure Block",
    description: "Conjure an ethereal, but solid, block that sparkles with my pigment at the given position.",
    extra: "Costs about one Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/conjurelight.png',
    name: "Conjure Light",
    description: "Conjure a magical light that softly glows with my pigment at the given position.",
    extra: "Costs about one Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/overgrow.png',
    name: "Overgrow",
    description: "Encourage a plant or sapling at the target position to grow, as if Bonemeal was applied.",
    extra: "Costs a bit more than one Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/edifysapling.png',
    name: "Edify Sapling",
    description: "Forcibly infuse media into the sapling at the target position, causing it to grow into an Edified Tree.",
    extra: "Costs about one Charged Amethyst.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/ignite.png',
    name: "Ignite",
    description: "Start a fire on top of the given location, as if a Fire Charge was applied, or set fire to an entity.",
    extra: "Costs about one Amethyst Dust.",
    inputs: ['Entity|Vector'],
    outputs: []
  },
  {
    path: 'hexes/extinguisharea.png',
    name: "Extinguish Area",
    description: "Extinguish blocks in a large area.",
    extra: "Costs about six Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/whitesunsnadir.png',
    name: "White Sun's Nadir",
    description: "Inflicts weakness.",
    extra: "Base cost is one Amethyst Dust per 10 seconds.\nEach one has a \"base cost;\" the actual cost is equal to that base cost, multiplied by the potency squared.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/bluesunsnadir.png',
    name: "Blue Sun's Nadir",
    description: "Inflicts levitation.",
    extra: "Base cost is one Amethyst Dust per 5 seconds.\nEach one has a \"base cost;\" the actual cost is equal to that base cost, multiplied by the potency squared.",
    inputs: ['Entity', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/blacksunsnadir.png',
    name: "Black Sun's Nadir",
    description: "Inflicts withering.",
    extra: "Base cost is one Amethyst Dust per second.\nEach one has a \"base cost;\" the actual cost is equal to that base cost, multiplied by the potency squared.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/redsunsnadir.png',
    name: "Red Sun's Nadir",
    description: "Inflicts poison.",
    extra: "Base cost is one Amethyst Dust per 3 seconds.\nEach one has a \"base cost;\" the actual cost is equal to that base cost, multiplied by the potency squared.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/greensunsnadir.png',
    name: "Green Sun's Nadir",
    description: "Inflicts slowness.",
    extra: "Base cost is one Amethyst Dust per 5 seconds.\nEach one has a \"base cost;\" the actual cost is equal to that base cost, multiplied by the potency squared.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/craftcypher.png',
    name: "Craft Cypher",
    description: "Costs about one Charged Amethyst.",
    extra: "They all require me to hold the empty item in my off-hand, and require two things: the list of patterns to be cast, and an entity representing a dropped stack of Amethyst to form the item's battery.",
    inputs: ['Entity', 'List'],
    outputs: []
  },
  {
    path: 'hexes/crafttrinket.png',
    name: "Craft Trinket",
    description: "Costs about five Charged Amethysts.",
    extra: "They all require me to hold the empty item in my off-hand, and require two things: the list of patterns to be cast, and an entity representing a dropped stack of Amethyst to form the item's battery.",
    inputs: ['Entity', 'List'],
    outputs: []
  },
  {
    path: 'hexes/craftartifact.png',
    name: "Craft Artifact",
    description: "Costs about ten Charged Amethysts.",
    extra: "They all require me to hold the empty item in my off-hand, and require two things: the list of patterns to be cast, and an entity representing a dropped stack of Amethyst to form the item's battery.",
    inputs: ['Entity', 'List'],
    outputs: []
  },
  {
    path: 'hexes/rechargeitem.png',
    name: "Recharge Item",
    description: "Recharge a media-containing item in my other hand.",
    extra: "Costs about one Amethyst Shard per item.\nThis spell is cast in a similar method to the crafting spells; an entity representing a dropped stack of Amethyst is provided, and recharges the media battery of the item in my other hand.\nThis spell cannot recharge the item farther than its original battery size.",
    inputs: ['Entity'],
    outputs: []
  },
  {
    path: 'hexes/eraseitem.png',
    name: "Erase Item",
    description: "Clears Hex-containing or iota-containing items in my other hand. Costs about one Amethyst Dust per item.",
    extra: "The spell will also void all the media stored inside the item, releasing it back to Nature and returning the item to a perfectly clean slate. This way, I can re-use Trinkets I have put an erroneous spell into, for example.\nThis also works to clear a Focus or Spellbook page, unsealing them in the process.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/summonsentinel.png',
    name: "Summon Sentinel",
    description: "Summons my sentinel at the given position. Costs about one Amethyst Dust.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/banishsentinel.png',
    name: "Banish Sentinel",
    description: "Banish my sentinel, and remove it from the world. Costs a negligible amount of media.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/locatesentinel.png',
    name: "Locate Sentinel",
    description: "Add the position of my sentinel to the stack, or Null if it isn't summoned.",
    extra: "Costs a negligible amount of media.",
    inputs: [],
    outputs: ['Vector']
  },
  {
    path: 'hexes/wayfindsentinel.png',
    name: "Wayfind Sentinel",
    description: "Transform the position vector on the top of the stack into a unit vector pointing from that position to my sentinel, or Null if it isn't summoned.",
    extra: "Costs a negligible amount of media.",
    inputs: ['Vector'],
    outputs: ['Vector']
  },
  {
    path: 'hexes/internalizepigment.png',
    name: "Internalize Pigment",
    description: "I must be holding a Pigment in my other hand to cast this spell.",
    extra: "When I do, it will consume the dye and permanently change my mind's coloration (at least, until I cast the spell again). Costs about one Amethyst Dust.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/castersglamour.png',
    name: "Caster's Glamour",
    description: "Certain items I create seem oddly receptive to the influence of media.",
    extra: "By holding a Cypher, Trinket, Artifact, Focus, or Spellbook in my other hand, I can use this spell to change the appearance of the item. Costs about one Amethyst Dust.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/anchoritesflight.png',
    name: "Anchorite's Flight",
    description: "A flight limited in its range.",
    extra: "The second argument is a horizontal radius, in meters, in which the spell is stable. Moving outside of that radius will end the spell, dropping me out of the sky. As long as I stay inside the safe zone, however, the spell lasts indefinitely. An additional shimmer of media marks the origin point of the safe zone. \nCosts about 1 Amethyst Dust per meter of safety.",
    inputs: ['Entity', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/wayfarersflight.png',
    name: "Wayfarer's Flight",
    description: "A flight limited in its duration.",
    extra: "The second argument is an amount of time in seconds for which the spell is stable. After that time, the spell ends and I am dropped from the sky. \nIt is relatively expensive at about 1 Amethyst Shard per second of flight; I believe it is best suited for travel.",
    inputs: ['Entity', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/aviatorspurification.png',
    name: "Aviator's Purification",
    description: "Returns whether the given player is under the effects of Anchorite's or Wayfarer's Flight.",
    extra: "Does not detect whether the player can fly by other means.\nIt is unclear to me what use this has. But I suppose its utility is in the eye of the beholder.",
    inputs: ['Entity'],
    outputs: ['Bool']
  },
  {
    path: 'hexes/createlava.png',
    name: "Create Lava",
    description: "Summon a block of lava (or insert up to a bucket's worth) into a block at the given position.",
    extra: "Costs about one Charged Amethyst.\nIt may be advisable to keep my knowledge of this spell secret. A certain faction of botanists get... touchy about it, or so I've heard.\nWell, no one said tracing the deep secrets of the universe was going to be an easy time.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/summonlightning.png',
    name: "Summon Lightning",
    description: "I command the heavens! This spell will summon a bolt of lightning to strike the earth where I direct it.",
    extra: "Costs about three Amethyst Shards.",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/summonrain.png',
    name: "Summon Rain",
    description: "I control the clouds! This spell will summon rain across the world I cast it upon.",
    extra: "Costs about one Charged Amethyst. Does nothing if it is already raining.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/dispelrain.png',
    name: "Dispel Rain",
    description: "A counterpart to summoning rain. This spell will dispel rain across the world I cast it upon.",
    extra: "Costs about one Amethyst Shard. Does nothing if the skies are already clear.",
    inputs: [],
    outputs: []
  },
  {
    path: 'hexes/altiora.png',
    name: "Altiora",
    description: "Summon a sheaf of media about me in the shape of wings, endowed with enough substance to allow gliding.",
    extra: "Using them is identical to using Elytra;\nthe target (which must be a player) is lofted into the air, after which pressing Jump will deploy the wings. The wings are fragile, and break upon touching any surface. Longer flights may benefit from Impulse or (for the foolhardy) Fireworks.\nCosts about one Charged Crystal.",
    inputs: ['Player'],
    outputs: []
  },
  {
    path: 'hexes/greaterteleport.png',
    name: "Greater Teleport",
    description: "Far more powerful than Blink, this spell lets me teleport nearly anywhere in the entire world!",
    extra: "There does seem to be a limit, but it is much greater than the normal radius of influence I am used to.\nThe entity will be teleported by the given vector. Curiously, this vector seems to be an offset, not an absolute position in the world; for example, if I use Vector Reflection +X, the entity will end up precisely one block east of its original position. No matter the distance, it always seems to cost about ten Charged Amethyst.\nThe transference is not perfect, and it seems when teleporting something as complex as a player, their inventory doesn't quite stay attached, and tends to splatter everywhere at the destination. In addition, the target will be forcibly removed from anything inanimate they are riding or sitting on ... but I've read scraps that suggest animals can come along for the ride, so to speak.",
    inputs: ['Entity', 'Vector'],
    outputs: []
  },
  {
    path: 'hexes/whitesunszenith.png',
    name: "White Sun's Zenith",
    description: "Bestows regeneration.",
    extra: "Base cost is one Amethyst Dust per second.\nHowever, these have their media costs increase with the cube of the potency.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/bluesunszenith.png',
    name: "Blue Sun's Zenith",
    description: "Bestows night vision.",
    extra: "Base cost is one Amethyst Dust per 5 seconds.\nHowever, these have their media costs increase with the cube of the potency.",
    inputs: ['Entity', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/blacksunszenith.png',
    name: "Black Sun's Zenith",
    description: "Bestows absorption.",
    extra: "Base cost is one Amethyst Dust per second.\nHowever, these have their media costs increase with the cube of the potency.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/redsunszenith.png',
    name: "Red Sun's Zenith",
    description: "Bestows haste.",
    extra: "Base cost is one Amethyst Dust per 3 seconds.\nHowever, these have their media costs increase with the cube of the potency.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/greensunszenith.png',
    name: "Green Sun's Zenith",
    description: "Bestows strength.",
    extra: "Base cost is one Amethyst Dust per 3 seconds.\nHowever, these have their media costs increase with the cube of the potency.",
    inputs: ['Entity', 'Num', 'Num'],
    outputs: []
  },
  {
    path: 'hexes/summongreatersentinel.png',
    name: "Summon Greater Sentinel",
    description: "Summon a greater version of my Sentinel.",
    extra: "Costs about two Amethyst Dust.\nThe stronger sentinel acts like the normal one I can summon without the use of a Great Spell, if a little more visually interesting. However, the range in which my spells can work is extended to a small region around my greater sentinel, about 16 blocks. In other words, no matter where in the world I am, I can interact with things around my sentinel (the mysterious forces of chunkloading notwithstanding).",
    inputs: ['Vector'],
    outputs: []
  },
  {
    path: 'hexes/craftphial.png',
    name: "Craft Phial",
    description: "Infuse a bottle with media to form a Phial.",
    extra: "Similarly to the spells for Crafting Casting Items, I must hold a Glass Bottle in my other hand, and provide the spell with a dropped stack of Amethyst. See this page for more information.\nCosts about one Charged Amethyst.",
    inputs: ['Entity'],
    outputs: []
  },
  {
    path: 'hexes/flaymind.png',
    name: "Flay Mind",
    description: "I cannot make heads or tails of this spell... To be honest, I'm not sure I want to know what it does.",
    inputs: ['Entity', 'Vector'],
    outputs: []
  }


];

console.log('Initial localStorage hexesData:', localStorage.getItem('hexesData'));

if (!localStorage.getItem('hexesData')) {
  console.log('No hexesData found in localStorage. Saving default data.');
  localStorage.setItem('hexesData', JSON.stringify(hexesData));
} else {
  console.log('hexesData already exists in localStorage.');
}

let inMemoryStorage = null;

function getStorageItem(key) {
  try {
    if (localStorage) {
      return localStorage.getItem(key);
    } else {
      console.warn('localStorage is not available. Using in-memory storage.');
      return inMemoryStorage ? inMemoryStorage[key] : null;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return inMemoryStorage ? inMemoryStorage[key] : null;
  }
}

function setStorageItem(key, value) {
  try {
    if (localStorage) {
      localStorage.setItem(key, value);
    } else {
      console.warn('localStorage is not available. Using in-memory storage.');
      if (!inMemoryStorage) inMemoryStorage = {};
      inMemoryStorage[key] = value;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    if (!inMemoryStorage) inMemoryStorage = {};
    inMemoryStorage[key] = value;
  }
}

window.addEventListener('load', () => {
  try {
    const storedHexesRaw = getStorageItem('hexesData');
    if (storedHexesRaw) {
      const storedHexes = JSON.parse(storedHexesRaw);
      
      const storedNames = new Set(storedHexes.map(h => h.name));
      const newItems = hexesData.filter(h => !storedNames.has(h.name));

      if (newItems.length > 0) {
        console.log('New hexes found in script! Adding to storage:', newItems);
        hexesData = [...storedHexes, ...newItems];
        saveHexesData();
      } else {
        hexesData = storedHexes;
      }
    } else {
      saveHexesData();
    }
  } catch (error) {
    console.error('Error synchronizing storage:', error);
  }

  updateHexes();
});

function addHex(newHex) {
  try {
    hexesData.push(newHex);
    console.log('Added new hex:', newHex);
    saveHexesData();
    updateHexes();
  } catch (error) {
    console.error('Error adding new hex:', error);
  }
}

function saveHexesData() {
  try {
    console.log('Saving hexesData to storage:', hexesData);
    setStorageItem('hexesData', JSON.stringify(hexesData));
  } catch (error) {
    console.error('Error saving hexesData to storage:', error);
  }
}

function updateHexes() {
  try {
    console.log('Updating hexes display with data:', hexesData);
    displayHexes(hexesData);
  } catch (error) {
    console.error('Error updating hexes display:', error);
  }
}

function displayHexes(hexes) {
  const hexesList = document.getElementById('hexes-list');
  hexesList.innerHTML = '';
  hexes.forEach((hex, index) => {
    const hexItem = document.createElement('div');
    hexItem.classList.add('hex-item');
    hexItem.style.border = '1px solid #555';
    hexItem.style.padding = '10px';
    hexItem.style.marginBottom = '15px';
    hexItem.style.backgroundColor = '#1e1d1dff';
    hexItem.style.borderRadius = '8px';

    const hexImage = document.createElement('img');
    hexImage.src = hex.path;
    hexImage.alt = hex.name;
    hexImage.classList.add('hex-image');

    const hexDetails = document.createElement('div');
    hexDetails.classList.add('hex-details');

    const hexName = document.createElement('h3');
    hexName.textContent = hex.name;

    const hexDescription = document.createElement('p');
    hexDescription.innerHTML = hex.description.replace(/\n/g, '<br>');

    const hexIO = document.createElement('span');
    hexIO.textContent = ` (${hex.inputs.join(', ')}  →  ${hex.outputs.join(', ')})`;
    hexIO.style.fontStyle = 'italic';
    hexIO.style.fontSize = '0.9em';
    hexIO.style.color = '#aaa';

    hexName.appendChild(hexIO);
    hexDetails.appendChild(hexName);
    hexDetails.appendChild(hexDescription);

    if (hex.extra && hex.extra.trim() !== '') {
      const extraButton = document.createElement('button');
      extraButton.textContent = 'Show Extra';
      extraButton.style.marginTop = '10px';
      extraButton.style.padding = '5px 10px';
      extraButton.style.border = 'none';
      extraButton.style.borderRadius = '4px';
      extraButton.style.backgroundColor = '#6b8f6d';
      extraButton.style.color = 'whitesmoke';
      extraButton.style.cursor = 'pointer';

      const extraText = document.createElement('p');
      extraText.innerHTML = hex.extra.replace(/\n/g, '<br>');
      extraText.style.display = 'none';
      extraText.style.marginTop = '10px';
      extraText.style.padding = '10px';
      extraText.style.backgroundColor = '#1b1a1d';
      extraText.style.borderRadius = '4px';

      extraButton.addEventListener('click', () => {
        if (extraText.style.display === 'none') {
          extraText.style.display = 'block';
          extraButton.textContent = 'Hide Extra';
        } else {
          extraText.style.display = 'none';
          extraButton.textContent = 'Show Extra';
        }
      });

      hexDetails.appendChild(extraButton);
      hexDetails.appendChild(extraText);
    }

    hexItem.appendChild(hexImage);
    hexItem.appendChild(hexDetails);

    hexesList.appendChild(hexItem);
  });

  console.log('Hexes displayed successfully.');
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();

  const nameMatch = query.match(/<([^>]+)>/);
  const descriptionMatch = query.match(/"([^"]+)"/);
  const inputOutputMatch = query.match(/\[([^\]]+)-([^\]]*)\]/);

  const filteredHexes = hexesData.filter(m => {
    let matchesName = true;
    let matchesDescription = true;
    let matchesInputOutput = true;

    if (nameMatch) {
      const nameTerms = nameMatch[1].split(',').map(term => term.trim());
      matchesName = nameTerms.every(term => m.name.toLowerCase().includes(term));
    }

    if (descriptionMatch) {
      const descriptionTerms = descriptionMatch[1].split(',').map(term => term.trim());
      matchesDescription = descriptionTerms.every(term => m.description.toLowerCase().includes(term));
    }

    if (inputOutputMatch) {
      const inputTerms = inputOutputMatch[1].split(',').map(term => term.trim());
      const outputTerms = inputOutputMatch[2].split(',').map(term => term.trim());

      const inputMatches = inputTerms.every(term => m.inputs.some(input => input.toLowerCase().includes(term)));
      const outputMatches = outputTerms.every(term => m.outputs.some(output => output.toLowerCase().includes(term)));

      matchesInputOutput = inputMatches && outputMatches;
    }

    if (!nameMatch && !descriptionMatch && !inputOutputMatch) {
      const generalizedMatch = m.name.toLowerCase().includes(query) ||
                               m.description.toLowerCase().includes(query) ||
                               m.inputs.some(input => input.toLowerCase().includes(query)) ||
                               m.outputs.some(output => output.toLowerCase().includes(query));
      return generalizedMatch;
    }

    return matchesName && matchesDescription && matchesInputOutput;
  });

  displayHexes(filteredHexes);
});

const panel = document.getElementById("infoPanel");
const tab = document.getElementById("infoTab");

tab.addEventListener("click", () => {
  panel.classList.toggle("open");
});

container.addEventListener('click', (event) => {
  if (event.target.classList.contains('hex-image')) {
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.className = 'fullscreen-image';

    const img = document.createElement('img');
    img.src = event.target.src;
    img.alt = event.target.alt;

    fullscreenDiv.appendChild(img);
    document.body.appendChild(fullscreenDiv);

    fullscreenDiv.addEventListener('click', () => {
      fullscreenDiv.remove();
    });
  }
});