 function requestData()
 {  
 	if (window.XMLHttpRequest)
 	{// code for IE7+, Firefox, Chrome, Opera, Safari
 	    xmlhttp=new XMLHttpRequest();
 	}
 	else
 	{// code for IE6, IE5
 	    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
 	}
    
 	xmlhttp.onreadystatechange=function() {

            if (xmlhttp.readyState==4 && xmlhttp.status==200)
 	    {
                arr = JSON.parse(xmlhttp.responseText);
                init(arr);
 	    }
 	}
	var station = gup('station');
	var year = gup('year');
	var month = gup('month');
	var day = gup('day');

	var url_php_request = "data.php?station=" + station + "&year=" + year + "&month=" + month+ "&day=" + day;
 	xmlhttp.open("GET",url_php_request,true);
 	xmlhttp.send();
 }
    

function init(arr)
{
     for (var i = 0; i < arr.length; i++) {
         document.write(i + ":" + arr[i] + "<br/>");
     }
     document.close();
}
      
	  
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}