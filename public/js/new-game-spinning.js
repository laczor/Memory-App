
//Automatically hide the player2,3,4 textboxes + binding eventlisteners to them.
(function(){
	setupPlayers();														// hide player2,3,4 inputbox + add event listener to them with 8 character validation
	setting_spinners();													// Addin event listener + function to the spinner buttons, so they can incremen + decrement the inputavlue					
	show_hide_Players();												// According to the playernum, appropriate number of player fields will be shown.
	baseValue();														// To make sure, the base value is set upon every clicking in flipping, timer
	bind_fading();														// To ensure fading button has a toggle value of true or false, upon clicking

})();


function baseValue (){
		//   --------FLIPPING Spinner INput ---
	// Whenever the flipping is clicked the value is set firstly to a default value, to ensure the proper value
	$(document).on('click', '#flipping', function () {    
		$(".form-control.text-center.flip").val(1);
	});
	
	
	// ------- TIMER Spinning input   --------
	$(document).on('click', '#timer', function () {    
		$(".form-control.text-center.time").val(0);
	});

};

function setupPlayers(){
		for(var i = 1; i<=4;i++){
		var pl =""
		pl = "#player" + i;
		if(i!=1){
			$(pl).hide();
			$(pl).find('input').val("");
		};
		$("#warning-long").hide();
		
		// biding event listeners to them inputboxes, to chechk the 8 max charachters every time 1 of the input has been changed.
		$(pl).find('input').change(function() {
			validation($(this));
		});
	};
	
};
//Will check a player's input box, if it length is < the function will hide #warning-long div + return true
function validation(inputbox){
	if(inputbox.val().length >8){
		$("#warning-long").show();
		return true;
	}else{
		$("#warning-long").hide();
		return false;
	};
};

// so the event is added to the bigger bootrsap group of.btn-group.players
//since every radio option is the child of this class, we can check with pseudo class if the input has been checked, and based on this we can display the player's name.
function show_hide_Players(){
	$(document).on('click', '.btn-group.players', function () { 
	var btn = $(".btn-group.players input:checked").val();
	for(var i = 1; i<=4;i++){
		var pl =""
		pl = "#player" + i;
		
		if(i<=btn){
	    	$(pl).show();
		}else{
			 $(pl).find('input').val("");
			 $(pl).hide();
		};
	};
});
};

// // update the input text value when user clicks on the spinner buttons, looping through 2 spinner text inputs
function setting_spinners()
{
	for(var i =1;i<3;i++){
		var spinElement = ".number-spinner"+i;									//To determine which spin element should be used
		var minVal = 1;											
		if(i==2){minVal = 0};									// 1st spin element min value = 0, 2nd = 1
		spinner(spinElement,minVal);
	};
	
};
//bind the spinner functions, which will check how to increment, or decrement the recieved value of the spinner input.
function spinner(spinElement,minVal){
		var spinElementButton = spinElement + " button";
	
			$(document).on('click', spinElementButton, function () {
			var btn = $(this),
			    min = btn.closest(spinElement).find('input').attr("min"),
			    max = btn.closest(spinElement).find('input').attr("max"),
				oldValue = btn.closest(spinElement).find('input').val(),
				newVal = 0;
			if (btn.attr('data-dir') == 'up') {
			    
		    	    if( parseInt(oldValue) + 1 <= max){
		    		    newVal = parseInt(oldValue) + 1;
		    	   } else {
			            newVal = parseInt(oldValue) ;
		    	   }
			} else {
				if (oldValue > min) {
					    newVal = parseInt(oldValue) - 1;
				} else {
					    newVal = minVal;											//setting the min val
				}
			}
			btn.closest(spinElement).find('input').val(newVal);
		});
		
	
};

//toggle the value upon clicking of fading or not.
function bind_fading(){
	$(document).on('click', '#fadingButton', function () { 
	var btn = $("#fadingButton").find("input");
	if(btn.val()=="false"){ 
		btn.val(true);
	}else{
		btn.val(false);
	};

});
};