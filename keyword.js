var args = process.argv;


var parsingInput = (inputString, current, theInputs, string) => { // gets the inputs into an array
    if (inputString.length == 0) return theInputs.concat([string]);
    if(inputString[0] == '=') {
        return parsingInput(inputString.slice(1), adding(current, 1), theInputs, '');
    }
    if(inputString[0] == ';') return parsingInput(inputString.slice(1), adding(current, 1), theInputs.concat([string]), '');
    if(current == 1 || current == 3 || current == 5) return parsingInput(inputString.slice(1), current, theInputs, adding(string, inputString[0]));
    return parsingInput(inputString.slice(1), current, theInputs, string);
}

function readFile() { //function was made to read the input file to a list
    const fs = require('fs');
    const readline = require('readline');

    if(fs.existsSync(inputs[0])) {

        var contentFile = new Array();

        var perLine = require('readline').createInterface({
            input: require('fs').createReadStream(inputs[0])
        });

        perLine.on('line', function(line) {
            contentFile = contentFile.concat(line.match(/[a-zA-Z]+/g)); //could not find another way to read input file into the list without mutation 
        })                                                              
        .on('close', function() {
            readFile2(contentFile);
        }); 
    }
    else {
        console.log("Help: input file does not exist");
    }
}

function readFile2(contentFile) { //function was made to read the stopwords file to a list
    const fs = require('fs');
    const readline = require('readline');

    if(fs.existsSync('stopwords.txt')) {

        var stopwordsArr = new Array();

        var perLine = require('readline').createInterface({
            input: require('fs').createReadStream('stopwords.txt')
        });

        perLine.on('line', function(line) {
            stopwordsArr = stopwordsArr.concat(line.match(/[a-zA-Z]+/g)); //could not find another way to read input file into the list without mutation 
        })                                                              //I believe i did not do any other mutations after this line
        .on('close', function() {
            main(contentFile, stopwordsArr);
        }); 
    }
    else {
        main(contentFile, []);
    }
}

var recursiveArray = (arrayFile, wordsArray) => { //wordsArray is the words without repetition of contentFile
    if(arrayFile.length == 0) return wordsArray; //contentFile contains the words of the input file
    if (checker(arrayFile[0], wordsArray, 0) == false) { //checks if current element is in the list of wordsArray
        return recursiveArray(arrayFile.slice(1), wordsArray.concat([arrayFile[0]]));
    }

    return recursiveArray(arrayFile.slice(1), wordsArray);
}

var checker = (wordInFile, wordsArray, firstcheck) => { //this is a linear search algorithm without mutation
    if(firstcheck == 1 && wordsArray.length == 0) return false;
    
    if(wordInFile == wordsArray[0]) {
        return true;
    }

    return checker(wordInFile, wordsArray.slice(1), 1);
}

var emptyLinesAndStopWordsRemove = (preFinal, stopList, finalList) => { //removes empty lines and stopwords
    if(preFinal.length == 0) return finalList;

    if(preFinal[0] && (checker(preFinal[0], stopList, 0) == false)) {
        return emptyLinesAndStopWordsRemove(preFinal.slice(1),stopList,finalList.concat(preFinal[0]));
    }

    return emptyLinesAndStopWordsRemove(preFinal.slice(1),stopList, finalList);
}

var counting = (word, theFile) => { //counts # of times the current word is in the input file
    return theFile.reduce(function(count, current) {
        if(current == word) return adding(count, 1);

        return count;
    }, 0);
}

var sortingAlpha = (theList, outputList) => { //this is an insert sort algorithm without mutation
    if(theList.length == 0) return outputList;
    if(outputList.length == 0) {
        return sortingAlpha(theList.slice(1), outputList.concat([theList[0]]));
    }

    if(whichIndexInsert(theList[0], outputList, 0) == 0) return sortingAlpha(theList.slice(1), [theList[0]].concat(outputList));
    if(whichIndexInsert(theList[0], outputList, 0) == outputList.length) return sortingAlpha(theList.slice(1), outputList.concat([theList[0]]));

    return sortingAlpha(theList.slice(1), outputList.slice(0, whichIndexInsert(theList[0], outputList, 0)).concat([theList[0]]).concat(outputList.slice(whichIndexInsert(theList[0], outputList, 0), outputList.length)));

}

var whichIndexInsert = (theWord, outputList, index) => { //finds where the word should be inserted
    if(outputList.length == 0) return adding(index, 1);
    if(theWord < outputList[0]) return index;
    return whichIndexInsert(theWord, outputList.slice(1), adding(index, 1));
}

var findingKs = (theList, KtheList, k) => { //finds the k least counts
    if(k == 0 || theList.length == 0) return KtheList;
    return findingKs(removeRepeatedNums(theList, theList.reduce(leastValueInArray), []), KtheList.concat([theList.reduce(leastValueInArray)]), substract(k, 1));
}

var leastValueInArray = (minimum, value) => { //used with reduce() to find the smallest number
    if (minimum < value) return minimum;
    if(minimum > value) return value;
    return minimum;
}

var removeRepeatedNums = (theList, theNum, outputList) => { //removes numbers the same as theNum
    if(theList.length == 0) return outputList;
    if(theNum != theList[0]) return removeRepeatedNums(theList.slice(1), theNum, outputList.concat([theList[0]]));
    return removeRepeatedNums(theList.slice(1), theNum, outputList);
}

var printFinal = (theListWords, theCounts, theKs, fs) => {
    if(theKs.length == 0) return;
    printFinal2(theKs[substract(theKs.length, 1)], theCounts, theListWords, fs);
    printFinal(theListWords, theCounts, theKs.slice(0, substract(theKs.length, 1)), fs);
}

var printFinal2 = (number, theCounts, theListWords, fs) => {
    if(theCounts.length == 0) return;
    if(number == theCounts[0]) {
        fs.writeFileSync(inputs[2], theListWords[0] + ' ' + theCounts[0] + '\n', {'flag':'a'}, (err) => {
            if(err) throw err;
        });
    }
    printFinal2(number, theCounts.slice(1), theListWords.slice(1), fs);
}

var adding = (x, y) => x + y;
var substract = (x, y) => x - y;

function main(contentFile, stopWords) {
    
    var preFinalList = recursiveArray(contentFile, []);

    var finalList = emptyLinesAndStopWordsRemove(preFinalList, stopWords, []);
    
    var sortedList = sortingAlpha(finalList, []);

    var countWords = sortedList.map(word => counting(word, contentFile));

    var theKs = findingKs(countWords, [], +inputs[1]);

    const fs = require('fs');

    if(sortedList.length == 0) {
        fs.writeFileSync(inputs[2], '', {'flag':'a'}, (err) => {
            if(err) throw err;
        });
    }

    printFinal(sortedList, countWords, theKs, fs);

    
}

if(args[2] == undefined) {
    console.log("Help: no input was given");
}
else {
    var inputs = parsingInput(args[2].replace(/\s+/g, ''), 0, [], '');

    if(inputs.length == 3 && +inputs[1] > 0) {
        readFile();
    }
    else {
        console.log("Help: Wrong inputs");
    }
}

