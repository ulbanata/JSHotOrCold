$(document).ready(function() {
//	Declaring Game Functions and Variables
	var pickedButtons = [[11, 11]];  //Array of the chosen locations
	var distance = undefined;
	var prevDist = distance;

	//Creates a new location for the Hot Cold game solution, uses random numbers
	var createSolution = function() {
		var sol = [Math.floor((Math.random()*10)+1), Math.floor((Math.random()*10)+1)]; 
		return sol;
	};
	
	//Reset the board to a new game
	var boardReset = function() {
		pickedButtons = [[11, 11]];  //Array of the chosen locations reset, need a better way to do it
		solution = createSolution();  //Recreates the solution
		$('.gamebut').removeAttr("style");  //Clears the red background color that was added to the clicked buttons
		distance = undefined;
		$('h2').replaceWith("<h2>Do you want to play again?</h2>");
	};
	
	//Locates the button that was pressed, takes the button clicked, returns the location [row, col]
	var butLocate = function(button) {
		var className = button.attr('class').replace("gamebut col","").replace("row","");  //Pulls the row and column from the class details
		className = className.split(" ");
		className[0] = Number(className[0]);  //Contains the column
		className[1] = Number(className[1]);  //Contains the row
		//Swapping row and column, don't want to have to change it all in the html
		var x = className[1];
		className[1] = className[0];  //Contains the column
		className[0] = x;  //Contains the row
		return className
	};
	
	//Checks to see if the button has been clicked before
	var checkButton = function(butLocation, pickedButtons) {
		for(i=0; i<pickedButtons.length; i++) {  //Goes through each array in the pickedButtons array.  I couldn't get .indexOf() to work
			if(pickedButtons[i][0] == butLocation[0] && pickedButtons[i][1] == butLocation[1]) {  //Checks the button location against each previously picked button
				return(true);  //If it has been clicked before, returns true
			}
		}
		return(false);  //If it has not been clicked, returns false
	};
	
	//Determines the distance from the game solution location, returns a float
	var distToSol = function(x,y) {
		return(Math.sqrt(((x[0]-y[0])*(x[0]-y[0]))+((x[1]-y[1])*(x[1]-y[1]))));  //Equation for the distance between two points
	};
	
	//Changes the button div color to reflect how close it is.
	//Currently not happy with the coloring, it is hard to determine shades when you get close to the correct button, need to look at other color options
	var changeButColor = function(button,distance) {
		var redValue = Math.floor(-19.6154*distance+274.62);  //y=mx+b equation that gives the amount of red in 0-255 based on the distance from the correct answer
		button.css("background-color","rgb("+redValue+",0,0)");  //Changes the background color to the red value found above
		console.log("The red amount it: " + redValue); //Remove!
	}
	
	//Determines whether to list hotter or colder, inputs distance: distance from current cell to the winning cell and prevDist: distance from last cell to the winning cell
	var hotOrCold = function(distance,prevDist) {
		if(prevDist == undefined || distance == prevDist) {
			if (distance == 1) {
				hotResponse = "You're on fire!";
			} else if(distance < 4) {
				hotResponse = "You're hot!";
			} else if(distance < 8) {
				hotResponse = "You're warm.";
			} else if(distance > 12) {
				hotResponse = "You're ice cold!";
			} else {
				hotResponse = "You're cold.";
			}
		} else {
			if(distance > prevDist) {
				hotResponse = "You're getting colder.";
			} else if(distance < 4) {
				hotResponse = "You're getting hotter!";
			} else {
				hotResponse = "You're getting warmer!";
			}
		}
		console.log(hotResponse);
		$('h2').replaceWith("<h2>"+hotResponse+"</h2>");
	}
	
	
//	Program Start
	//On load, get new solution
	solution = createSolution();  //Returns a random location, [row, col]
	console.log(solution);  //Remove!
	
	//When you click a game button
	$('.gamebut').click(function(){
		var butLocation = butLocate($(this))  //Locates the button that was clicked, returns [row, col]
		butPrevClick = checkButton(butLocation, pickedButtons)  //Checks to see if the button has been clicked before
		
		if(butPrevClick) {  //If the button has been clicked before, then:
			console.log("Clicked before");  //Remove
		} else {  //Else if it hasn't been clicked before, do this: 
			console.log("First click");  //Remove
			pickedButtons[pickedButtons.length] = butLocation;  //Adds the current button to the already clicked buttons array
			prevDist = distance;  //Saves the previous distance to determine the Hotter or Colder message
			distance = distToSol(butLocation,solution);  //Gives the distance as a float, used for color equation
			if(distance == 0) {  //If the button is the correct one, end the game
				console.log("You won! It took you " + ((pickedButtons.length)-1) + " tries.");  //Remove!
				$(this).css('background-color','green');  //Makes the button green when found
				$('h2').replaceWith("<h2>You won! It took you " + ((pickedButtons.length)-1) + " tries.</h2>");  //Changes the h2 to show when you win
				//boardReset();  //Change this to use with a button
			} else {  //If the button is not the correct answer, change the color of the background, determine the message to display for "Hotter" or "Colder"
				changeButColor($(this),distance);  //Changes the button color to a shade of red dependent on the distance from the correct button
				hotOrCold(distance, prevDist);
				//console.log("Not correct yet.");  //Remove!
			}
			console.log('Dist ' + distance);  //Remove
			console.log('Prev Dist ' + prevDist);  //Remove
		}
		//console.log(butLocation);  //Remove
		return pickedButtons;
	});
	
	$('button').click(function() {
		boardReset();
	});
	
});