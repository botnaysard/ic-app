$(document).ready(function(){
	
	// NAVIGATION //

	var counter = 1;
	var incrementSize = 1;
	var backCounter = 1;
	var crumbCounter = 1;
	var insertSubstances = "";
	var direction = "";
	var category = "";

 
	$('.nav-button').click(function(){
		checkAdulterants();	

		var value = $('.form-input:visible').filter(function () {
    	return this.value === '';
  		});

		if (value.length == 0) {
			
			$('#step' + counter).hide();
			
			direction = this.id;
			if (direction == "previous" && counter >= 2) {	
				counter -= 1;
			} else if (direction == "next" && counter <= 14) {
				counter += 1;
			}	

			if ( $("#step" + counter).hasClass("show-it")) {		
				$('#step' + counter).fadeIn();
			} else {
				while(!$("#step" + counter).hasClass("show-it")) {

					if (direction == "previous" && counter >= 2) {	
					counter -= 1;
					} else if (direction == "next" && counter <= 14) {
					counter += 1;
					}
				} 
				$('#step' + counter).fadeIn();
			}

			if (counter == 1) {
				$('#previous').removeClass("make-table").hide();
				crumbCounter = 1;
			} else if (counter >= 2 && counter <= 4) {
				$('#previous').addClass("make-table");
				$('#previous').show();
				crumbCounter = 2;
			} else if (counter >= 5 && counter <= 10) {
				crumbCounter = 3;
			} else if (counter >= 11 && counter <= 14) {
				$('#submit-button').removeClass('make-table').hide();
				$('.nav-button').addClass("make-table");
				$('.nav-button').show();
				$('#next').html('<div id="next-text"><i class="fa fa-arrow-right fa-2x" aria-hidden="true"></i></div>').show();
				$('#previous').show();
				crumbCounter = 4;		
			}	

			// run conditional checks when certain form pages are visible //

			check11();
			check14();
			check15();

			// update which progress step is highlighted //

			highlightCrumb();

		} else if (value.length > 0) {
		    alert('Please fill out all required fields.');
		}
	});
	
	// FUNCTIONS CALLED BY THE MAIN LOOP 

	// check for adulterant use and display extra step if yes

	function checkAdulterants() {
		if( $('.adulterants:checkbox:checked').length > 0 ){
		$("#step7").addClass("show-it");
		insertSubstances = $('input:checkbox:checked.adulterants').map(function () {
		return this.value;
		});
		var inserted = document.getElementById('inserted');
		for(var i = 0; i < insertSubstances.length; i++){
			// add check to make sure that each element is not inserted more than once // 
				if (!(inserted.innerHTML.indexOf(insertSubstances[i]) != -1)) { 
					inserted.innerHTML += "- " + insertSubstances[i] + "<br>";
	    		} else if ((inserted.innerHTML.indexOf(insertSubstances[i]) != -1)) { 
					$("#inserted").html($("#inserted").html().split("- " + insertSubstances[i] + "<br>").join(""));
				}
			}
		} else {
			$("#step7").removeClass("show-it");
		}
	}

	// end

	// display optional content on step 11

	function check11() {
		$('#11-a').on('change', function() {
	    	if (this.value == 'yes') {
	    		$("#11-b, #11-c").slideDown();
	        	$("#step12, #step13").addClass("show-it")
	      	}
	      	else {
	        	$("#11-b, #11-c").slideUp();
	        	$("#step12, #step13").removeClass("show-it"); 	
	        }
	    });
	}

    // end
 
	// display optional content on step 14
	function check14 () {
		if ($('#step14').is(":visible")) {
			$('#14-a').on('change', function() {
		      if ( this.value == 'yes') {
		        $("#14-b, #14-c").slideDown();
		      }
		      else {
		        $("#14-b, #14-c").slideUp();
		      } 
		    });
		}
	}

	// end

	// make sure the correct breadcrumb displays for each step

	function highlightCrumb() {
		for (i = 1; i < 6; i++) {
			if (i == crumbCounter) {
				$('#crumb' + i).addClass('text-green');
			} else if (i != crumbCounter) {
				$('#crumb' + i).removeClass('text-green');
			}
		}
	}

	// end

	// replace the next button with submit when the final step is reached

	function check15() {
		if (counter >= 15) {

			$('#next').html('<input type="submit" name="submit-button" id="submit-button" value="&#xf1d8;">');
			crumbCounter = 5;
			
			$('#submit-button').click(function(){
				var firstName = document.getElementsByName("usr-fname")[0].value;
				var lastName = document.getElementsByName("usr-lname")[0].value;
				var age = document.getElementsByName("usr-age")[0].value;
				var sex = document.getElementsByName("usr-sex")[0].value;
				var address = document.getElementsByName("usr-address")[0].value;
				var city = document.getElementsByName("usr-city")[0].value;
				var prov = document.getElementsByName("usr-prov")[0].value;
				var post = document.getElementsByName("usr-post")[0].value;
				var email = document.getElementsByName("usr-email")[0].value;
				var telephone = document.getElementsByName("usr-tel")[0].value;
				var doctor = document.getElementsByName("gp-name")[0].value;
				var doctorCity = document.getElementsByName("gp-city")[0].value;
				var diseases = $('input:checkbox:checked.affected-by').map(function () {
					return this.value;
				}).get();
				var substances = $('input:checkbox:checked.adulterants').map(function () {
					return this.value;
				}).get();
				var substanceDesc = document.getElementsByName("adulterant-desc")[0].value;
				var currently = document.getElementsByName("usr-use")[0].value;
				var frequency = $('input.howmuch[type="radio"]:checked', this).val();
				var route = $('input:checkbox:checked.route').map(function () {
					return this.value;
				}).get();
				var howObtained = document.getElementsByName("usr-obtain")[0].value;
				var wouldContinue = document.getElementsByName("usr-continue")[0].value;
				var cultivate = document.getElementsByName("grower")[0].value;
				var consume = $('input:checkbox:checked.for-who').map(function () {
					return this.value;
				}).get();
				var clientScore = 0;
				var sexModifier = 0;
				var illnessScore = 0;
				var consumeScore = 0;

				// compensate for higher tolerance typically seen in males //

				if (sex == 'male') {
					sexModifier += 1;
				} else {
					sexModifier = 0;
				}

				// adjust client score based on illness //

				if ($.inArray("adhd", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("alzheimers", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("anxiety", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("arthritis", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("brain_injury", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("cancer", diseases) > -1) {
					illnessScore += 35;
				}

				if ($.inArray("chronic_nausea", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("chronic_pain", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("chrons_collitis", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("depression", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("diabetes", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("eating_disorder", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("epilepsy", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("fibromyalgia", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("gastro_problems", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("head_injury", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("hepatitis_c", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("aids", diseases) > -1) {
					illnessScore += 20;
				}

				if ($.inArray("ibs", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("kidney_failure", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("migraine", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("multiple_sclerosis", diseases) > -1) {
					illnessScore += 7;
				}

				if ($.inArray("muscle_spasm", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("muscular_dystrophy", diseases) > -1) {
					illnessScore += 7;
				}

				if ($.inArray("nausea", diseases) > -1) {
					illnessScore += 1;
				}

				if ($.inArray("parkinsons", diseases) > -1) {
					illnessScore += 4;
				}

				if ($.inArray("ptsd", diseases) > -1) {
					illnessScore += 5;
				}

				if ($.inArray("grave_illness", diseases) > -1) {
					illnessScore += 3;
				}

				if ($.inArray("other", diseases) > -1) {
					illnessScore += 1;
				}

				// adjust clientScore according to consumption criteria //

				if (currently == 'yes') {
					consumeScore += 5;
				}

				if ($.inArray("vape", route) > -1) {
					consumeScore += 1;
				}

				if ($.inArray("combust", route) > -1) {
					consumeScore += 5;
				}

				if ($.inArray("rosin", route) > -1) {
					consumeScore += 3;
				}

				if ($.inArray("butter", route) > -1) {
					consumeScore += 3;
				}

				if ($.inArray("juice", route) > -1) {
					consumeScore += 20;
				}

				if (frequency == 'rarely') {
					consumeScore += 1;
				} else if (frequency == 'monthly') {
					consumeScore += 2;
				} else if (frequency == 'weekly') {
					consumeScore += 4;
				} else if (frequency == 'daily') {
					consumeScore += 7;
				} else if (frequency == 'lots') {
					consumeScore += 12;
				}

				// generate and evaluate score //

				clientScore = sexModifier + illnessScore + consumeScore;
				if (currently == 'yes') {
					if (clientScore < 20) {
						category = "BASIC CARE @ 1g/day";
					} else if (clientScore >= 20 && clientScore <= 39) {
						category = "ENHANCED CARE @ 5g/day";
					} else if (clientScore >= 40 && clientScore) {
						category = "ULTIMATE CARE @ 15g+/day"
					}
				} else if (currently == 'no') { 
					category = "BASIC @ 1g/day"
				}

				// Add the recommendation to hidden form field so it gets submitted with other client info
	
				var recommendation = document.getElementById('recinput');
				recommendation.value = category;

				// compile variables into a single user profile

				var newUser = {
		            'firstname': firstName,
		            'lastname' : lastName,
		            'age' : age,
		            'sex' : sex,
		            'address' : address,
		            'city' : city,
		            'province' : prov,
		            'postalcode' : post,
		            'email' : email,
		            'tel' : telephone,
		            'familydoctor' : doctor,
		            'doctorcity' : doctorCity,
		            'diseases' : diseases,
		            'othersubstance' : substances,
		            'substancedetails' : substanceDesc,
		            'cannabisuser' : currently,
		            'cannabisfreq' : frequency,
		            'cannabisroute' : route,
		            'blackmarket' : howObtained,
		            'blackmcontinue' : wouldContinue,
		            'growinterest' : cultivate,
		            'growfor' : consume,
		            'formscore' : clientScore,
		            'tier' : category
        		}

        		// send the consolidated profile //

        		$.ajax({
	            	type: 'POST',
	            	data: newUser,
	            	url: '/profile',
	            	dataType: 'JSON'
	        	}).done(function( response ) {

	            // Check for successful (blank) response

		            if (response.msg === '') {
		                // Update the table
		                //populateTable();

		            }
		            else {

		       	// If something goes wrong, alert the error message that our service returned
		                alert('Error: ' + response.msg);

	            	}
	        	});

				// document.intakeform.submit();
				$('.nav-button').removeClass('make-table').hide();
				$('#breadcrumbs').hide();
				$('#step15').html('');
				$('#conclusion').fadeIn();
			});
		
		}
	}

});
