var noOfTimesPlayed = 0; //variable that stores the number of times played
var noOfLosses = 0; //variable that stores the number of losses
var noOfWins = 0; //variable that stores the number of wins
var totalWonCredits = 0; //variable that stores the total number of won credits
var totalCreditsBet = 0; //variable that stores the total number of credits bet
var isBetMaxPressed; //variable that indicates if the bet max button was pressed or not
//the function that fires at the loading of the window
window.onload = function () {
    //assigning  html elements to the variables
    var addCoinBtn = document.getElementById("addCoinBtn");
    var betOneBtn = document.getElementById("betOneBtn");
    var betMaxBtn = document.getElementById("betMaxBtn");
    var resetBetBtn = document.getElementById("resetBetBtn");
    var statBtn = document.getElementById("statBtn");
    var spinBtn = document.getElementById("spinBtn");
    var image1 = document.getElementById("reel1");
    var image2 = document.getElementById("reel2");
    var image3 = document.getElementById("reel3");
    var logout = document.getElementById("logout");
    var payout = document.getElementById("payout");
    //creating an object of GamePlay class
    var obj = new GamePlay();
    //adding on click event listeners to the html elements an defining the corresponding functions to fire
    addCoinBtn.addEventListener("click", obj.AddCoin);
    betOneBtn.addEventListener("click", obj.BetOne);
    betMaxBtn.addEventListener("click", obj.BetMax);
    resetBetBtn.addEventListener("click", obj.Reset);
    statBtn.addEventListener("click", obj.ViewStatistics);
    spinBtn.addEventListener("click", obj.Spin);
    payout.addEventListener("click", obj.writePayout);
    image2.addEventListener("click", function () { obj.stopSpinReel("reel2"); });
    image3.addEventListener("click", function () { obj.stopSpinReel("reel3"); });
    image1.addEventListener("click", function () { obj.stopSpinReel("reel1"); });
    //jquery to run the firebase CDN and configure firebase
    $.getScript("https://www.gstatic.com/firebasejs/4.8.1/firebase.js", function () {
        var config = {
            apiKey: "AIzaSyAeDDqMPrRgaTLWNZb0YCb67GLzENDvBmI",
            authDomain: "slotmachine-6b4dc.firebaseapp.com",
            databaseURL: "https://slotmachine-6b4dc.firebaseio.com",
            projectId: "slotmachine-6b4dc",
            storageBucket: "slotmachine-6b4dc.appspot.com",
            messagingSenderId: "107003677594"
        };
        firebase.initializeApp(config);
        database = firebase.database();
        auth = firebase.auth();
        //listening to the authentication state
        firebase.auth().onAuthStateChanged(function (firebaseUser) {
            //if the user is signed in the initializeValues functio be executed
            if (firebaseUser) {
                obj.initializeValues();
            }
            else {
                console.log("User not logged in");
            }
        });
    });
    //adding on click listener for the logout button
    logout.addEventListener("click", function () {
        auth.signOut(); //signing out the user
        location.href = '/'; // directing to login view
    });
};
var GamePlay = /** @class */ (function () {
    function GamePlay() {
        var _this = this;
        //function that determines the winning combinations and calculates the won amount
        //the lambda notation is put to force the identification of the function as the 'this' reference gets lost
        this.stopSpinReel = function (reel) {
            //will go inside this if statement if atleast one reel is still spinning
            if (_this.isSpinning) {
                var wonAmount = 0; //variable to store won credit amount
                var oneAndTwo = void 0, twoAndThree = void 0, oneAndThree = void 0; //variables to store if images in reels are equal
                var symbol1 = void 0, symbol2 = void 0, symbol3 = void 0; //symbol objects to store the derived symbol objects
                //if action was fired by clicking first img tag it will stop the interval handling image swapping of the first img tag
                if (reel === "reel1") {
                    _this.reel1.stop(); //calling function to clear the interval of the relevant img tag
                    _this.isReel1Spinning = false; //setting the isReel1Spinning to false
                }
                else if (reel == "reel2") {
                    _this.reel2.stop(); //calling function to clear the interval of the relevant img tag
                    _this.isReel2Spinning = false; //setting the isReel1Spinning to false
                }
                else {
                    _this.reel3.stop(); //calling function to clear the interval of the relevant img tag
                    _this.isReel3Spinning = false; //setting the isReel1Spinning to false
                }
                //will only go inside this if block if all three reels have stopped spinning
                if (!_this.isReel1Spinning && !_this.isReel2Spinning && !_this.isReel3Spinning) {
                    _this.ButtonControl("enable"); //calling buttonControl method to make the button disable false
                    //getting the reference of each html image element and assigning to a variable
                    var image1 = document.getElementById('reel1');
                    var image2 = document.getElementById('reel2');
                    var image3 = document.getElementById('reel3');
                    //getting the src of the current image that is assigned to the img tag
                    var str1 = image1.src;
                    var str2 = image2.src;
                    var str3 = image3.src;
                    //process of removing the parts attached to the src when building the project
                    var splitted1 = str1.split(":");
                    var splitted2 = str2.split(":");
                    var splitted3 = str3.split(":");
                    str1 = splitted1[2];
                    str2 = splitted2[2];
                    str3 = splitted3[2];
                    str1 = str1.substring(5); //assigning the relevant src to a variable
                    str2 = str2.substring(5); //assigning the relevant src to a variable
                    str3 = str3.substring(5); //assigning the relevant src to a variable
                    var array1 = _this.reel1.getArray(); //assigning the shuffeled array that was assigned to reel1 to a local array
                    var array2 = _this.reel2.getArray(); //assigning the shuffeled array that was assigned to reel1 to a local array
                    var array3 = _this.reel3.getArray(); //assigning the shuffeled array that was assigned to reel1 to a local array
                    //iterating through each of the arrys to find symbol object that contain the src that is equal to each of the srcs of the current images in the img tags
                    for (var i = 0; i < 6; i++) {
                        if (str1 === array1[i].getImagePath()) {
                            symbol1 = array1[i]; //assigning relevant symbol object to a variable
                        }
                        if (str2 === array2[i].getImagePath()) {
                            symbol2 = array2[i]; //assigning relevant symbol object to a variable
                        }
                        if (str3 === array3[i].getImagePath()) {
                            symbol3 = array3[i]; //assigning relevant symbol object to a variable
                        }
                    }
                    oneAndTwo = symbol1.areSymbolsEqual(symbol2); //calling areSymbolsEqual and determining if image in reel1 and reel2 are equal
                    twoAndThree = symbol2.areSymbolsEqual(symbol3); //calling areSymbolsEqual and determining if image in reel2 and reel3 are equal
                    oneAndThree = symbol1.areSymbolsEqual(symbol3); //calling areSymbolsEqual and determining if image in reel1 and reel3 are equal
                    //will go inside if block if 2 of the reels or all three reels have the same image
                    if ((oneAndTwo || twoAndThree || oneAndThree) || (oneAndTwo && twoAndThree && oneAndThree)) {
                        _this.betAmount = document.getElementById('betArea'); //getting the label element that holds the bet amount and assiging to a variable
                        //will go inside this block if image in reel 1 and two were equal or if image in reel one and three were equal
                        if (oneAndTwo || oneAndThree) {
                            //multiplying value of image with the bet amount and assigning the result to wonAmount
                            wonAmount = symbol1.getValue() * parseInt(_this.betAmount.textContent);
                        }
                        else if (twoAndThree || (oneAndTwo && twoAndThree && oneAndThree)) {
                            //multiplying value of image with the bet amount and assigning the result to wonAmount
                            wonAmount = symbol2.getValue() * parseInt(_this.betAmount.textContent);
                        }
                        var wonAmountString = "Credit amount won: " + wonAmount; //creating String to pass to the function that creates the won alert
                        alert("Congradulations You Win! " + wonAmountString); //create alert to display won message
                        totalWonCredits = totalWonCredits + wonAmount; //adding won amounts to the total credits won
                        _this.creditAmount = document.getElementById('creditArea'); //getting the label element that holds the credit amount and assigning to a variable
                        _this.betAmount = document.getElementById('betArea'); //getting the label element that holds the bet amount and assigning to a variable
                        _this.creditAmount.textContent = (parseInt(_this.creditAmount.textContent) + wonAmount).toString(); //adding won amount to the credit area
                        _this.betAmount.textContent = "00"; //setting bet area back to it's initial value
                        noOfWins++; //increasing number of wins
                    }
                    else {
                        alert("Sorry You Loose! Try Again!"); //create alert to display won message
                        _this.betAmount = document.getElementById('betArea'); //getting the label element that holds the bet amount and assigning to a variable
                        _this.betAmount.textContent = "00"; //setting bet area back to it's initial value
                        noOfLosses++; //increasing number of losses
                    }
                    _this.isSpinning = false; // set isSpinning to false
                    isBetMaxPressed = false; //set isBetMaxPressed to false
                    noOfTimesPlayed++; //increase the number of times played
                    var netAverage_1 = ((totalWonCredits - totalCreditsBet) / noOfTimesPlayed).toFixed(2);
                    ; //calculate the average number of credits netted
                    //sending information to the firebase database
                    var userId = auth.currentUser.uid; //getting the logged in users userid
                    //saving the information under the user id
                    //these information is sent as a JSON object
                    database.ref(userId + "/stat").set({
                        noOfTimesPlayed: noOfTimesPlayed,
                        noOfLosses: noOfLosses,
                        noOfWins: noOfWins,
                        totalWonCredits: totalWonCredits,
                        totalCreditsBet: totalCreditsBet,
                        netAverage: netAverage_1
                    });
                }
            }
        };
        //method that spins the reels
        //the lambda notation is put to force the identification of the function as the 'this' reference gets lost
        this.Spin = function () {
            _this.creditAmount = document.getElementById('creditArea'); //getting label that has credit amount to a variable
            _this.betAmount = document.getElementById('betArea'); //getting label that has bet amount to a variable
            //creating alert if user tries to click spin button when both credit amount and bet amount are both empty
            if (parseInt(_this.creditAmount.textContent) == 0 && parseInt(_this.betAmount.textContent) == 0) {
                alert("Credits Unavailable. Cannot play without Credits. Please press add coin button to add credit to continue playing"); //creating an alert
            }
            else if (parseInt(_this.betAmount.textContent) == 0) {
                alert("Bet Amount Unavailable. Please place a bet with your credits in order to continue playing"); //creating an alert
            }
            else if (!_this.isSpinning) {
                _this.ButtonControl("disable"); //calling ButtonControl function to disable the relavant buttons
                _this.isSpinning = true; //set isSpinning to true
                _this.isReel1Spinning = true; //set isReel1Spinning to true
                _this.isReel2Spinning = true; //set isReel2Spinning to true
                _this.isReel3Spinning = true; //set isReel3Spinning to true
                _this.ChangeImage(); //calling the ChangeImage function
            }
            else if (_this.isSpinning) {
                alert("Reels are Spinning. Please stop the reels to spin them again"); //creating an alert
            }
        };
    }
    //function that prints and downloads the pay out information javascript file
    GamePlay.prototype.writePayout = function () {
        //making a binary large object
        var blob = new Blob(["---------------Pay Out Information--------------" + "\r\n" + "\r\n" +
                "Number of Reels: 3" + "\r\n" +
                "Number of Symbols on each Reel: 6" + "\r\n" +
                "Symbols and their corresponding values: cherry: 2, bell: 6, lemon: 3, plum: 4, redseven: 7, watermelon: 5" + "\r\n" + "\r\n" +
                "NOTE: If we consider ONE reel, it has only ONE occarence of each of the above symbols" + "\r\n" + "\r\n" +
                "NOTE: To win either ALL THREE reels should have the same image or TWO of the reels should have the same image" + "\r\n" + "\r\n" + "\r\n" +
                "-------------------Pay Out Table for each £1 bet-------------------" + "\r\n" + "\r\n" +
                "2 cherries or 3 cherries: £1 * 2 = £2" + "\r\n" +
                "2 bells or 3 bells: £1 * 6 = £6" + "\r\n" +
                "2 lemons or 3 lemons: £1 * 3 = £3" + "\r\n" +
                "2 plums or 3 plums: £1 * 4 = £4" + "\r\n" +
                "2 redsevens or 3 redsevens: £1 * 7 = £7" + "\r\n" +
                "2 watermelons or 3 watermelons: £1 * 5 = £5" + "\r\n" + "\r\n" + "\r\n" +
                "-------------------Probability of each Combination-------------------" + "\r\n" + "\r\n" +
                "When ALL THREE reels have the same symbol: 1/6 * 1/6 *1/6 = 0.00463" + "\r\n" + "\r\n" +
                "When ONLY TWO reels have the same symbol: 1/6 * 1/6 = 0.0278" + "\r\n" + "\r\n" +
                "When ONLY TWO reels have the same symbol: 1/6 * 1/6 = 0.0278" + "\r\n" + "\r\n" +
                "NOTE: Since each of the reels only have one occurence of each symbol the probability of winning if all three rells or two reels are equal, is the same for all the symbols" + "\r\n" + "\r\n" + "\r\n" +
                "-------------------Calculation of Payout for each Combination:-------------------" + "\r\n" + "\r\n" +
                "----If all THREE reels are equal----" + "\r\n" + "\r\n" +
                "cherry: £2* 0.00463= £0.00926" + "\r\n" +
                "bell: £6* 0.00463= £0.02778" + "\r\n" +
                "lemon: £3* 0.00463= £0.01389" + "\r\n" +
                "plum: £4* 0.00463= £0.01852" + "\r\n" +
                "redseven: £7* 0.00463= £0.03241" + "\r\n" +
                "redseven: £7* 0.00463= £0.03241" + "\r\n" +
                "watermelon: £5* 0.00463= £0.02315" + "\r\n" + "\r\n" +
                "Total payout if THREE reels are equal: £0.0096+£0.02778+£0.01389+£0.01852+£0.03241+£0.02315= £0.12501" + "\r\n" + "\r\n" + "\r\n" +
                "----If TWO reels are equal----" + "\r\n" + "\r\n" +
                "cherry: £2* 0.0278=£0.0556 " + "\r\n" +
                "bell: £6* 0.0278= £0.1668" + "\r\n" +
                "lemon: £3* 0.0278=£0.0834 " + "\r\n" +
                "plum: £4* 0.0278= £0.1112" + "\r\n" +
                "redseven: £7* 0.0278= £0.1946" + "\r\n" +
                "watermelon: £5* 0.0278= £0.139 " + "\r\n" +
                "Total payout if TWO reels are equal: £0.0556+£0.1668+£0.0834+£0.1112+£0.1946+£0.139= £0.7506" + "\r\n" + "\r\n" +
                "Final Total Payout: £0.12501 + £0.7506 = £0.87561" + "\r\n" + "\r\n" +
                "Payout Percentage: 0.87561/1 *100 = 87.561% " + "\r\n" + "\r\n" +
                "In conclution this means that for every £1 you bet, on average you will win back  £0.87561 "], { type: "text/plain; charset=utf-8" });
        saveAs(blob, "PayoutInformation.txt"); //saving and downloading the text file
    };
    //function that initialises variables taking the users previous game information from firebase
    GamePlay.prototype.initializeValues = function () {
        var userId = auth.currentUser.uid; //getting logged in user's user id
        //navigating to the relevant user's user id node and retrieving the information as a JSON object
        database.ref(userId + "/stat").once('value').then(function (snapshot) {
            //getting each value and assigning to the variables
            noOfLosses = snapshot.val().noOfLosses;
            noOfWins = snapshot.val().noOfWins;
            totalWonCredits = snapshot.val().totalWonCredits;
            totalCreditsBet = snapshot.val().totalCreditsBet;
            noOfTimesPlayed = snapshot.val().noOfTimesPlayed;
        });
    };
    //function that controls the disabling and enabling of buttons
    GamePlay.prototype.ButtonControl = function (state) {
        //assigning  html elements to the variables
        var addCoinBtn = document.getElementById("addCoinBtn");
        var betOneBtn = document.getElementById("betOneBtn");
        var betMaxBtn = document.getElementById("betMaxBtn");
        var resetBetBtn = document.getElementById("resetBetBtn");
        var statBtn = document.getElementById("statBtn");
        //if recieved parameter is enable it will go inside this if block
        if (state === "enable") {
            //setting disable to false of each button to enable them
            addCoinBtn.disabled = false;
            betOneBtn.disabled = false;
            betMaxBtn.disabled = false;
            resetBetBtn.disabled = false;
            statBtn.disabled = false;
        }
        else {
            //setting disable to true of each button to disable them
            addCoinBtn.disabled = true;
            betOneBtn.disabled = true;
            betMaxBtn.disabled = true;
            resetBetBtn.disabled = true;
            statBtn.disabled = true;
        }
    };
    //function that adds a coin to the credit area
    GamePlay.prototype.AddCoin = function () {
        this.creditAmount = document.getElementById('creditArea'); //getting label that has credit amount to a variable
        this.creditAmount.textContent = (parseInt(this.creditAmount.textContent) + 1).toString(); //adding 1 to the credit area
    };
    //function that is used to place a bet to the bet area
    GamePlay.prototype.BetOne = function () {
        this.creditAmount = document.getElementById('creditArea'); //getting label that has credit amount to a variable
        this.betAmount = document.getElementById('betArea'); //getting label that has bet amount to a variable
        //will onl go inside this if block if the credit amount is greater than 0
        if (parseInt(this.creditAmount.textContent) > 0) {
            this.creditAmount.textContent = (parseInt(this.creditAmount.textContent) - 1).toString(); //reducing one from the credit area
            this.betAmount.textContent = ((parseInt(this.betAmount.textContent) + 1)).toString(); // adding one to bet area
            totalCreditsBet++; //increasing the totalCreditsBet by one
        }
        else {
            alert("No Credits Available. Please press the 'Add Coin' button to add credits in order to continue playing"); //creating an alert
        }
    };
    //function that is used to to place a maximum bet
    GamePlay.prototype.BetMax = function () {
        this.creditAmount = document.getElementById('creditArea'); //getting label that has credit amount to a variable
        this.betAmount = document.getElementById('betArea'); //getting label that has bet amount to a variable
        //will go inside this if block if credit amount is greater than 2 and if bet max was not pressed more than once within a game play
        if (parseInt(this.creditAmount.textContent) > 2 && !isBetMaxPressed) {
            this.creditAmount.textContent = (parseInt(this.creditAmount.textContent) - 3).toString(); //reducing three from the credit area
            this.betAmount.textContent = (parseInt(this.betAmount.textContent) + 3).toString(); // adding three to bet area
            totalCreditsBet += 3; //increasing the totalCreditsBet by three
            isBetMaxPressed = true; //setting isBetMaxPressed to false
        }
        else if (parseInt(this.creditAmount.textContent) <= 2) {
            alert("Insufficient Credits. Please press the 'Add Coin' button and add more credits to place a maximum bet"); //creating an alert
        }
        else if (isBetMaxPressed) {
            alert("Bet Max was pressed more than Once. You can only press bet max button once per gameplay"); //creating an alert
        }
    };
    //function that resets the bet
    GamePlay.prototype.Reset = function () {
        this.creditAmount = document.getElementById('creditArea'); //getting label that has credit amount to a variable
        this.betAmount = document.getElementById('betArea'); //getting label that has bet amount to a variable
        this.creditAmount.textContent = (parseInt(this.betAmount.textContent) + parseInt(this.creditAmount.textContent)).toString(); //adding amount that was bet back to the credit area
        totalCreditsBet -= parseInt(this.betAmount.textContent); //reducing the total credits bet
        this.betAmount.textContent = "00"; //setting bet area back to its initial value
    };
    //function that navigates to the login page
    GamePlay.prototype.ViewStatistics = function () {
        location.href = '/statistics';
    };
    //function that starts the swapping of the images
    GamePlay.prototype.ChangeImage = function () {
        //creating 3 reel objects and assigning to variables
        this.reel1 = new Reels();
        this.reel2 = new Reels();
        this.reel3 = new Reels();
        //getting html image elements and assigning them to variables
        var image1 = document.getElementById('reel1');
        var image2 = document.getElementById('reel2');
        var image3 = document.getElementById('reel3');
        //calling spin function of the 3 reel objects to set the interval and start swapping the images
        this.reel1.spin(image1);
        this.reel2.spin(image2);
        this.reel3.spin(image3);
    };
    return GamePlay;
}());
var Reels = /** @class */ (function () {
    function Reels() {
        this.symbols = new Array(6); //array that stores the Symbol objects
        this.assignSymbols(); //calling function to assign symbols to array
    }
    //method that creates and assigns symbol objects to the array
    Reels.prototype.assignSymbols = function () {
        //creating Symbol objects
        var bell = new Symbol("assets/images/bell.png", 6);
        var cherry = new Symbol("assets/images/cherry.png", 2);
        var lemon = new Symbol("assets/images/lemon.png", 3);
        var plum = new Symbol("assets/images/plum.png", 4);
        var redSeven = new Symbol("assets/images/redseven.png", 7);
        var watermelon = new Symbol("assets/images/watermelon.png", 5);
        //adding Symbol objects to the array
        this.symbols[0] = bell;
        this.symbols[1] = cherry;
        this.symbols[2] = lemon;
        this.symbols[3] = plum;
        this.symbols[4] = redSeven;
        this.symbols[5] = watermelon;
        //calling shuffle method to randomly change the positions of the Symbol objects in the array
        this.shuffle();
    };
    //method that shuffles the Symbol objects in the array
    Reels.prototype.shuffle = function () {
        var shuffleCounter = 6; //setting shuffleCounter variable to 6
        //Will run util there are elements in the array
        while (shuffleCounter > 0) {
            // picking a random index
            var index = Math.floor(Math.random() * shuffleCounter);
            // reducing counter by 1
            shuffleCounter--;
            //swapping elements
            var temp = this.symbols[shuffleCounter];
            this.symbols[shuffleCounter] = this.symbols[index];
            this.symbols[index] = temp;
        }
    };
    //method that sets the interval for swapping the images
    Reels.prototype.spin = function (imageObject) {
        var index = 0; //index of the array
        var localarray = this.symbols; //assigning the shuffled array into a local array variable
        //itertrating through the symbol array and setting the src of each symbol to the sent img tag in an interval of 70ms
        this.interval = setInterval(function () {
            imageObject.src = localarray[index].getImagePath();
            index++;
            if (index == 6) {
                index = 0;
            }
        }, 70);
    };
    //method that clears the interval
    Reels.prototype.stop = function () {
        clearInterval(this.interval);
    };
    //method that returns the shuffled array
    Reels.prototype.getArray = function () {
        return this.symbols;
    };
    return Reels;
}());
var Symbol = /** @class */ (function () {
    function Symbol(imagePath, value) {
        this.imagePath = imagePath; //setting image path
        this.value = value; //setting value
    }
    //mathod that return the value of the symbol
    Symbol.prototype.getValue = function () {
        return this.value;
    };
    //method that checks if two symbols are equal
    Symbol.prototype.areSymbolsEqual = function (symbol) {
        var result = this.value == symbol.value;
        return result;
    };
    //method that returns the image path
    Symbol.prototype.getImagePath = function () {
        return this.imagePath;
    };
    return Symbol;
}());
