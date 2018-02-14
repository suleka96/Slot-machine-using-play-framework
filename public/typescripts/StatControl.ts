//declaring the below variables to avoid errors
declare var firebase;
declare var database;
declare var $;
declare var saveAs;
declare var auth;
declare var zingchart;

//defining variables to store retieved information from the firebase database
var noOfLosses : number ;
var noOfWins : number;
var totalWonCredits : number;
var totalCreditsBet : number;
var netAverage : number;

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
        database = firebase.database();
        auth=firebase.auth();
        //listening to the authentication state
        firebase.auth().onAuthStateChanged(
            firebaseUser =>{
                //if the revant user is logged in it will go inside this block
                if(firebaseUser){
                    firebaseRetrieve();//calling function to retrive information from firebase and create the charts
                }
                else{
                    console.log("User not logged in");
                }
            }
        )

    });

    //jquery that fires a function on the click event of the statstics button to write and downloads a text file which has information about the statistics
    $("#saveStatBtn").click(function(){
        var blob = new Blob(["Won Amount:"+noOfWins+" ,Lost Amount: "+noOfLosses+" ,Average Number of Credits Netted: "+netAverage],{type: "text/plain; charset=utf-8"})
        saveAs(blob, Date()+".txt");
    });


}


// function that retrives information and draws the charts
function  firebaseRetrieve() : void{

    //getting the user id of the logged in user
    var userId = auth.currentUser.uid;
    //navigating to the correct node and retrieveing data as a JSON object
    database.ref(userId+"/stat").once('value').then(function(snapshot) {
        //getting each value and assigning to the variables
        noOfLosses = snapshot.val().noOfLosses;
        noOfWins = snapshot.val().noOfWins;
        totalWonCredits = snapshot.val().totalWonCredits;
        totalCreditsBet =  snapshot.val().totalCreditsBet;
        netAverage =  snapshot.val().netAverage;

        //code that is responsible for rendaring the charts
        zingchart.loadModules('pie', function(){ //Load Modules Method

            //configuration for game play summary chart (configuration given by zingchart )
            let myConfig1 = {
                type: "pie",
                backgroundColor: "#BBECF5",
                plot: {
                    borderColor: "#2B313B",
                    borderWidth: 5,
                    // slice: 90,
                    valueBox: {
                        placement: 'out',
                        text: '%t\n%npv%',
                        fontFamily: "Open Sans"
                    },
                    tooltip: {
                        fontSize: '18',
                        fontFamily: "Open Sans",
                        padding: "5 10",
                        text: "%npv%"
                    },
                    animation: {
                        effect: 0,
                        method: 0,
                        speed: 0,
                        sequence: 0
                    }
                },
                source: {
                    text: 'gs.statcounter.com',
                    fontColor: "#8e99a9",
                    fontFamily: "Open Sans"
                },
                title: {
                    fontColor: "#126978",
                    text: 'GamePlay Summary',
                    align: "left",
                    offsetX: 10,
                    fontFamily: "Open Sans",
                    fontSize: 25
                },
                subtitle: {
                    offsetX: 10,
                    offsetY: 10,
                    fontColor: "#8e99a9",
                    fontFamily: "Open Sans",
                    fontSize: "16",
                    text: '',
                    align: "left"
                },
                plotarea: {
                    margin: "20 0 0 0"
                },
                series: [{
                    values: [noOfLosses],
                    text: "Losses",
                    backgroundColor: '#FF7965'
                }, {
                    text: 'Wins',
                    values: [noOfWins],
                    backgroundColor: '#6877e5'
                }]
            };

            //configuration for credit summary chart
            let myConfig2 = {
                type: "pie",
                backgroundColor: "#BBECF5",
                plot: {
                    borderColor: "#2B313B",
                    borderWidth: 5,
                    // slice: 90,
                    valueBox: {
                        placement: 'out',
                        text: '%t\n%npv%',
                        fontFamily: "Open Sans"
                    },
                    tooltip: {
                        fontSize: '18',
                        fontFamily: "Open Sans",
                        padding: "5 10",
                        text: "%npv%"
                    },
                    animation: {
                        effect: 0,
                        method: 0,
                        speed: 0,
                        sequence: 0
                    }
                },
                source: {
                    text: 'gs.statcounter.com',
                    fontColor: "#8e99a9",
                    fontFamily: "Open Sans"
                },
                title: {
                    fontColor: "#126978",
                    text: 'Credit Summary',
                    align: "left",
                    offsetX: 10,
                    fontFamily: "Open Sans",
                    fontSize: 25
                },
                subtitle: {
                    offsetX: 10,
                    offsetY: 10,
                    fontColor: "#8e99a9",
                    fontFamily: "Open Sans",
                    fontSize: "16",
                    text: '',
                    align: "left"
                },
                plotarea: {
                    margin: "20 0 0 0"
                },
                series: [{
                    values: [totalWonCredits],
                    text: "Won Credits",
                    backgroundColor: '#50ADF5',
                },{
                    text: 'Bet Credits',
                    values: [totalCreditsBet],
                    backgroundColor: '#6FB07F'
                }]
            };

            //rendering game play summary chart
            zingchart.render({
                id: 'myChart1',
                data: myConfig1,
                height: 450,
                width: 725
            });
            //rendering credit summary chart
            zingchart.render({
                id: 'myChart2',
                data: myConfig2,
                height: 450,
                width: 725
            });
        });

        //assigning  html elements to the variables
        let gameSummary= <HTMLLabelElement>document.getElementById('gameSummary');
        let creditSummary= <HTMLLabelElement>document.getElementById('creditSummary');

        let gameSummaryString :string= "Wins: "+ noOfWins +" Losses: "+ noOfLosses ;
        let creditSummaryString : string= "Average Number of Credits netted: "+ netAverage ;
        gameSummary.textContent=gameSummaryString;//assigning retrieved information to the label
        creditSummary.textContent=creditSummaryString;//assigning retrieved information to the label
    });
}