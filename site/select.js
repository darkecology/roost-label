//<![CDATA[	
		
        	var reset_selection = "<option value=\"null\" />";
			
			function starter(){
				get_stations();
				
			}
			
            function get_stations(){
                if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp=new XMLHttpRequest();
                }
                else{// code for IE6, IE5
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
            
                xmlhttp.onreadystatechange=function() {	
                    if (xmlhttp.readyState==4 && xmlhttp.status==200){					
                        var station_select = document.getElementById("station_select");
                        station_select.innerHTML=xmlhttp.responseText;
                        station_select.onchange = get_years;
                    }
                }
                xmlhttp.open("GET","ajax/get_stations.php",true);
                xmlhttp.send();
            }



            function get_years()
            {
				document.getElementById("month_select").innerHTML = reset_selection;
				document.getElementById("day_select").innerHTML = reset_selection;
                var station = document.getElementById("station_select").value;
                //alert(station);
				var url = "ajax/get_years.php?station="+station;
                if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp=new XMLHttpRequest();
                }
                else{// code for IE6, IE5
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
            
                xmlhttp.onreadystatechange=function() {	
                    if (xmlhttp.readyState==4 && xmlhttp.status==200){					
                        var year_select = document.getElementById("year_select");
                        year_select.innerHTML=xmlhttp.responseText;
                        year_select.onchange = get_months;
                    }
                }
               
                xmlhttp.open("GET",url,true);
                xmlhttp.send();				
            }
			
			
			
            function get_months()
            {
				document.getElementById("day_select").innerHTML = reset_selection;
                var station = document.getElementById("station_select").value;
				var year = document.getElementById("year_select").value;
                //alert(station);
				var url = "ajax/get_months.php?station="+station+"&year="+year;
                if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp=new XMLHttpRequest();
                }
                else{// code for IE6, IE5
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
            
                xmlhttp.onreadystatechange=function() {	
                    if (xmlhttp.readyState==4 && xmlhttp.status==200){					
                        var month_select = document.getElementById("month_select");
                        month_select.innerHTML=xmlhttp.responseText;
                        month_select.onchange = get_days;
                    }
                }
               
                xmlhttp.open("GET",url,true);
                xmlhttp.send();				
            }


            function get_days()
            {
                var station = document.getElementById("station_select").value;
				var year = document.getElementById("year_select").value;
				var month = document.getElementById("month_select").value;
                //alert(station);
				var url = "ajax/get_days.php?station="+station+"&year="+year+"&month="+month;
                if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp=new XMLHttpRequest();
                }
                else{// code for IE6, IE5
                    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                }
            
                xmlhttp.onreadystatechange=function() {	
                    if (xmlhttp.readyState==4 && xmlhttp.status==200){					
                        var day_select = document.getElementById("day_select");
                        day_select.innerHTML = xmlhttp.responseText;
						day_select.onchange = function() {
							this.blur();
							display_date();
							RoostToolInit();
						};
                    }
                }
               
                xmlhttp.open("GET",url,true);
                xmlhttp.send();				
            }
			function display_date(){
				var station = document.getElementById("station_select").value;
				var year = document.getElementById("year_select").value;
				var month = document.getElementById("month_select").value;
				var day = document.getElementById("day_select").value;
				
				var display = document.getElementById("display");
				display.innerHTML = "<b class=\"display_sub\">Station:</b>"+ station + "<b class=\"display_sub\">Year:</b>"+year +"<b class=\"display_sub\">Month:</b>"+ month +"<b class=\"display_sub\">Day:</b>"+day +" ";
			}


            
//]]>
