//declaring the below variables to avoid errors
declare var firebase;
declare var auth;
declare var $;

//the function that fires at the loading of the window
window.onload = () => {

    //jquery to run the firebase CDN and configure firebase
    $.getScript("https://www.gstatic.com/firebasejs/4.8.1/firebase.js", function () {
        let config = {
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
    let login= <HTMLButtonElement>document.getElementById("login");
    let email = <HTMLInputElement>document.getElementById("email");
    let password = <HTMLInputElement>document.getElementById("password");
    let error = <HTMLParagraphElement>document.getElementById("error");

    //adding an on click event listener and a function to fire on the event to the login button
    login.addEventListener("click", function () {
        let emailVal = email.value;//getting email
        let passwordVal = password.value;//getting password

        //will go inside this block if password and email are not null
        if (emailVal != "" && passwordVal != "") {
            //loging user in with email and password
            let promise = auth.signInWithEmailAndPassword(emailVal, passwordVal);
            promise.catch(e => error.innerHTML = ("Error: " + e.message));//showing error message if an error occurs
        }
        //listening to the authentication state
        firebase.auth().onAuthStateChanged(
            firebaseUser =>{
                if(firebaseUser){
                    location.href='/game ';// if user is logged in, it will navigate the user to the  game play view
                }
                else{
                    console.log("User not logged in");
                }
            }
        )
    });


}

