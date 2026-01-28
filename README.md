# https://intersal.github.io/Hexilicious-Search/

##  How to use
In the search box, you can use specific syntax to filter hexes:

You can use a comma , to separate multiple terms like an "and" operator.
for example: Mind, Ref will search for hexes that have both Mind and Ref anywhere. Meaning you can also simply search Vector and it will return hexes with Vector in their name, description, and Input and Output (IO)

To search anything within a Name you can use <> like so: <Mind, Ref>. This will return all hexes with both Mind and Ref in their name.

To search the description you can use "" for example: "Transforms, Stack". This will return all hexes with both Transforms and Stack in their description.

To search Input and output it is slightly more complicated. an example of how you can use them is like so: [Entity - Vector. This will return all hexes that have both Entity and Vector in their Input and Vector in their output. You can also leave one side blank to search only Input or Output like so: [Entity - ] or [ - Vector. Though you must put a space on the other side if you do not specify it.

You can also combine all of these syntaxes together to make more specific searches like so: <Compass> "Transforms" [ - Vector will return all hexes with Compass in their name, Transforms in their description, and Vector in their output.

You can also [Vector, Entity - ]. which will show all hexes that have both Vector and Entity in their input regardless of output.
