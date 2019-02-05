$(document).ready(function () {

    //Initialize Firebase

    var config = {
        apiKey: "AIzaSyBUdRVwr1ioWjUrRL17DFSGdcw17W3xYFA",
        authDomain: "express-train.firebaseapp.com",
        databaseURL: "https://express-train.firebaseio.com",
        projectId: "express-train",
        storageBucket: "express-train.appspot.com",
        messagingSenderId: "567548193473"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //Adding trains with submit button
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        //Grab user input  
        var trainName = $("#train-name-input").val().trim();
        var trainDestinantion = $("#destination-input").val().trim();
        var trainFrequency = $("#frequency-input").val().trim();
        var trainTime = $("#time-input").val().trim();

        //Object for train data for new train
        var newTrain = {
            name: trainName,
            destination: trainDestinantion,
            frequency: trainFrequency,
            time: trainTime
        };
        //Push train data to the data base
        database.ref().push(newTrain);

        //Clear text boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#frequency-input").val("");
        $("#time-input").val("");


    });
    
    //Firebase event
    database.ref().on("child_added", function (childSnapshot) {

        var trainName = childSnapshot.val().name;
        var trainDestinantion = childSnapshot.val().destination;
        var trainFrequency = childSnapshot.val().frequency;
        var trainTime = childSnapshot.val().time;

        //Use moment to get train times
        var trainTimeConverter = moment(trainTime, "hh:mm").subtract(1, "years");
        console.log(trainTimeConverter);

        var diffTime = moment().diff(moment(trainTimeConverter), "minutes");
        var timeApart = diffTime % trainFrequency;
        var minutesArrival = trainFrequency - timeApart;
        var timeArrival = moment().add(minutesArrival, "m").format("LT");
        
        //Create new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestinantion),
            $("<td>").text(trainFrequency + " min"),
            $("<td>").text(minutesArrival + " min"),
            $("<td>").text(timeArrival)

        );

        //Here append new row to the table
        $("#schedule-table > tbody").append(newRow);

    });
});