$(document).ready(function() {
//	Declaring Game Functions and Variables
	var pickedButtons = [[11, 11]];  //Array of the chosen locations
	var distance = [];
	var prevDist = distance;
	var numOfMines = 3;
	var solution = [];

	//Creates a new location for the Hot Cold game solution, uses random numbers
	var createSolution = function() {
		var sol = [Math.floor((Math.random()*10)+1), Math.floor((Math.random()*10)+1)];
		console.log('The solution is: '+sol);
		return sol;
	};

	//Reset the board to a new game
	var boardReset = function() {
		pickedButtons = [[11, 11]];  //Array of the chosen locations reset, need a better way to do it
		solution=[];
		for(i=0; i<=numOfMines; i++){
			solution.push(createSolution());  //Returns a random location, [row, col]
		}
	  $('.gamebut').removeAttr("style");  //Clears the red background color that was added to the clicked buttons
		distance = [];
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

	//Check for mines:
	var minesCheck =function() {
		result = false;
		for(i=1; i<=numOfMines; i++){
			if(distance[i] == 0){
				result = true;
			};
		};
			return result;
	};

	//Determines the distance from the game solution location, returns a float
	var distToSol = function(x,y) {
		return(Math.sqrt(((x[0]-y[0])*(x[0]-y[0]))+((x[1]-y[1])*(x[1]-y[1]))));  //Equation for the distance between two points
	};

	//Changes the button div color to reflect how close it is.
	//Currently not happy with the coloring, it is hard to determine shades when you get close to the correct button, need to look at other color options
	var changeButColor = function(button) {//,distance) {
		var redValue = 0;
		var blueValue = 0;
		var greenValue = 0;

		//Determine red color:
		if(distance[0] >= 8) {
			redValue = 0;
		} else if(distance[0] <= 5) {
			redValue = 255;
		} else {
			redValue = Math.floor(-85*distance[0]+680);
		}

		//Determine blue color:
		if(distance[0] <= 8) {
			blueValue = 0;
		} else if(distance[0] >= 11) {
			blueValue = 255;
		} else {
			blueValue = Math.floor(85*distance[0]-680);
		}

		//Determine green color:
		if(distance[0] <= 11 && distance[0] >= 5) {
			greenValue = 255;
		} else if(distance[0] < 5) {
			greenValue = Math.floor(63.75*distance[0] - 63.75);
		} else {
			greenValue = Math.floor(-85*distance[0] + 1190);
		}
		button.css("background-color","rgb("+redValue+","+greenValue+","+blueValue+")");
	}

	//Determines whether to list hotter or colder, inputs distance: distance from current cell to the winning cell and prevDist: distance from last cell to the winning cell
	//
	var hotOrCold = function(prevDist) {
		if(prevDist == undefined || distance[0] == prevDist) {
			if (distance[0] == 1) {
				hotResponse = "You're on fire!";
			} else if(distance[0] < 4) {
				hotResponse = "You're hot!";
			} else if(distance[0] < 8) {
				hotResponse = "You're warm.";
			} else if(distance[0] > 12) {
				hotResponse = "You're ice cold!";
			} else {
				hotResponse = "You're cold.";
			}
		} else {
			if(distance[0] > prevDist) {
				hotResponse = "You're getting colder.";
			} else if(distance[0] < 4) {
				hotResponse = "You're getting hotter!";
			} else {
				hotResponse = "You're getting warmer!";
			}
		}
		$('h2').replaceWith("<h2>"+hotResponse+"</h2>");
	}

//	Program Start
	//On load, get new solution
	for(i=0; i<=numOfMines; i++){
		solution.push(createSolution());  //Returns a random location, [row, col]
	}

	//When you click a game button
	$('.gamebut').click(function(){
		//Can't sort without changing the value, so tossing it to gameOverCheck
		var gameOverCheck = []
		if(distance !== undefined){ //Gives error if undefined, checking here
			gameOverCheck = distance;
			gameOverCheck.sort;
		} else {
			gameOverCheck[0] = 1;
		}
		if(gameOverCheck[0] == 0) {  //Doesn't let you hit another button if the game is over

		} else {
			var butLocation = butLocate($(this))  //Locates the button that was clicked, returns [row, col]
			butPrevClick = checkButton(butLocation, pickedButtons)  //Checks to see if the button has been clicked before

			if(butPrevClick) {  //If the button has been clicked before, then do nothing:
			} else {  //Else if it hasn't been clicked before, do this:
				pickedButtons[pickedButtons.length] = butLocation;  //Adds the current button to the already clicked buttons array
				prevDist = distance[0];  //Saves the previous distance to determine the Hotter or Colder message
				for(i=0; i<=numOfMines; i++){
					distance[i] = distToSol(butLocation,solution[i]);  //Gives the distance as a float, used for color equation
				}
				if(distance[0] == 0) {  //If the button is the correct one, end the game
					$(this).css('background-color','white');  //Makes the button white when found
					$('h2').text("You won! It took you " + ((pickedButtons.length)-1) + " tries.");  //Changes the h2 to show when you win
				} else if(minesCheck()) {
					$(this).css('background-color','gray');
					$('h2').text("You hit a mine! Game over...")
					distance[0] = 0;
				} else {  //If the button is not the correct answer, change the color of the background, determine the message to display for "Hotter" or "Colder"
					changeButColor($(this));//,distance[0]);  //Changes the button color to a shade of red dependent on the distance from the correct button
					hotOrCold(/*distance[0], */prevDist);
				}
			}
			return pickedButtons;
		}
	});

	$('button').click(function() {
		boardReset();
	});

});
