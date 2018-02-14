//the function that fires at the loading of the window
window.onload = function () {
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
        auth = firebase.auth();
    });
    //assigning  html elements to the variables
    var error = document.getElementById("error");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var signup = document.getElementById("signup");
    //adding an on click event listener and a function to fire on the event to the sign up button
    signup.addEventListener("click", function () {
        var emailVal = email.value; //getting email
        var passwordVal = password.value; // getting password
        //will go inside this block if password and email are not null
        if (emailVal != "" && passwordVal != "") {
            //creating new user with email and password
            var promise = auth.createUserWithEmailAndPassword(emailVal, passwordVal);
            promise.catch(function (e) { return error.innerHTML = ("Error: " + e.message); }); //showing error message if an error occurs
        }
        //listening to the authentication state
        firebase.auth().onAuthStateChanged(function (firebaseUser) {
            if (firebaseUser) {
                location.href = '/game '; // if user is signed up successfully, it will navigate the user to the  game play view
            }
            else {
                console.log("not signed in");
            }
        });
    });
};
