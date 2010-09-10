//----------------------------------------------------------------------
// ajax.js: very simple AJAX api
// 
// Dan Sheldon
// Oregon State University
// August 31, 2010
//----------------------------------------------------------------------

function ajax_new_xmlhttp()
{
	var xmlhttp;
    if (window.XMLHttpRequest) // IE7+, Firefox, Chrome, Opera, Safari
    {
		xmlhttp = new XMLHttpRequest();
    }
    else						// IE6, IE5
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
	return xmlhttp;
}

function ajax_get(url, callback)
{
	xmlhttp = ajax_new_xmlhttp();

	if (callback != null)
	{
		xmlhttp.open("GET", url, true);
		xmlhttp.onreadystatechange = function() {callback(xmlhttp)};
	}
	else
	{
		xmlhttp.open("GET", url, false);
	}

	xmlhttp.send();
	return xmlhttp;
}


function ajax_post_xml(url, xml, callback)
{
    xmlhttp = ajax_new_xmlhttp();

    xmlhttp.setRequestHeader("Content-Type", "text/xml");
	
	if (callback != null)
	{
		xmlhttp.open("POST", url, true);
		xmlhttp.onreadystatechange = function() {callback(xmlhttp)};
	}
	else
	{
		xmlhttp.open("POST", url, false);
	}

    xmlhttp.send(xml);
}

