// 1 function is created, which will call itself , selfinvoking functions
// https://sarfraznawaz.wordpress.com/2012/01/26/javascript-self-invoking-functions/
function startgame(cards,size,playersArray,fading,fliptime,time){
	
	var Memory = {
// functions generated inside of the Memory Object

		init: function(cards,size,playersArray,fading,fliptime,time){
	// storedcards - > Store the array of cards so later in the reset function the same game can be replayed
	// cards: array of card, from which the game will select
	// size:. 4x4,6x6,8x8, in order to determine how much card has to be selected + css modifications with special classes
	// storeplayersAarray = >Store the array of players so later in the reset function the same game can be replayed
	// playersArray:  an array to keep track of the names of the players.
	// playerTurn:    track the current player's number, which corresponds to the indexes of the ojbects in the players array of the  memory's ojbect.
	// playersNum:    check how many active players we have out of 4 possible ones, and keep track of its number at switchplayer function
	// fading:        boolean, to check if the cards should fadeout or not.
	// fliptime:      can choose, the timeout for the flipping,(showing the previously flipped cards)
	// timerTime        will store recieved time limit.
	// stopped 			will ignore any click while the cards are not flipped back.
	// interval 		will store later the setinterval id to stop the individual timer functions
	
			this.storedcards = cards;
			this.size = size;
			this.storeplayersAarray = playersArray;
			this.playerTurn = 0;
			this.playersNum = this.checkActivePlayers(playersArray);
			this.fading = fading;
			this.fliptime = fliptime *1000;	
			this.timerTime = time*60;														//time is given in minutes, has to conver to seconds
			this.stopped = false;	
			this.interval = "";
			this.$game = $(".game");														//will be used as a <div>to store the cards to be flipped												
			this.$restartButton = $(".restart");
			this.clearPlayers();															//clear player's data + formatting
			this.randomcards(size,cards)													//Randomize the selected array with the selected amount of elements
			this.shuffleCards(this.cardsArray);												//shuffle the cards in a random order
			this.updatePlayerNames(playersArray);											// Update the player's html conent + player's data
			this.updatePlayersTime(this.timerTime);											//update Player's time + html content	
			this.setup();
		},
//assign click event to the cards + pause function
		binding: function(){
			this.$memoryCards.on("click", this.cardClicked);
			$('#stop').click(function(){
					Memory.win();
			});
			$('#pause').click(function(){
					Memory.pausing(true);
			});

			},
//assign reset function to replay button, and since the modal is built later, it has to be binded later as well.
		bindingmodal: function(){
			$('#modal-replay').click(function(){
					Memory.reset();
			});		
			
			$('#modal-continue').click(function(){
					Memory.pausing(false);
			});	
		},


// $cards represents the cards object declared below, for each card they create  seperate div class, with front + back. 
		buildHTML: function(){
			var frag = '';													//the html string container for each div element
			var cardsizehtml = "";								            //Pass a variable, so by adding to the cardgame class, the specific css measurement can be applied.
			switch(this.size) {
				    case 4:
				        cardsizehtml = "game4X4";
				        break;
				    case 16: 
				        cardsizehtml = "card game6X6";
				        break;
				    case 32:
				        cardsizehtml = "card game8X8";
				        break; 
				    default:
				        cardsizehtml = "card game6X6";
				}
				// So when you are using for each functions on collection of objects, the first parameter is the object = k, second is the index number = v
				//  v.image = cards[v].image 
			this.$cards.each(function(k, v){
				frag += '<div class="card ' + cardsizehtml +   '" data-id='+ v.id +'">'+
						'<div class="inside">'+
						'<div class="front"><img src="'+ v.img +'" alt="'+ v.name +'" /></div>' +
						'<div class="back"><img src="/images/cardbackground.png" alt="memorycard" /></div></div></div>';
			});
			return frag;
		},

// Building the winning / pausing modal by building the html of it every time
// the player's data from the players array is displayed.
		buildModalhtml: function (status){																// to check if the game has been paused or really stopped
				if(status){
				var	headerhtmlstring = ""
					headerhtmlstring =  '<div id="modal-header-div">' +
							        	'<span>'+
							        		'<i class="fa fa-trophy fa-2x modal-icon" aria-hidden="true" ></i>'+
							        	'</span>'+
							        	'<h4 class="modal-title" id="myModalLabel">What a Game!</h4>'+
							        	'<span>'+
							        		'<i class="fa fa-trophy fa-2x modal-icon" aria-hidden="true" ></i>'+
							        	'</span>'+
							            '</div>'
				var footerhtmlstring = ""
					footerhtmlstring = '<div class="row buttons">'+
									      	'<div class="col col-xs-5 col-sm-4 col-lg-4">'+
								        		'<button id="modal-new" type="button" class="btn btn-default"><a href="/game/new" >New Game</a></button>'+
									        '</div>'+
									      	'<div class="col col-xs-4 col-sm-4 col-lg-4 ">'+
								        		'<button  id="modal-replay" type="button" class="btn btn-primary">Replay</button>'+
									        '</div>'+
									      	'<div class="col col-xs-3 col-sm-4 col-lg-4">'+
								        		'<button href="/" id="modal-home" type="button" class="btn btn-default"><a href="/" >Home</a></button>'+
									        '</div>'
								      '</div>'
				}else{
					var	headerhtmlstring = ""
					headerhtmlstring =  '<div id="modal-header-div">' +
							        	'<span>'+
							        		'<i class="fa fa-pause-circle-o fa-2x modal-icon" aria-hidden="true" ></i>'+
							        	'</span>'+
							        	'<h4 class="modal-title" id="myModalLabel">The game has been paused!</h4>'+
							        	'<span>'+
							        		'<i class="fa fa-pause-circle-o fa-2x modal-icon" aria-hidden="true" ></i>'+
							        	'</span>'+
							            '</div>'
					var footerhtmlstring = ""
					footerhtmlstring = '<div class="row">'+
									      	'<div class="col col-xs-4 col-sm-4 col-lg-4">'+
								        		'<button href="/game/new"id="modal-new-pause" type="button" class="btn btn-default"><a href="/game/new" >New Game</a></button>'+
									        '</div>'+
									      	'<div class="col col-xs-4 col-sm-4 col-lg-4 ">'+
									        '</div>'+
									      	'<div class="col col-xs-4 col-sm-4 col-lg-4">'+
								        		'<button id="modal-continue" type="button" class="btn btn-default">Continue</button>'+
									        '</div>'
								      '</div>'
					
				};
			    var bodyhtmlstring ="";
				bodyhtmlstring = 		 '<div class="row">' + 
										  '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 ">'+"Players</div>" +
										  '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">'+"Points</div>" +
										  '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">'+ "Kombo</div>" +
										  '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">'+ "Flips</div>" +
										  '<div id="timing" class="col-xs-3 col-sm-3 col-md-3 col-lg-2 ">'+"Time</div>" +
										"</div>" + 
										'<div class="row">' +
											'<hr class="col-xs-12 col-sm-12 col-lg-12d divider">' +
										"</div>"
				;


			for(var i=0;i<this.playersNum;i++){
				var p = Memory.players[i];
				var time = Memory.pad(parseInt(p["time"]/60,10))  + " : " + Memory.pad(p["time"]%60) ;  
				bodyhtmlstring = bodyhtmlstring +	'<div class="row">'
										  + '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 ">'+ p["name"] + 		"</div>" + 
										  '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">' +	 p["points"] + 		"</div>" + 
										  '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">'+ 	 p["maxkombo"]  + 	"</div>" + 
										  '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 ">'+ 	 p["flips"]    + 	"</div>" + 
										  '<div class="col-xs-3 col-sm-3 col-md-3 col-lg-2"'+'id="modtime'+i+'">'+ 	 time   + 			"</div>" +
										"</div>"
			}
		$('.modal-body').html(bodyhtmlstring);
		$('.modal-header').html(headerhtmlstring);
		$('.modal-footer').html(footerhtmlstring);

		},

//This is the maing function, an event handler which is triggered every time if a card element is clicked, then evaluete the given situation how to increment, points, switch players
		cardClicked: function(){
			var _ = Memory;
			var $card = $(this);																							// Here this means the card div, of the memorycards class, on which the user has been clicked.
			if(!_.paused && !_.stopped && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){		//if it has not been matched, or picked continue, else do nothing.
			
// Keep track of the flippings
				_.players[_.playerTurn]['flips'] += 1;
				_.updateflips(_.players[_.playerTurn]['flips']);
				$card.find(".inside").addClass("picked");
//First card check
				if(!_.guess){					// !null = true,
					_.kombo += 0.5;
					_.guess = $(this).attr("data-id");
//Second card check (matched if it successful + update points + calculating kombo), if fading is yes, activate the animations
				} else if(_.guess == $(this).attr("data-id") ){ 			
						$(".picked").addClass("matched");
						if(_.fading){
								setTimeout(function(){
									$(".matched").parent().animate({opacity: 0}, 1000);
								}, 500);																			//if fading is true, it will fadeout the matched elements.
							};
						_.kombo += 1.5 ;
						_.updatepoints(_.kombo);
						_.updatekombo(_.kombo);
						_.guess = null;
//if it was not a math, it will make the values default and will switch player
				} else {
						_.guess = null;
						_.kombo = 0 ;
						_.updatekombo(_.kombo);
						_.stopped = true;																		  // stopped 			will ignore any click while the cards are not flipped back.
	
						setTimeout(function(){
							$(".picked").removeClass("picked");
							_.stopped = false;
							if(_.playersNum !=1){_.switchplayer(false);}					
						}, _.fliptime);

				}
//If all of the cards are matched, winning function is called.
				if($(".matched").length == $(".card").length){					//To check if all of the cards have been flipped or not.
					_.win();
				}
			}
		},
//Check from the given array,(what we have recieved from the form) how many active players do we have
		checkActivePlayers: function(playersArray){
				var players = 0; 
				for(var x = 0; x<playersArray.length;x++){
					if(playersArray[x] !== ""){
							players += 1;
					}
				};
				return players;

		},
// To clear all of the data from the players array + remove the passiveplayer formatting, from the html
		clearPlayers: function(){
			for(var i = 0; i<4; i++){
				this.players[i]["points"] = 0;
				this.players[i]["maxkombo"] = 0;
				this.players[i]["flips"] = 0;
				this.players[i]["time"] = 0;
				var idName = "#p" + i;
				$(idName).removeClass("passivePlayer");
				var idName2 ="#pp" + i;
				$(idName2).text(this.players[i]["points"]);
				
				var idName3 ="#pk" + i;
				$(idName3).text(this.players[i]["maxkombo"]);
				
				var idName4 ="#pf" + i;
				$(idName4).text(this.players[i]["flips"]);
			};

		},
//Will count all of the activeplayers time, to check if somebody has some time left, that player will be activated
		countTimers: function(players){
			var counter = 0;
			for(var i = 0; i<this.playersNum; i++){
				counter += players[i]['time'];
			};
			return counter;
		},

// will return the seconds  from the counted time as seconds, it is continously increasing by 1 and with it we can reclaclute the passed seconds + minutes
		pad: function ( val ) 
		{ return val > 9 ? val : "0" + val;	},

// pause the game with a click of a button, show the pause modal, bind the pause clearing button on the modal, this function is used to pause, unpause the game depending on the recieved true/false paramaeter
		pausing: function (pauseStatus){
			if(pauseStatus){
					this.paused = pauseStatus;
					this.buildModalhtml(false);																				//false = paused, true = finished
					this.bindingmodal();	
					$('#myModal').modal('show');
						
			}else{
					this.paused = pauseStatus;
					$('#myModal').modal('hide');
				
			};
		},
//to restart the game by hiding the modal, clear the players data, removing activePlayer formatting + clear running interval + starting with init();
		reset: function(){
			console.log("game has been reset");
			$('#myModal').modal('hide');
			this.clearPlayers();																								//hide modal
			var idName = "#p" + this.playerTurn;										  										//Remove the activeplayer formatting
			$(idName).removeClass("activePlayer");
			clearInterval(this.interval);			-																			//Stop the previously initated interval timer
			Memory.init(this.storedcards,this.size,this.storeplayersAarray,this.fading,this.fliptime/1000,this.timerTime/60)		//Start again the memory app, with the saved parameters, fliptime has to be decreased
		},

//will shuffle the given deck, and pick the first selected elements 8,16,32 then duplicate it by creating a cardsarray
		randomcards: function(num,deck){
			gamecards = [];								//Clear the previous game
			this.shuffle(deck);							//change the order of the whole deck
			for(var i=0; i<num;i++){					//select the first num items
				gamecards.push(deck[i]);
			}

			this.cardsArray = $.merge(gamecards,gamecards);
			return this.cardsArray;
		},

//Basic array function for shuffling the cards
		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		setup: function(){
			this.html = this.buildHTML();				//refers to the memory object,BUilding the card in the game html
			this.$game.html(this.html);					// assign the built cards
			this.$memoryCards = $(".card");				
			this.binding();								//bind stop,pause button
			this.paused = false;
     	    this.guess = null;
     	    this.kombo = 0;
     	    this.updateflips();						// To show the inital flips as 0
     	    $("#p0").addClass("activePlayer");
     	   	this.timerInit(this.timer);
      		},

//Shuffling the order of a given array. Fisher--Yates Algorithm -- https://bost.ocks.org/mike/shuffle/
		shuffle: function(array){
			var counter = array.length, temp, index;
	   	while (counter > 0) {														// While there are elements in the array
        	index = Math.floor(Math.random() * counter);							// Pick a random index
        	counter--;																// Decrease counter by 1
        	temp = array[counter];										        	// And swap the last element with it
        	array[counter] = array[index];
        	array[index] = temp;
	    	}
	    	return array;
		},

		//changed is a boolean, which tracks if the index has be changed or has been already changed before calling the switchplayer function.
		//switch the currentplayer's value, so it can get the appropirate data of the given index element from the players array in the Memory object + it will format the current player css.
		switchplayer: function(changed){
			if(this.playersNum !=1){														//Run only if the game has at least 2 players!
				var idName = "#p" + this.playerTurn;				
				$(idName).removeClass("activePlayer");
					if(this.countTimers(this.players)!=0){														// Check if is there anybody who have some time left with the countTimer function
							if(this.players[this.playerTurn]["time"]==0){
											var idName = "#p" + this.playerTurn;							//Add passive class as an extra, if 1s timerinit function is not executed
											$(idName).addClass("passivePlayer");
								
									if(this.playerTurn == this.playersNum -1){								//decrease the numbering to 0. at the last element. playerTurn starts from 0 indexing, while playersNum starts from 1. the difference has to be corrected
												this.playerTurn = 0;
										} else {																// Increase the element if it is not the last.
												this.playerTurn += 1;						
									}
								this.switchplayer(true);
							} else{
									if(this.playerTurn == this.playersNum -1){								//decrease the numbering to 0. at the last element. playerTurn starts from 0 indexing, while playersNum starts from 1. the difference has to be corrected
											if(!changed){this.playerTurn = 0;}								//Check if the amount has been changed previously due to timing						
											idName = "#p" + this.playerTurn;
											$(idName).addClass("activePlayer");
											this.updateflips(Memory.players[this.playerTurn]['flips']);	
									} else {																// Increase the element if it is not the last.
											if(!changed){this.playerTurn += 1;}								//Check if the amount has been changed previously due to timing									
											idName = "#p" + this.playerTurn;
											$(idName).addClass("activePlayer");
											this.updateflips(Memory.players[this.playerTurn]['flips']);	
									}
								
							}

					} else {
						this.win();
					}
			} else {
				this.win();
			}
		},

//Since a specific js file is created with a huge associative array, we just have to reference the key so we can get the arrasy, the key comes from the form.
		selectCards: function(cards){
			return decks[cards];
		},

//So with the first click, this function will start incerementing the sec itself, and modifying values of the html elements until
// the stop time is not changed by other function 
		timerInit : function(timer){
				if(timer){
				this.interval = setInterval(function(){												//----Descreasing time--toring the interval id, to stop it later
									if(this.paused === true){										//If the game is paused, do nothing
										return;
									} else {
										var p = Memory.players[this.playerTurn]						//decrease the player's time
										if(p["time"]>0){
												if(p["time"]<11){									// red category
													var idName = "#p" + this.playerTurn + "time";
													 $(idName).css("color","red");
												};
										   		p["time"] -= 1;
										} else {					
												var idName = "#p" + this.playerTurn;				//if the time has been used, the player has to be deactivated				
												$(idName).addClass("passivePlayer");
												$(".picked").removeClass("picked");					//Reflip the card if the time is up, with the deactivated user. + reset the guess, + kombo
												this.guess = null;
												this.kombo = 0;
												this.switchplayer(false);							//false = need to switch this.playerTurn
										}
										
										var idName = "#p" + this.playerTurn + "time";
										var timer = this.pad(parseInt(p["time"]/60,10))  + " : " + Memory.pad(p["time"]%60) ; 
										 $(idName).html(timer);
								    }
								}.bind(this),1000);													//we have to bind the "this" as the memory object to the function

				}else{
				this.interval=	setInterval(function(){													
								if(this.paused === true){											//Increasing time
									return;
								} else {
									var p = Memory.players[this.playerTurn]
									p["time"] += 1;
									
										var idName = "#p" + this.playerTurn + "time";
										var timer = this.pad(parseInt(p["time"]/60,10))  + " : " + Memory.pad(p["time"]%60) ; 
										 $(idName).html(timer);

						        }
							}.bind(this),1000);					//we have to bind the "this" as the memory object to the function

				}

		},


// Update flips every time with the passed value
		updateflips: function(flips){
			var idName ="#pf" + this.playerTurn;
			$(idName).html(flips);
		},
		
// Update the points html div and the points of the players array
		updatepoints: function(kombo){
			var idName ="#pp" + this.playerTurn;
				 Memory.players[this.playerTurn]['points'] += (10 * kombo);					//Store every point in the array of ojbect for the Memory object (Players)	
				$(idName).text(Memory.players[this.playerTurn]['points']);				//Update with the points text with the value
				this.animatePoint();					//Animate the kombination effect
		},
//Updateing the kombo sign + updating the maxkombo data in the players array
		updatekombo: function(kombo){
			var idName ="#pk" + this.playerTurn;
				$(idName).html(" " +kombo + "X"); 								//Only have the effect when gaining kombo, **Note, the textillate ojbect should be separated the randomly changing html content!
				this.animateKombo(kombo);
				if(kombo > Memory.players[this.playerTurn]['maxkombo']){
					Memory.players[this.playerTurn]['maxkombo'] = kombo;
				};
		},		

//Update the player's name in the player array + show or hide the html element, accordin to the activeplayers 
		updatePlayerNames: function(playersArray) {				//Get the players name from the form, looping through it, modify the names, hide the players if necessary
			var idName= "";
				for(var x = 0; x<playersArray.length;x++){
					if(playersArray[x] == ""){
						  idName = ".row.p" +x;
						  $(idName).hide();
					} else {
						Memory.players[x]["name"] = playersArray[x];
						idName = "#p" +x;
						$(idName).text(playersArray[x]);
					}
				};
		},
//Update the time property of each element in the memory's players array + displaying the inital time at the page.
		updatePlayersTime: function(time){
				for(var i = 0; i<4; i++){
						this.players[i]["time"] = time;
						var idName = "#p" + i + "time";
						var timer = this.pad(parseInt(this.players[i]["time"]/60,10))  + " : " + Memory.pad(this.players[i]["time"]%60) ;
						 $(idName).css("color","black")
						 $(idName).html(timer);
			};

			if(time>0){
					this.timer = true;
			} else{
					this.timer = false;
			}
		},
		
//Game is paused, so timerinit + cardclicked functions won't be activated.
		win: function(){
			this.paused = true;
			this.playersOrdering();
			this.buildModalhtml(true);																				//false = paused, true = finished
			this.bindingmodal();	
			$('#myModal').modal('show');
		},
// Sort the players array in Descending order, biggest is the first.
		playersOrdering: function(){
			this.players.sort(function(obj1, obj2) {
						return obj2.points - obj1.points;
					});
		},

// To store the actually playing data
		players: [
				{
					name: "",
					points: 0,
					maxkombo: 0,
					flips:0,
					time:0,
				},
				{
					name: "",
					points: 0,
					maxkombo: 0,
					flips:0,
					time:0,
				},
				{
					name: "",
					points: 0,
					maxkombo: 0,
					flips:0,
					time:0,
				},
				{
					name: "",
					points: 0,
					maxkombo: 0,
					flips:0,
					time:0,
				},
				
				
		],

// ------  ANIMATION EFFECTS binding with textille js ---- ///
// 			Basically the textillate has to be binded to a jquery selector, stored as variable and used as an ojbect function//
//This function is to anime the points gained	   //
		animatePoint: function(){
			var $animatePoint = $('.points').textillate({ 
								    autoStart: false,
								    in: { effect: 'tada',
								        delayScale: 1,
    									delay: 150,

								     }
								});

				$animatePoint.textillate('start'); 	//Animation for the points	


		},
//Will animate the kombination scores
		animateKombo: function(kombo){	
			var $animateKombo = $('.kombo').textillate({ 
											    autoStart: false,
											    in: { effect: 'bounce',
											    delayScale: 1,
			    								delay: 150,

											     }
											});
			if(kombo>0){												//Only have animations if the kombo has been increased!
				$animateKombo.textillate('start'); 	
			} 
		},

	};

//This array will be filled with the choosen cards.
	var gamecards = [];

// -------------------------
	//Memory.selectCards(cards)  = will search the appropriate playing deck in the decks and return it as an array.
	Memory.init(Memory.selectCards(cards),size,playersArray,fading,fliptime,time);	
	// cards: 			array of card, from which the game will select
	// size:. 			4x4,6x6,8x8, in order to determine how much card has to be selected + css modifications with special classes
	// playersArray:  	an array to keep track of the names of the players.
	// fading:       	boolean, to check if the cards should fadeout or not.
	// fliptime:     	can choo se, the timeout for the flipping,(showing the previously flipped cards)
	// time      		Extra function to add maximum time for the players.
};
