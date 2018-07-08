$(document).ready(function(){

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAYkzAH0KMhtjxC0Dhwkq3GXlaPiXu31EE",
    authDomain: "du-hw-trainschedule.firebaseapp.com",
    databaseURL: "https://du-hw-trainschedule.firebaseio.com",
    projectId: "du-hw-trainschedule",
    storageBucket: "du-hw-trainschedule.appspot.com",
    messagingSenderId: "263250710887"
  };

firebase.initializeApp(config);

var database = firebase.database();
var ref = database.ref("trains");


//onclick button to add trains
$(".btn-success").click(function () {

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var time = $("#time").val().trim();
    var frequency = $("#frequency").val().trim(); 

        //stops creation of unfilled-out trains
        if (!(name && destination && time && frequency)) {
            alert("You must completely fill out the form to Add Train.")
        } else {
            //pushes inputs to firebase
            ref.push ({
                name: ($("#name").val().trim()),
                destination: ($("#destination").val().trim()),
                time: ($("#time").val().trim()),
                frequency: ($("#frequency").val().trim()) 
            });
        }
        //clears train inputs after added
        $("input").val("");
});

//grabs values from firebase
ref.on("child_added", function(childSnapshot) {
    var inputName = childSnapshot.val().name;
    var inputDest = childSnapshot.val().destination;
    var inputTime = childSnapshot.val().time;
    var inputFreq = childSnapshot.val().frequency;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var timeConverted = moment(inputTime, "HH:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(timeConverted), "minutes");
    var tRemainder = timeDiff % inputFreq;
    var tMinsTillTrain = inputFreq - tRemainder;
    var nextAriv = moment().add(tMinsTillTrain, "minutes").format("HH:mm");
   
    //creates table row with values
    var entry = $("<tr>");
    var tName = $("<td>");
    var tDest = $("<td>");
    var tFreq = $("<td>");
    var tAriv = $("<td>");
    var tMins = $("<td>");
   
    //appends input values to tables on website 
    tName.append(inputName + " Gravy");
    tDest.append(inputDest);
    tFreq.append(inputFreq);
    tAriv.append(nextAriv);
    tMins.append(tMinsTillTrain);
    entry.append(tName, tDest, tFreq, tAriv, tMins);
    $("tbody").append(entry);
  });
})