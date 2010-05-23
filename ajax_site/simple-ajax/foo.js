


 function fetch()
 {  
     var arr = ["a", "b", "c"];

     if (0)
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
 		//eval( xmlhttp.responseText );
 		//document.write(js_array1[1]);
 		document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
	    
 		var myObject = JSON.parse(xmlhttp.responseText, reviver);
 	    }
 	}
 	xmlhttp.open("GET","index_Ajax_2.php?q="+str,true);
 	xmlhttp.send();
     }

     for (var i = 0; i < arr.length; i++)
     {
 	document.write(i + ":" + arr[i] + "<br/>");
     }
    
 }
	

