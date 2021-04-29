# Functional Programming: string-keywords

Language: JavaScript
Interpreter: Node
Functional programming with mostly recursive functions. Mutation only occurs when reading the input file.

Command Line example: node keyword.js "input=xyz.txt;k=3;output=keywords.txt"

k to find the k least frequent words.

Words provided in stopwords.txt are not counted for the output. These words provide no value. (articles, adverbs, prepositions)

Edition numbers are ignored. Words are not converted to upper or lowercase (they remain ”as is”).

Output example with k = 2 and least frequent keywords:

Gramercy 3

Bellafontaine 2
