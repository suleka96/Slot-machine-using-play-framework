//the function that fires at the loading of the window
window.onload = () => {
    //assigning  html element to the variable
    let playBtn = <HTMLButtonElement>document.getElementById("playBtn");
    //adding an onclick event and a function to fire with the event to the play button
    playBtn.addEventListener("click", navigate);
}

//function that navigates the user to the sign up view
function navigate(){
    location.href='/signup ';
}



