<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>

<meta http-equiv="content-type" content="text/html; charset=utf-8" />

<meta name="description" content="" />

<meta name="keywords" content="" />

<meta name="author" content="" />

<link rel="stylesheet" type="text/css" href="style.css" media="screen" />

<title>Roost Labeling</title>


</head>

	<body>

		<div id="wrapper">
		  <?php include('includes/header.php'); ?>
		  <?php #include('includes/nav.php'); ?>

<div id="content">

	<div id="content_1">
	
		
		<?php
		
			$station = $year = $month = $day = null; //declare vars
		
			$conn = mysql_connect('oniddb.cws.oregonstate.edu', 'almuallj-db', 'R87kFXtxi9pJo8ri');
			$db = mysql_select_db('almuallj-db',$conn);
		
			if(isset($_POST["station"]))
			{
				$station = $_POST["station"];
				#echo "station:".$station;
			}
			
			if(isset($_POST["year"]) )
			{
				$year = $_POST["year"];
			}
			
			if(isset($_POST["month"]) )
			{
				$month = $_POST["month"];
			}
			
			if(isset($_POST["day"]) )
			{
				$day = $_POST["day"];
				
			}
			#echo "DAY: ".$day;
		?>
		
		<script language="JavaScript">
		
		function autoSubmit()
		{
			var formObject = document.forms['roost_form'];
			
			formObject.submit();
		}
		
		</script>
		
		<form name="roost_form" method="post" >
		
			<!-- STATION SELECTION -->
            <div id="column1">
            <strong>Station:</strong><br />
            <select id="selection" name="station" onChange="autoSubmit();">
				<option value="null"></option>
				
            
            <?php
				
				//POPULATE DROP DOWN MENU WITH STATIONS
				
				$sql = "SELECT `station` FROM  `roost_table` GROUP BY `station`";
				$all_stations = mysql_query($sql,$conn);
				
				while($row = mysql_fetch_array($all_stations))
				{        
					echo ("<option value=\"$row[station]\" " . ($station == $row["station"] ? " selected" : "") . ">$row[station]</option>");        
				}
				
				?>
			
            </select>
        
			
		    
            
		
		
			<br><br>
			</div>
			<!-- YEAR SELECTION BASED ON STATION VALUE -->
			<div id="column1">
			<?php
			
			if($station != null && $station != "null" )
			{
			
			?>
			<strong>Year:</strong><br />
			<select id="selection" name="year" onChange="autoSubmit();">        
				<option value="null"></option>
				
				<?php
				
				//POPULATE DROP DOWN MENU WITH COUNTRIES FROM A GIVEN REGION
				
				$sql = "SELECT  `year` FROM  `roost_table` WHERE  `station` =  \"$station\" GROUP BY  `year` ";
				$all_years = mysql_query($sql,$conn);
				
				while($row = mysql_fetch_array($all_years))
				{        
					echo ("<option value=\"$row[year]\" " . ($year == $row["year"] ? " selected" : "") . ">$row[year]</option>");        
				}
				
				?>
				
			</select>
			
			<?php
			
			}
			
			?>
			
			<br><br>
			</div>
            <div id="column1">
			<?php
			
			if($station != null && $station != "null" && $year != null && $year != "null")
			{
			
			?>
			<strong>Month:</strong><br />
			<select id="selection" name="month" onChange="autoSubmit();">
				<option value="null"></option>
				
				<?php
				
				//POPULATE DROP DOWN MENU WITH STATES FROM A GIVEN REGION, COUNTRY
				
				$sql = "SELECT  `month` FROM  `roost_table` WHERE  `station` =  \"$station\" and `year` =  \"$year\" GROUP BY  `month`";
				$all_months = mysql_query($sql,$conn);
				
				while($row = mysql_fetch_array($all_months))
				{
					echo ("<option value=\"$row[month]\" " . ($month == $row["month"] ? " selected" : "") . ">$row[month]</option>");        
				}
				
				?>    
				
			</select>
			
			<?php
			
			}
			
			?>
			
			<br><br>
			</div>
		
		
		</form>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <div id="column1">
        <?php
			
			if($month != null && $month != "null"  )
			{
			
		?> 
            
            <form name="roost_form" method="get" action="tool.xhtml">
            
            <input type="hidden" name="station" value="<?php echo $station; ?>" />
            <input type="hidden" name="year" value="<?php echo $year; ?>" />
            <input type="hidden" name="month" value="<?php echo $month; ?>" />
            <strong>Day:</strong><br />
			<select  id="selection"  name="day" >
				<option value="null"></option>
				
				<?php
				
				//POPULATE DROP DOWN MENU WITH CITIES FROM A GIVEN REGION, COUNTRY, STATE
				
				$sql = "SELECT  `day` FROM  `roost_table` WHERE  `station` =  \"$station\" AND `year` =  \"$year\" AND `month` =  \"$month\" GROUP BY  `day`";
				$all_days = mysql_query($sql,$conn);
				
				while($row = mysql_fetch_array($all_days))
				{
					echo ("<option value=\"$row[day]\" " . ">$row[day]</option>");        
				}
				
					  
				
				?>    
				<br><br>
			</select>
            
            
            
        <input type="submit" />
			
			
			
		</form>
		
       <?php
			
		}

			
		?>
        </div>
        
        
        
        
        
        
        
        
        
        
        
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
            
	  <br><br>


		


	</div>
	
</div> 
<!-- end #content -->

<!--<?php include('includes/sidebar.php'); ?> -->

<?php include('includes/footer.php'); ?>

	</div> <!-- End #wrapper -->

	</body>

</html>