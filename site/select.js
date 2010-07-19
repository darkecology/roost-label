var tool;
var reset_selection = "<option value=\"null\"/>";

function starter(){
	get_stations();
				
}

function get_stations(){
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp=new XMLHttpRequest();
    }else{
		// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
	document.getElementById("bookmarkLink").setAttribute("disabled", "true");
    xmlhttp.onreadystatechange=function() {	
        if (xmlhttp.readyState==4 && xmlhttp.status==200){					
            var station_select = document.getElementById("station_select");
            station_select.innerHTML=xmlhttp.responseText;
			station_select.onchange = function() { get_years(0); };	
			var stationURL = getURL("station");
			if (stationURL != ""){
				for( var i = 0 ; i < station_select.length; i++){
					if (station_select.options[i].value == stationURL){
						station_select.options[i].selected = true;
						get_years(1);
					}
				}
			}    
        }
    };
    xmlhttp.open("GET","ajax/get_stations.php",true);
    xmlhttp.send();
	
	
}

function get_years(URLselect)
{
	document.getElementById("month_select").innerHTML = reset_selection;
	document.getElementById("day_select").innerHTML = reset_selection;

	//disable bookmarkLink
	document.getElementById("bookmarkLink").setAttribute("disabled", "true");

	//hide the buttons
	document.getElementById("resetButton").style.display = "none";
	document.getElementById("saveAllButton").style.display = "none";
	

	document.getElementById("imgVR").style.display = "none";
	document.getElementById("imgSW").style.display = "none";
	document.getElementById("imgDZ").style.display = "none";
	
	//empty the display div
	//document.getElementById("display").innerHTML = "";


	//reset the infoPanel
	document.getElementById("infoPanel").innerHTML = "";
	

    var station = document.getElementById("station_select").value;
    //alert(station);
	var url = "ajax/get_years.php?station="+station;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp=new XMLHttpRequest();
    }
    else{// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function() {	
        if (xmlhttp.readyState==4 && xmlhttp.status==200){					
            var year_select = document.getElementById("year_select");
            year_select.innerHTML=xmlhttp.responseText;
            year_select.onchange = function() { get_months(0);};
			var yearURL = getURL("year");
			if (yearURL != "" & URLselect){
				for( var i = 0 ; i < year_select.length; i++){
					if (year_select.options[i].value == yearURL){
						year_select.options[i].selected = true;
						get_months(1);
					}
				}
			}
        }
    };
    
    xmlhttp.open("GET",url,true);
    xmlhttp.send();				
}



function get_months(URLselect)
{
	document.getElementById("day_select").innerHTML = reset_selection;
	
	//disable bookmarkLink
	document.getElementById("bookmarkLink").setAttribute("disabled", "true");

	//hide the buttons
	document.getElementById("resetButton").style.display = "none";
	document.getElementById("saveAllButton").style.display = "none";

	//hide the canvas images
	document.getElementById("imgVR").style.display = "none";
	document.getElementById("imgSW").style.display = "none";
	document.getElementById("imgDZ").style.display = "none";
	
	//empty the display div
	//document.getElementById("display").innerHTML = "";
	

	//reset the infoPanel
	document.getElementById("infoPanel").innerHTML = "";


    var station = document.getElementById("station_select").value;
	var year = document.getElementById("year_select").value;
    //alert(station);
	var url = "ajax/get_months.php?station="+station+"&year="+year;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp=new XMLHttpRequest();
    }
    else{// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function() {	
        if (xmlhttp.readyState==4 && xmlhttp.status==200){					
            var month_select = document.getElementById("month_select");
            month_select.innerHTML=xmlhttp.responseText;
            month_select.onchange = function() { get_days(0);};
			var monthURL = getURL("month");
			if (monthURL != "" && URLselect){
				for( var i = 0 ; i < month_select.length; i++){
					if (month_select.options[i].value == monthURL){
						month_select.options[i].selected = true;
						get_days(1);
					}
				}
			}

        }
    };
    
    xmlhttp.open("GET",url,true);
    xmlhttp.send();				
}


function get_days(URLselect)
{
    var station = document.getElementById("station_select").value;
	var year = document.getElementById("year_select").value;
	var month = document.getElementById("month_select").value;
    
	//reset canvas if set
	document.getElementById("imgVR").style.display = "none";
	document.getElementById("imgSW").style.display = "none";
	document.getElementById("imgDZ").style.display = "none";
	
	//empty the display div
	//document.getElementById("display").innerHTML = "";

	//reset the infoPanel
	document.getElementById("infoPanel").innerHTML = "";

	//disable bookmarkLink
	document.getElementById("bookmarkLink").setAttribute("disabled", "true");

	//hide the buttons
	document.getElementById("resetButton").style.display = "none";
	document.getElementById("saveAllButton").style.display = "none";


	//alert(station);
	var url = "ajax/get_days.php?station="+station+"&year="+year+"&month="+month;
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp=new XMLHttpRequest();
    }
    else{// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function() {	
        if (xmlhttp.readyState==4 && xmlhttp.status==200){					
            var day_select = document.getElementById("day_select");
            day_select.innerHTML = xmlhttp.responseText;
			day_select.onchange = function() {
				document.getElementById("canvasPanel").style.backgroundColor = '#FFFFFF';
				//if the user reselect day to a null value, we need to reset the canvas, infoPanel and display div
				if(day_select.value == "null"){
					
					//hide the buttons
					document.getElementById("resetButton").style.display = "none";
					document.getElementById("saveAllButton").style.display = "none";
					//reset canvas if set
					document.getElementById("imgVR").style.display = "none";
					document.getElementById("imgSW").style.display = "none";
					document.getElementById("imgDZ").style.display = "none";
					
					//empty the display div
					//document.getElementById("display").innerHTML = "";
					
					//reset the infoPanel
					document.getElementById("infoPanel").innerHTML = "";

				//else we just call to create an new tool object and set the three point mode to it
				}else{
					this.blur();
					RoostToolInit();
					document.getElementById("bookmarkLink").removeAttribute("disabled");
				}

				
			};
			var dayURL = getURL("day");
			if (dayURL != "" && URLselect){
				document.getElementById("canvasPanel").style.backgroundColor = '#FFFFFF';
				for( var i = 0 ; i < day_select.length; i++){
					if (day_select.options[i].value == dayURL){
						day_select.options[i].selected = true;
						day_select.blur();
						RoostToolInit();
						document.getElementById("bookmarkLink").removeAttribute("disabled");
						break;
					}
				}
			}
        }
    };

    xmlhttp.open("GET",url,true);
    xmlhttp.send();				
}


function getURL( name ){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return "";
	else
		return results[1];
}