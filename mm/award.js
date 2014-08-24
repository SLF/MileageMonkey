var tblcolor = [ "cevenx", "coddx" ];

/* MileageMonkey code
 *
 * $Id: award.htm,v 1.10 2006/02/23 21:12:23 root Exp root $
 * $Date: 2006/02/23 21:12:23 $
 * $Revision: 1.10 $
 *
 * $Log: award.htm,v $
 * Revision 1.10  2006/02/23 21:12:23  root
 * *** empty log message ***
 *
 * Revision 1.9  2005/08/17 02:51:26  root
 * Added list country codes feature
 *
 * Revision 1.8  2005/08/16 04:58:39  root
 * *** empty log message ***
 *
 * Revision 1.7  2005/06/16 02:19:00  root
 * Removed old QF mode
 *
 * Revision 1.6  2005/06/11 01:51:51  root
 * *** empty log message ***
 *
 * Revision 1.5  2005/02/21 13:00:34  root
 * Added searching by continent
 *
 * Revision 1.4  2005/02/19 05:43:45  root
 * Formatting fixes
 *
 *
 * Copyright (C) 2004-2005 by Jordan Hargraphix
 * All Rights Reserved
 */

var help0="The values in the econ/biz/first columns are the # of miles (in thousands) required for the award.<br>"+
          "Clicking on econ,biz,or first will sort the table<br>"+
          "NOTE:Some awards may not be valid due to routing";
var qf_help="# of Qantas SC's earned";
var ba_help="# of BA tier points earned. <a href='http://flyerguide.com/wiki/index.php/Booking_Classes_(BA)' target='_blank'>Note: Economy 'L' class (e.g. LONEx tickets) earn reduced BA tier points</a>";
var aa_help0="# of AAdvantage miles earned (base)";
var aa_help1="# of AAdvantage miles earned (GLD)";
var aa_help2="# of AAdvantage miles earned (PLT/EXP).";
var aa_elite = "  <a href='http://www.aa.com/aa/i18nForward.do?p=/AAdvantage/programDetails/eliteStatus/bonus.jsp' target='_blank'>Note: Elite Status Bonus miles do not apply to all carriers.</a>";
var ib_help="# of IberiaPlus points earned";
var la_help="# of LanPass km earned";

var cookie_pattern = "setMMearn";
var cookie_domain = window.location.host;

var earn_mapper = findmap;
var earn_map    = qf_scmap;
var earn_help   = qf_help;
var earn_elite  = "base";  // or ruby, sapphire, emerald

var 
	at_oweparams = "",
	at_p2pparams = "";

function findElement(id)
{
  if (document.getElementById) { return document.getElementById(id); }
  if (document.all) { return document.all(id); }
  return null;
}

function isdefined(variable) {
	return (typeof(variable) == "undefined") ? false : true;
}

function sethelp(str)
{
  findElement('helparea').innerHTML = str;
}

// Retreive text value field (always return upper case)
function getTextValue(id)
{
  var str = findElement(id).value.toUpperCase();
  return str.replace(/\s/g,'');
}

function addlog(logmsg)
{
  var log = findElement('logarea');
  log.innerHTML += logmsg + "<br>";
}

function setowestatus(info,state)
{
  var owestatusfield = findElement('owestatus');
  var color = "ffffff";
  if(state == 1) { color = "ff3333"; }
  if(state == 2) { color = "33ff33"; }

  if(info == 1) { info = "Invalid"; }

  owestatusfield.innerHTML =
  	"<TABLE border=0 cellspacing=0 cellpadding=1><tr bgcolor=\"#"+
  	color+"\"><td>" + info + "</td></tr></table>";
  showLayer('owestatus',1);
}

function get_flight(request)
{
//	if(getRadioSetting('flightdb') == "hippo")
//	{
//		return flight_hippo[request];
//	}
//
	return fl[request];
}

function clearall()
{
  findElement('tablearea').innerHTML = "";
  findElement('logarea').innerHTML = "";
  findElement('awardarea').innerHTML = "";
  findElement('routearea').innerHTML = "";
  findElement('helparea').innerHTML = "";
  findElement('maparea').innerHTML = "";
  findElement('owestatus').innerHTML = "&nbsp;";
  clear_awards();
}

//========================================
// Display map from gcmap.com
//========================================
function setmap(route)
{
  var gcmap = findElement('maparea');
  var baseurl = "http://www.gcmap.com/map";
  var opts = "?MP=r&P="+route;
  var imgsuffix = "&MS=wls&MX=500x300&PM=*";
  gcmap.innerHTML = "<a href=\"" + baseurl +"ui" + opts + "\" target=\"_blank\">" +
				'<img src="' + baseurl + opts + imgsuffix + '" border=0></a>';
}

function setCookie(name, val)
{
	var expires = new Date();
	expires.setTime(3*365*86400*1000 + expires.getTime());
	var cc = name + "=" + val +
		"; domain=" + cookie_domain + "; expires=" +
			expires.toGMTString();
//	alert("setting cookie: " + cc);
	document.cookie = cc;
}

function setemap(earnProg, mapper, map, str, earnElite)
{
  earn_mapper = mapper;
  earn_map    = map;
  earn_help   = str;
  earn_elite  = earnElite;
  var flightDatabase = getRadioSetting('flightdb');

  if(earnProg  != readCookie("earnprog" )) { setCookie("earnprog",  earnProg); }
  if(earnElite != readCookie("earnelite")) { setCookie("earnelite", earnElite);}
  if(flightDatabase != readCookie("flightdb")) { setCookie("flightdb", flightDatabase); }
}

function getRadioSetting(id)
{
  var radio_array = document.getElementsByName(id);
  for(var i=0, len = radio_array.length; i < len; i++) {
  if (radio_array[i].checked === true) {
      return radio_array[i].value;
    }
  }
  return "";
}

//===============================================
// Set mile/point earning perference
//===============================================
function setearn()
{
  var earnProg = getRadioSetting('earn');
  var elite = getRadioSetting('elite');

  if (earnProg == "aa")    {
  	var aa_help = aa_help0;
  	var bonus = 0;	// decimal bonus miles ... 0.25 = 25% extra
  	if(elite == "emerald") {
  		aa_help = aa_help2 + aa_elite;
  		bonus = 1;
  	} else if(elite == "sapphire") {
  		aa_help = aa_help2 + aa_elite;
  		bonus = 1;
  	} else if(elite == "ruby") {
  		aa_help = aa_help1 + aa_elite;
  		bonus = 0.25;
  	}

  	setemap(earnProg, aamap, bonus, aa_help, elite);
  } else if (earnProg == "ba") {   setemap(earnProg, findmap, ba_tcmap, ba_help, elite); }
  else if (earnProg == "qf")   { setemap(earnProg, findmap, qf_scmap, qf_help, elite); }
//  if (earnProg == "ib")   { setemap(earnProg, findmap, ib_pointmap, ib_help, elite); }
  else if (earnProg == "la")   { setemap(earnProg, lamap, 1, la_help, elite); }
}

//===============================================
// Read cookie
//===============================================
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') { c = c.substring(1,c.length); }
		if (c.indexOf(nameEQ) === 0) {
			var rc = c.substring(nameEQ.length,c.length);
			return rc;
		}
	}
	if(name == "earnprog") { return "qf"; }
	if(name == "earnelite") { return "emerald"; }
	return "";
}


//===============================================
// Load earning program preference
//       called at page load, use cookie value if
//       it has been set. Set radio buttons
//===============================================
function loadearn()
{
  var earnProg = readCookie("earnprog");
  var defElite = readCookie("earnelite");
  var flightDatabase = readCookie("flightdb");

  if(earnProg.length > 2) {
  	defElite = earnProg.substr(2);
//  	earnPref = earnProg.substr(0,2);
  }

  var radio_array;
  var i;
  var len;

  radio_array = document.getElementsByName('earn');
  for(i=0, len = radio_array.length; i < len; i++) {
	radio_array[i].checked = (radio_array[i].value == earnProg) ? true : false;
  }

  radio_array = document.getElementsByName('elite');
  for(i=0, len = radio_array.length; i < len; i++) {
	radio_array[i].checked = (radio_array[i].value == defElite) ? true : false;
  }

  radio_array = document.getElementsByName('flightdb');
  for(i=0, len = radio_array.length; i < len; i++) {
	radio_array[i].checked = (radio_array[i].value == flightDatabase) ? true : false;
  }

  return 0;
}

//=============================
// Convert degrees to radians
//=============================
function deg2rad(deg)
{
    return deg * Math.PI / 180.0;
}

/* Searches MAP structure.. format is
*  [ AAA, ...... ],
*  [ BBB, ..... ],
*    ...
*  [ NNN, .......]
*
*  Assert: A <= B <= ... <= N
*
* Returns first row where val < XXX
*/
function findmap(map, val)
{
  for(var i=0; i<map.length; i++) {
    if (val < map[i][0]) return map[i];
  }
  return null;
}

function lamap(map, val)
{
  return [ 0, 	Math.floor(val * 1.6 + 0.5),
  				Math.floor(val * 1.6 + 0.5),
  				Math.floor(val * 1.6 * 1.25 + 0.5),
  				Math.floor(val * 1.6 * 1.5 + 0.5) ];
}

function aamap(map, val)
{
  return [ 0, Math.floor(val * (1 + map) + 0.5),
              Math.floor(val * (1 + map) + 0.5),
              Math.floor(val * (1.25 + map) + 0.5),
              Math.floor(val * (1.5 + map) + 0.5) ];
}

//==============================================
// Calculate Great Circle distance on a sphere
//==============================================
function spheredist(radius,lata,lnga,latb,lngb)
{
  var _lata = deg2rad(lata);
  var _latb = deg2rad(latb);
  var _lnga = deg2rad(lnga);
  var _lngb = deg2rad(lngb);

  with (Math) {
    return radius * acos(sin(_lata) * sin(_latb) + cos(_lata)*cos(_latb)*cos(_lnga-_lngb));
  }
}

//==========================================
// Calculate distance between two airports
//==========================================
function calcdist(from,to)
{
  var cfr = citycodes[from];
  var cto = citycodes[to];

  // Earth radius is 6371.2 kms according to gcmap.com (3958.88 miles)
  try {
    // Radius is 3963.00 seems to work better?
    return Math.floor(spheredist(3963.00, cfr[1], cfr[2], cto[1], cto[2]));
  }
  catch (e) {
    return 0;
  }
}

//==============================================
// Find country for a given airport
// Country codes are in lowercase by convention
//==============================================
function find_country(airport)
{
  var cpt = citycodes[airport];
  if (typeof cpt == 'undefined') {
  	return "xx";
  }
  if (cpt === null) {
    return "xx";
  }
  return cpt[0].toLowerCase();
}

//==============================================
// Determines OWE continent given a city code
//==============================================
function find_owe_continent(airport)
{
  var cc = citycodes[airport];
  if (typeof cc == 'undefined') {
  	return "xx";
  }
  if (cc === null) {
    return "xxx";
  }
  var cd = countrycodes[cc[0]];
  if (cd === null) {
    return "xxx";
  }
  return "~" + cd[1];
}

//========================================================
// Match an airport code/country code with zonemap
// Format of zonemap: arrays of strings, separated by '|'
//========================================================
function matchlist(zm, str)
{
  if(typeof(zm) == "undefined") { return -1; }
  if (zm === null) { return -1; }

  var zlist = zm.split('|');
  for(var i=0; i<zlist.length; i++) {
    var zs = zlist[i];

    if (zs == str) { return i; }
  }
  return -1;
}

//=================================
// Matches two strings (apt,country)
// Returns -1 if neither match
// Returns 0 if 1st string matches
// Returns 1 if 2nd string matches
//=================================
function matchlist2(list, str0, str1)
{
  if (list === null) { return -1; }

  var zlist = list.split('|');
  var mc = -1;
  for(var i=0; i<zlist.length; i++) {
    if (zlist[i] == str0) { return 0; }
    if (zlist[i] == str1) { mc=1; }
  }
  return mc;
}

//===========================================
// Lookup Zone Match for airport + country
// Searches airport+country at same time
//===========================================
function findzone2(program, airport, country)
{
  var zmap = zonemap[program];

  if (zmap === null) {
    return -1;
  }
  if (zmap === undefined) {
  	return -1;
  }
  var mc = -1;
  for(var i=0; i<zmap.length; i++) {
    var rc = matchlist2(zmap[i], airport, country);
    if (rc === 0) {
      return i; // found airport match, we are done
    }
    else if (rc == 1) {
      mc = i;   // found country match, keep searching
    }
  }
  return mc;
}

//=================================================
// Determine which zone an airport is located in
//=================================================
function findzone(program, airport)
{
  var fa = airport.toUpperCase();

  return findzone2(program, fa, find_country(fa));
}

//===============================
// Check special case zone maps
//===============================
function check_special(zm, from, fz, to, tz)
{
  var fc = find_country(from);
  var tc = find_country(to);

  // Zones must match?
  if (fz != tz) { return 0; }

  if (zm == null) { return 0; }
  if (zm[0] == -10) {
    /* Match single country only */
    if (fc != tc) { return 0; }
    if (matchlist(zm[1], fc) == -1) {
      return 0;
    }
    return 1;
  }
  if (zm[0] == -11) {
    /* Match either country */
    if (matchlist2(zm[1], from, fc) == -1) {
      return 0;
    }
    if (matchlist2(zm[1], to, tc) == -1) {
      return 0;
    }
    return 1;
  }
  return 0;
}

//=======================================
// Scans zones for a particular program
//=======================================
function scanzone(from, to, program, scale)
{
  var fz = findzone(program, from);
  var tz = findzone(program, to);
  var am = awardmap[program];
  var air = getpartners(fz, tz, program);

  if (fz < 0 || tz < 0 || am === null) {
    return;
  }
  /* Scan for special cases */
  for(var i=0; i<am.length; i++) {
    if (check_special(am[i], from, fz, to, tz)) {
      add_award(am[i][2]*scale,am[i][3]*scale,am[i][4]*scale,program+"____SPECIAL (" + am[i][1] + ")");
    }
  }

  /* Ok.. we have a zone for both city pairs - lookup award values */
  for(i=0; i<am.length; i++) {
    var amap = am[i];
    if (amap === null) { continue; }
    if (amap === undefined) { continue; }

    /* Check each entry in the award map for a from<->to match */
    if ((amap[0] == fz && amap[1] == tz))
    {
      descr = program + "____zone:("+fz+" & "+tz + ") : ";
      if (amap[5] != null) descr += amap[5];

      /* Found an award!!!! */
      add_award(amap[2]*scale,amap[3]*scale,amap[4]*scale,descr, air, calcdist(from, to));
    }
  }
}

function scanzones(from, to, index, type)
{
  for(var i=0; i<dist_award_zones.length; i++) {
    var dz = dist_award_zones[i];
    if ((dz[0] & type) == type) {
      scanzone(from, to, dz[3], dz[1]);
    }
  }
}

//==============================================
// Sorting functions - sort awards by cabin
//==============================================
function order(a,b)
{
  if (isNaN(a) && !isNaN(b)) { return -1; }
  if (isNaN(b) && !isNaN(a)) { return 1; }

  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}
function sort0(a,b)   { return order(a[0],b[0]); }
function sort1(a,b)   { return order(a[1],b[1]); }
function sort2(a,b)   { return order(a[2],b[2]); }
function sort3(a,b)   { return order(a[3],b[3]); }
function sort4(a,b)   { return order(a[4],b[4]); }
function sort5(a,b)   { return order(a[5],b[5]); }

function sortme(proc,cabins)
{
  award_tab.sort(proc);
  show_awards(1,cabins);
}

//==========================================
// Keep track of awards
//==========================================
var naward = 0;
var award_tab = new Array();

function clear_awards()
{
  naward = 0;
  award_tab.length = 0;
}

//============================
// Add an award to the array
//============================
function add_award(y,j,f,descr, airline, dist)
{
  if (y === "") {
    return;
  }
  if (airline === null) {
    airline="";
  }

  award_tab[naward] = [ y, j, f, airline, descr, dist ];
  naward++;
}

function Ctdstr(val, class_available)
{
  return "<td" + (class_available ? "" : " class=gray") + ">" + Math.abs(val) + "</td>";
}

//========================================
// Loop through all countries + airports
//========================================
function list_countries()
{
  var award = findElement('awardarea');

  var tstr = "<table border=1>";
  tstr += "<th>Code</th><th>OWE Region</th><th>Country Name</th><th>Airport Codes</th>";
  var i=0;
  for(var cc in countrycodes) {
    var tc = tblcolor[i % 2];
    i++;

    tstr += "<tr class=" + tc + ">";
    tstr += "<td>" + cc.toLowerCase() + "</td>";
    tstr += "<td>" + countrycodes[cc][1] + "</td>";
    tstr += "<td>" + countrycodes[cc][2] + "</td>";
    tstr += "<td class='cities'>";
    var nc=0;
    for(var ac in citycodes) {
      if (citycodes[ac][0] == cc) {
	if (nc && ((nc % 21) == 0)) {
	  tstr += "<br>";
	}
	else if (nc > 0) {
	  tstr += ",";
	}
	nc++;
        tstr += mapify(ac);
      }
    }
    if (nc == 0) {
      tstr += "&nbsp;";
    }
    tstr += "</td>";
    tstr += "</tr>";

  }
  tstr += "</table>";
  award.innerHTML = tstr;
}

//============================
function is_cabin_avail(route, cabin)
// route = e.g.  ABX-SYD
// cabin = 'y', 'p', 'j', or 'f'
//
// return, 0=no, 1=yes
{
	var services = get_flight(route);	// retrieve details like "QFDH3,y|QFDH4,y" when we pass in a route like "ABX-SYD"
	if(!isdefined(services)) {
		services = "";
	}

	if(cabin.length != 1) { return 0; }
	var valid = "ypjf";
	if(valid.indexOf(cabin) < 0) { return 0; }

	if(services.indexOf(cabin) >= 0) { return 1; }
	return 0;
}

//======================
// Display award table
//  sumit:
//           0==don't add a summary line;
//           1=do add a summary line at end
//  cabins:
//           0==normal output
//           1==change colouring for "unavailable" cabins (e.g. if no F)
//           2==as 1, and also observe "cabins" radio button (i.e. filter output)
//======================
function show_awards(sumit, cabins)
{
  var award = findElement('awardarea');
  var ny=0;
  var nj=0;
  var nf=0;
  var ndonex = 0; // special counter for DONEx (F in US instead of J)
  var nd=0;
  var linecount = 0;
  var earnProg = getRadioSetting('earn');

  if (naward == 0) {
    return;
  }

  var filter = "";
  if(cabins) {
  	filter = getRadioSetting('cabins');
  }

  /* Nice: Add ability to sort awards */
  var tstr = "<table border=1><td><table>";
  tstr += "<th onclick='javascript:sortme(sort0,"+cabins+");'>econ</th>";
  tstr += "<th onclick='javascript:sortme(sort1,"+cabins+");'>biz</th>";
  tstr += "<th onclick='javascript:sortme(sort2,"+cabins+");'>first</th>";
  if(cabins) {
	  tstr += "<th onclick='javascript:sortme(sort3,"+cabins+");'>Continents</th>";
	  tstr += "<th>A/C types</th>";
  	  tstr += "<th onclick='javascript:sortme(sort5,"+cabins+");'>Distance</th>";
  	  tstr += "<th onclick='javascript:sortme(sort4,"+cabins+");'>Sector</th>";
  } else {
	  tstr += "<th onclick='javascript:sortme(sort3,"+cabins+");'>Airlines</th>";
	  tstr += "<th onclick='javascript:sortme(sort5,"+cabins+");'>Distance</th>";
  	  tstr += "<th onclick='javascript:sortme(sort4,"+cabins+");'>Description</th>";
  }

  for(var i=0; i<naward; i++) {
    var tc = tblcolor[linecount % 2];
    var newline = "<tr class=" + tc + ">";
	var route = award_tab[i][4];
	var baCWLCY = 0;	// is this BA's special LCY-JFK service, and is the earn prog==BA?

	if((earnProg == "ba") && ((route == "LCY-JFK") || (route == "JFK-LCY"))) {
		baCWLCY = 1;
	}

    ny += Math.abs(award_tab[i][0]);
    nj += Math.abs(award_tab[i][baCWLCY ? 2 : 1]);
    nf += Math.abs(award_tab[i][2]);
    nd += award_tab[i][5];

	var hasY = 1;
	var hasP = 1;
	var hasJ = 1;
	var hasF = 1;


	var services = "";

	if(cabins) {
		services = get_flight(route);

		if(!isdefined(services)) {
			services = "";
		}

		hasY = is_cabin_avail(route,'y');
		hasP = is_cabin_avail(route,'p');
		hasJ = is_cabin_avail(route,'j');
		hasF = is_cabin_avail(route,'f');

		if(hasY + hasP + hasJ + hasF == 0) {
			hasY = hasP = hasJ = hasF = 1;	// db format screwed up ...
		}
	}
	
    newline += Ctdstr(award_tab[i][0], hasY);
    newline += Ctdstr(award_tab[i][baCWLCY ? 2 : 1], hasJ);
    newline += Ctdstr(award_tab[i][2], hasF);

	// special calculation to add up credits for DONEx tickets, two exception cases
	// 1. using segments in US where no business class is sold, and cabin booked is First
	// 2. BA operated LCY-JFK & vv; J-only cabin but earns F TPs on BA
	if(	(!hasJ && hasF) || baCWLCY) {
		ndonex += Math.abs(award_tab[i][2]);
	} else {
		ndonex += Math.abs(award_tab[i][1]);
	}

    newline += "<td>" + award_tab[i][3] + "</td>";
	if(cabins) {
	  if(services == "") {
    	newline += "<td>&nbsp;</td>";
      } else {
    	services = services.replace(/(\w\w)(\w\w\w),(\w+)/g, "$1&nbsp;$2&nbsp;($3)");
    	services = services.replace(/\|/g, "<br>");
    	newline += "<td>" + services + "</td>";
      }
    }

    newline += "<td>" + award_tab[i][5] + "</td>";
	if(cabins) {
    	newline += "<td>";
    	var citypair = award_tab[i][4];
    	newline += mapify(citypair.split(/\-/)[0]) + "-" +
    			mapify(citypair.split(/\-/)[1]) + "</td>";
    } else {
    	newline += "<td>" + award_tab[i][4] + "</td>";
    }

    newline += "</tr>";

	if( (cabins!=2) ||
		(filter == "")	||
		((filter == "y") && hasY) ||
		((filter == "p") && hasP) ||
		((filter == "j") && hasJ) ||
		((filter == "f") && hasF) )
	{
	   	tstr += newline;
	   	++linecount;
	}

  }
  if (sumit) {
    tstr += "<tr><td>" + ny + "</td><td>" + nj + "</td><td>" + nf + "</td><td>&nbsp;</td>";
    if(cabins) {
    	tstr += "<td>&nbsp;</td>";
    }
    tstr += "<td>"+nd+"</td></tr>";

    if(ndonex != nj) {
	    tstr += "<tr><td>&nbsp;</td><td colspan=2>(DONEx: " + ndonex + ")</td><td>&nbsp;</td>";
    	if(cabins) {
    		tstr += "<td>&nbsp;</td>";
    	}
	    tstr += "<td>&nbsp;</td></tr>";
    }
  }

  if(cabins) {
	tstr += "<tr><td colspan=7>" + linecount + " entries</td></tr>";
  } else {
	tstr += "<tr><td colspan=6>" + linecount + " entries</td></tr>";
  }

  tstr += "</table></td></table>";
  award.innerHTML = tstr;
}

var routes = new Array;
var nroute = 0;

function sortrt(proc, index) {
  routes.sort(function(a,b) { return order(a[index], b[index]); });
  show_routes();
}

function clear_route()
{
  nroute = 0;
  routes.length = 0;
}

function add_route(route,da,db)
{
  routes[nroute++] = [ route, da, db, da+db ];
}

function show_routes()
{
  var route = findElement('routearea');

  if (nroute == 0) {
    return;
  }

  /* Nice: Add ability to sort awards */
  var tstr = "<table border=1><td><table>";
  tstr += "<th onclick='javascript:sortrt(sortrt,0);'>Route</th>";
  tstr += "<th onclick='javascript:sortrt(sortrt,1);'>Distance A-B</th>";
  tstr += "<th onclick='javascript:sortrt(sortrt,2);'>Distance B-C</th>";
  tstr += "<th onclick='javascript:sortrt(sortrt,3);'>Distance A-B-C</th>";
  for(var i=0; i<nroute; i++) {
    var tc = tblcolor[i % 2];
    tstr += "<tr class=" + tc + ">";

    tstr += "<td>" + routes[i][0] + "</td>";
    tstr += "<td>" + routes[i][1] + "</td>";
    tstr += "<td>" + routes[i][2] + "</td>";
    tstr += "<td>" + routes[i][3] + "</td>";
    tstr += "</tr>";
  }
  tstr += "</table></td></table>";
  route.innerHTML = tstr;
}


//===============================
// Get synonym list for a city
//===============================
function get_synlist(apt)
{
  if (citysyns[apt] == null) {
    return [ apt ];
  }
  return citysyns[apt].split('|');
}

//===============================
// Find populate primary synonyms for a city, if they exist
// this is entirely automatically generated from the citysyns array
// We end up with "primary_citysyns[]" which contains mappings like:
//   LHR ==> LON
//   LGW ==> LON
//   LTN ==> LON   (etc.)
//===============================

var primary_citysyns = new Array;

function populate_primcitysyns()
{
  for(var i in citysyns) {
	var syns = citysyns[i].split('|');
	for (var j in syns) {
		primary_citysyns[syns[j]] = i;
	}
  }
}

function get_primcitysyn(apt)
{
  var psyn = primary_citysyns[apt];
  if(psyn == null) {
    return apt;
  }
  return psyn;
}

//=====================================================
// Checks if a flight exists A->B on certain airlines
//=====================================================
function flight_exists(from, to, airlines, max_cnx)
{
  var fsi = get_synlist(from);
  var tsi = get_synlist(to);

  /* Search synonyms for flight */
  for(var i=0; i<fsi.length; i++) {
    for(var j=0; j<tsi.length; j++) {
      var str = fsi[i] + "-" + tsi[j];
      if (get_flight(str) != null) {
        /* Flight exists.. return actual cities of flight segment */
        return str;
      }
    }
  }
  return 0;
}

//=====================================================
// Validate that the city codes exist in the database
//=====================================================
function validate(cities)
{
  for(var i=0; i<cities.length; i++) {
    var cfr = cities[i];
    if (cfr == "") {
      alert("Please enter a city");
      return 0;
    }
    if (citycodes[cfr] == null) {
      alert("Unknown city: " + cfr);
      return 0;
    }
  }
  return 1;
}

//=====================================================
// Display routing A->B,B->C,etc with distances
//=====================================================
function showtrip(cities,type)
{
  var tbl   = findElement('tablearea');
  var tdist = 0;

  clearall();

  // Validate list of cities
  if (!validate(cities)) {
    return -1;
  }

  /* Display distances between cities */
  var tstr = "<table border=1><td><table><th>From</th><th>To</th><th>Distance</th>";
  for (i=0; i<cities.length-1; i++) {
    var cfr = cities[i];
    var cto = cities[i+1];

    var dist = calcdist(cfr, cto);
    tdist += dist;

    tstr += "<tr class=" + tblcolor[i % 2] + "><td width=60>" + mapify(cfr) + "</td><td width=60>" + mapify(cto) + "</td><td>" + dist + "</td></tr>";
    scanzones(cfr, cto, i, type);
  }
  tstr += "<tr><td colspan=2>Total</td><td><b>" + tdist + "</b></td></table></td></table>";
  tbl.innerHTML = tstr;

  /* --== Display all distance-based awards ==-- */
  for(var i=0; i<dist_award_zones.length; i++) {
    var dz = dist_award_zones[i];
    if (!(dz[0] & fZN)) { continue; }

    if ((dz[0] & type) == type) {
      showdist_award(dz[3], dz[1], tdist * dz[2]);
    }
  }
  if (type & fOW) {
    clear_route();
    for(var flightiter in fl) {
      var fi = flightiter.split('-');
      var ffr = fi[0];
      var fto = fi[1];

      if (cfr == ffr) {
        var str = fto + "-" + cto;
        if (get_flight(str) != null) {
           add_route(flightiter+","+str, calcdist(cfr,fto), calcdist(fto,cto));
        }
      }
    }
  }
  show_routes();
  show_awards(1,0);
  sethelp(help0);

  return tdist;
}

// merge unique values in s2 into s1
function smerge(s1,s2)
{
  var ns1 = "";

  if (s2 == null) { return ""; }
  var ss2 = s2.split('|');
  if (ss2 == null) { return ""; }

  for(var i=0; i<ss2.length; i++) {
    if (ss2[i] == null) { continue; }

    var st = s1 + ns1;
    if (st.match(ss2[i]) == null) {
      ns1 += "|" + ss2[i];
    }
  }
  return ns1;
}

//===========================================
// Determine valid partners for given zones
//===========================================
function progmatch(z,i)
{
  if (z == -1) { return 1; }
  return (z == i);
}

function getpartners(fz,tz,program)
{
  var pm = partnermap[program];
  if (pm == null) { return ""; }
  var plist = "";

  for(var i=0; i<pm.length; i++) {
    var pi = pm[i];
    if (pi == null) { continue; }

    //===========================================
    // Merge airlines if different zones match
    if ((progmatch(pi[0], fz) && progmatch(pi[1], tz)) ||
        (progmatch(pi[1], fz) && progmatch(pi[0], tz)))
    {
      plist += smerge(plist, pi[2]);
    }
  }
  return plist;
}

function showdist_award(program, scale, dist)
{
  try {
    var air = getpartners(-1,-1,program);
    var m = findmap(distmap[program], dist);
     if (m != null) {
      add_award(m[1]*scale,m[2]*scale,m[3]*scale,program,air,dist);
    }
  }
  catch(e){
  }
}

function getcitylist(id)
{
  var citylist = getTextValue(id);

// remove any whitespace in the route, as that confuses things
  citylist = citylist.replace(/\s/g, "");
// permit "//" in addition to "," indicating a surface sector
  citylist = citylist.replace(/\/\//g, ",");
// permit ";" in addition to "," indicating a surface sector
  citylist = citylist.replace(/;/g, ",");
// permit -xXXX and -oXXX to indicate transit/stopover
  citylist = citylist.replace(/\-[oxOX](\w\w\w)/g, "-$1");

  return citylist;
}

function parseCityList(citylist)
{
  var cities = new Array;
  var ncities = 0;
  var lastcity="";

  setmap(citylist);

  var bob = citylist.split(',');
  for(var i=0; i<bob.length; i++) {
    var bc = bob[i].split('-');
    if (!validate(bc)) { return null; }
    if((lastcity.length == 3)) {
    	cities[ncities++] = [ lastcity, bc[0], "," ];
    }
    for(var j=0; j<bc.length-1; j++) {
      cities[ncities++] = [ bc[j], bc[j+1], "-" ];
      lastcity = bc[j+1];
    }
  }
  return cities;
}

//=============================
// Show one-way or return awards
//=============================
function showaward(flag)
{
  var from   = getTextValue('owfrom');
  var to     = getTextValue('owto');
  var cities;

  if(flag == fRT) {
	  cities = [ from, to, from ];
  } else {
	  cities = [ from, to ];
  }

  // Scan distance-based awards
  showtrip(cities, flag);
  setmap(from+"-"+to);
}


// requires that "at_oweparams" and "at_p2pparams" are pre-set with "escaped" HTML
function setlinks()
{
	var 
		at_params = "?",
		need_amp = 0,
		param;

	if(at_oweparams.length > 2) {
		if(need_amp) { at_params += "&"; }
		at_params += "owe=" + at_oweparams;
		need_amp = 1;
	}
	if(at_p2pparams.length > 2) {
		if(need_amp) { at_params += "&"; }
		at_params += "p2p=" + at_p2pparams;
		need_amp = 1;
	}
	
// handle OWE Planner section
	param = getTextValue('owplanfrom');
	if(param.length > 1) {
		if(need_amp) { at_params += "&"; }
		at_params += "owplanfrom=" + escape(param);
		need_amp = 1;
	}
	param = getTextValue('owplanto');
	if(param.length > 1) {
		if(need_amp) { at_params += "&"; }
		at_params += "owplanto=" + escape(param);
		need_amp = 1;
	}
	param = getTextValue('owplangt');
	if(param.length > 1) {
		if(need_amp) { at_params += "&"; }
		at_params += "owplangt=" + escape(param);
		need_amp = 1;
	}
	param = getTextValue('owplanlt');
	if(param.length > 1) {
		if(need_amp) { at_params += "&"; }
		at_params += "owplanlt=" + escape(param);
		need_amp = 1;
	}
	
	param = getRadioSetting('cabins');	// returns a text value; e.g. y,p,j, or f
	if(param.length > 0) {
		if(need_amp) { at_params += "&"; }
		at_params += "cabins=" + escape(param);
		need_amp = 1;
	}
	
// end OWE Planner section
	
	var sharelinkloc = findElement('sharelink');
	sharelinkloc.innerHTML = '<a href="' + at_params + '">Link to ...</a>';
    showLayer('sharing',1);
}


//=============================
// Show point-to-point awards
//=============================
function showp2p()
{
  var rawcitylist = getTextValue('citylist');
  var citylist = getcitylist('citylist');

  at_p2pparams = escape(rawcitylist);
  setlinks();

// replace ',' with '-'; we don't treat surface sectors specially here
  citylist = citylist.replace(/,/g, "-");

  var cities   = citylist.split("-");

  showtrip(cities, fPP);
  setmap(citylist);
}

//=============================
// Validate Oneworld Explorer
//=============================
var owe_count = new Array;

/* Match airport/country in rule list */
function matchrule(acode, ccode, rule)
{
  var rc = matchlist2(rule, acode, ccode);

  return (rc == -1) ? 0 : 1;
}

//==========================================
// Convert number to ordinal string
// eg. 1 -> 1st, 2 -> 2nd, 13 -> 13th, etc
//==========================================
function numstr(num)
{
  var str = num;
  var sfx = 'th';

  num %= 100;
  if (num < 10 || num > 13) {
    num %= 10;
    if (num == 1)      { sfx = 'st'; }
    else if (num == 2) { sfx = 'nd'; }
    else if (num == 3) { sfx = 'rd'; }
  }
  return str + sfx;
}

//==============================================================================
// mapify - take an airport code (e.g. LHR) as parameter,
// and return a url to change the map displayed to one centered
// on the lat./long. of this airport
//==============================================================================
function mapify(apt) {
	return "<a href=\"javascript:void set_gmap('" + apt + "')\" style=\"text-decoration:none\">" + apt + "</a>";
}

//==============================================================================
// set_gmap() - take an airport code (e.g. LHR) as parameter,
// and change the google map to be centered on this location
//==============================================================================
function set_gmap(apt) {
	var latitude = citycodes[apt][1];
	var longitude = citycodes[apt][2];
	var countryCode = find_country(apt);

	if ((latitude != null) && (longitude != null) && GBrowserIsCompatible()) {
		var map = new GMap2(document.getElementById("map_canvas"));
		map.setCenter(new GLatLng(latitude, longitude), 12);
		map.setMapType(G_HYBRID_MAP);
		document.getElementById("map_title").innerHTML = "Click Google link in lower left corner to open map in new window";

        // Create a base icon for all of our markers that specifies the
        // shadow, icon dimensions, etc.
// I tried this custom icon stuff...it is an API example page (icon-custom) on
// http://code.google.com/apis/maps/documentation/examples/index.html
// but it didn't work ... I didn't spend any time investigating...
//        var baseIcon = new GIcon();
//        baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
//        baseIcon.iconSize = new GSize(20, 34);
//        baseIcon.shadowSize = new GSize(37, 34);
//        baseIcon.iconAnchor = new GPoint(9, 34);
//        baseIcon.infoWindowAnchor = new GPoint(9, 2);
//        baseIcon.infoShadowAnchor = new GPoint(18, 25);

        // Creates a marker whose info window displays the letter corresponding
        // to the given index.
        function createMarker(point, airportCode) {
//          var aptIcon = new GIcon(baseIcon);
			var aptIcon = new GIcon(G_DEFAULT_ICON);
			var airportCodeLC = airportCode.toLowerCase();

          // Set up our GMarkerOptions object
          markerOptions = { icon:aptIcon, title: airportCode };
          var marker = new GMarker(point, markerOptions);

          GEvent.addListener(marker, "click", function() {
            marker.openInfoWindowHtml(
            	"Location: <b>" + airportCode + "</b>; Country: <b>" + countryCode + "</b><hr>" +
            	"Google search: " + airportCode + " + (" +
            			"<a href=\"http://www.google.com/search?q=" + airportCode + "+airport&hl=en\" target=\"_blank\">airport</a>, " +
            			"<a href=\"http://www.google.com/search?q=" + airportCode + "+hotel&hl=en\" target=\"_blank\">hotel</a>" +
            			")<br>&nbsp;<br>" +
            	"<a href=\"https://www.starwoodhotels.com/preferredguest/search/results/simple.html?complexSearchField=" + airportCode + "\" target=\"_blank\">Starwood</a> " +
            	"<a href=\"http://www.theairdb.com/airport/" + airportCode + ".html\" target=\"_blank\">theAirDB</a> " +
            	"<a href=\"http://www.airlinequality.com/Airports/Airport_forum/" + airportCodeLC + ".htm\" target=\"_blank\">SkyTrax reviews</a> " +
            	"<br>" +
            	"<a href=\"http://www.flightstats.com/go/Airport/airportDetails.do?airportCode=" + airportCode + "\" target=\"_blank\">FlightStats.com</a> " +
            	"<a href=\"http://gcmap.com/airport/" + airportCode + "\" target=\"_blank\">gcmap.com</a> " +
            	"<a href=\"http://en.wikipedia.org/wiki/" + airportCode + "\" target=\"_blank\">Wikipedia</a> "
            	);
          });
          return marker;
        }


//		map.openInfoWindow(map.getCenter(),document.createTextNode(apt));
		map.addOverlay(createMarker(new GLatLng(latitude,longitude), apt));
		map.addControl(new GSmallZoomControl());
		map.addControl(new GMapTypeControl());
		map.addControl(new GScaleControl());

		// find the primary IATA reference here, and add markers for all co-term airports
		var prim_city = get_primcitysyn(apt);
		if(prim_city != apt) {
			latitude = citycodes[prim_city][1];
			longitude = citycodes[prim_city][2];
			if((latitude != null) && (longitude != null)) {
				map.addOverlay(createMarker(new GLatLng(latitude,longitude), prim_city));
			}
		}
		var syns = citysyns[prim_city];
		if (syns != null) {
			var synloc = syns.split('|');
			for( var lindex in synloc) {
				var loc = synloc[lindex];
				latitude = citycodes[loc][1];
				longitude = citycodes[loc][2];
				if((latitude != null) && (longitude != null)) {
					map.addOverlay(createMarker(new GLatLng(latitude,longitude), loc));
				}
			}
		}
	}
}

//==============================================================================
function log_metro_code(apt) {
	// Have they used a city (non-airport) code? If so, this can get connecting flights wrong, so suggest that
	// they put in the specific code
	var syns = get_synlist(apt);
    for(var j=0; j<syns.length; j++) {
    	syns[j] = mapify(syns[j]);
    }
    var olist = syns.join(' | ');
	addlog("Note: for maximum accuracy please change " + mapify(apt) + " to a specific airport code: " + syns.join(' | '));
}

//==============================================================================

var owe_flag;

//==============================================================================
// check_owe_rules - run thru the OWE rules for this city pair
//
// from - from city
// to - to city
// to2 - the city following the to city
// surface - either "-" (for an air sector), or "," (for a surface sector)
// seg - segment number of this city pair
//
function check_owe_rules(from, to, to2, surface, seg)
{
  var fc = find_country(from);
  var tc = find_country(to);
  var tc2= "";
  if(to2 != null) { tc2 = find_country(to2); }
  var pfx = "";
  var ignoreerrs = findElement("ignoreerrors").checked;

  seg++;

  if(surface == ",") {
      addlog(seg + ": " + mapify(from) + "-" + mapify(to) + ": surface");
	  return -1; // OK
  }

	if(citysyns[from] != null) {
		log_metro_code(from);
		if((to != from) && (citysyns[to] != null)) {
			log_metro_code(to);
		}
	}

  //addlog("check_owe_rules: from:" + fc + ":" + from + " to:" + tc + ":" + to + " to2:" + to2);
  for(var i=0; i<owe_rulemap.length; i++) {
    if (owe_rulemap[i] == null) { continue; }

    var omap   = owe_rulemap[i];
    var flag   = omap[0];
    var frule  = omap[1];
    var trule  = omap[2];
    var ocount = omap[3];
    var odesc  = omap[4];
    var a = 0;
    var b = 0;
    var rc = 0;

	if (flag & 0x4000) {
		/* if city pair is ORD/DEL, then skip this rule */
		if( (to == "ORD" && from == "DEL") ||
			(to == "DEL" && from == "ORD") ) {
			continue;
		}
	}

    if (flag & 1) {
      /* Check if rule matches from -> to */
      a = matchrule(from, fc, frule);
      b = matchrule(to,   tc, trule);
      if (a && b) { rc=1; }
    }

    if (flag & 2) {
      /* Check if rule matches to <- from */
      a = matchrule(from, fc, trule);
      b = matchrule(to,   tc, frule);
      if (a && b) { rc=1; }
    }

    if (flag & 4) {
      /* Check if rule matches from && !to */
      var f2 = get_primcitysyn(from);
      var t2 = get_primcitysyn(to);
      a = matchrule(f2, fc, frule);
      b = !matchrule(t2,  tc, frule);
      if (a && b) { rc=1; }
    }

    if (flag & 0x80) {
      /* Check if rule matches from -> to */
      a = matchrule(from, fc, frule);
      b = matchrule(to,   tc, trule);
      var c = matchrule(to2, tc2, trule);
      if (a && b && c) { rc = 1; }
    }

    var dohop = '<a href="http://www.dohop.com/#a1=' + from + '&a2=' + to + '&d1=190608" target="_blank">' +
      			'<img src="dohop.jpg" alt="dohop" border=0></a>';

	dohop = ""; // while we await a response from dohop.com whether it's OK to point at them

    if (rc == 1) {
      owe_count[i]++;
      owe_flag |= flag;

      /* Add to log, display index #, route, description */
      if (flag & 0x10) {
        addlog(pfx+seg + ": " + dohop + mapify(from) + "-" + mapify(to) + ": " + numstr(owe_count[i]) + " of " + ocount + " (" + odesc + ")");
        pfx="*";
      }

      /* If rule is violated... stop processing */
      if (owe_count[i] > ocount) {
      	var err = (flag & 0x08) ? "<b>Possible rule violation!!!!" : "<b>Rule violated!!!!";
      	err += " [" + from + "-" + to;
		if(flag & 0x80) {
           err += "-" + to2;
        }
        addlog(err + "] Max " + owe_rulemap[i][3] +" segment(s): " + owe_rulemap[i][4] + "</b>");

      if(!ignoreerrs && !(flag & 0x08)) { return i; }
      }
    }
  }
  if (pfx == "") {
    addlog(seg + ": " + dohop + mapify(from) + "-" + mapify(to) + ": intercontinental");
  }
  return -1;
}

/*=====================================================
 * Validate OWE start/end rules
 * Must start or end within the same country or region
 *=====================================================*/
function check_owe_endrules(from,to)
{
  var fc = find_country(from);
  var tc = find_country(to);

  /* Setup first rule: start/end in same country */
  owe_end_rules[0] = fc;

  for(var i=0; i<owe_end_rules.length; i++) {
    var a = matchlist2(owe_end_rules[i], from, fc);
    var b = matchlist2(owe_end_rules[i], to, tc);

    // Itinerary start/end are in same region
    if (a >= 0 && b >= 0) {
      return 1;
    }
  }
  return 0;
}

//=========================================
// Return 'equivalent' countries
//=========================================
function map_country(apt)
{
  var 	fc = find_country(apt),
  		usacan = countrysyns["US"] + "|ca|pr|vi",
  		csy, ufc;
  		
  usacan = usacan.toLowerCase();
  ufc = fc.toUpperCase();
  csy = countrysyns[ufc.substr(0,2)];

  if (matchlist(usacan, fc) >= 0) 		{ return usacan; }
  if (matchlist("dk|se|no", fc) >= 0)	{ return "dk|se|no"; }
  if (matchlist(csy, fc) >= 0)			{ return csy; }
  return fc;
}

function validateowe()
{
  var tdist = 0;
  var dist;
  var ignoreerrs = findElement("ignoreerrors").checked;
  var fatalerr = 0;

  setowestatus("Wait...",0);

  clearall();
  setearn();

  populate_primcitysyns();

  /* build list of cities - allow open jaws like: lhr-jfk,dfw-syd etc*/
  var rawcitylist = getTextValue('owecitylist');
  var citylist = getcitylist('owecitylist');

  at_oweparams = escape(rawcitylist);
  setlinks();

  var cities = parseCityList(citylist);
  if (cities == null) {
    return -1;
  }

  var max_segments = 16;

/* Validate total count of segments */
  if (cities.length > max_segments) {
    setowestatus(1,1);
    addlog("<b>Rule violated!!! Maximum number of segments is " + max_segments + "!</b>");
    if(!ignoreerrs) { return -1; }
    ++fatalerr;
  }

  /* Reset rule error count */
  owe_flag = 0;
  for(var i=0; i<owe_rulemap.length; i++) {
    owe_count[i] = 0;
  }

  /* Duplicate sector check */
  var sectors = new Array;

  /* Setup fixup for rules - no transit of original point or country */
  owe_rulemap[0][1] = get_primcitysyn(cities[0][0]);
  owe_rulemap[1][1] = map_country(cities[0][0]);
  addlog("Origin: "+owe_rulemap[0][1]+" ("+owe_rulemap[1][1]+");&nbsp;&nbsp;");

  /* --== Validate rules for each city pair.. ==-- */
  for(i=0; i<cities.length; i++) {
    var nextcity = null;

	// if we have another sector after this one, check for the transit rules AAA-BBB-CCC
    if(i < (cities.length - 1)) {
		// what is the next city ... which field we choose depends if we have a surface sector
    	if(cities[i][1] == cities[i+1][0]) {
    		nextcity = cities[i+1][1];  // not a surface sector, choose next-to
    	} else {
    		nextcity = cities[i+1][0];	// a surface sector, choose next-from
    	}
    }

    var	badrule = check_owe_rules(cities[i][0], cities[i][1], nextcity, cities[i][2], i);
    if (badrule >= 0) {
      ++fatalerr;
      setowestatus(1,1);
      if(!ignoreerrs) { return -1; }
    }


	var sector = "";

	// if it's a surface sector, we don't need to check a flight exists :)

	if(cities[i][2] == ",") {
	      var s = find_owe_continent(cities[i][0])+"-"+find_owe_continent(cities[i][1]);
	      var flt1 = cities[i][0] + "," + cities[i][1];
	      sector =   cities[i][0] + "-" + cities[i][1];
		  add_award(0, 0, 0, flt1, s, 0);
	} else {
	    /* Check if flight exists A->B */
	    sector = flight_exists(cities[i][0], cities[i][1], "AA/AY/BA/CX/EG/IB/JC/JL/JO/KA/LA/LP/MA/NU/QF/RJ/XL/4M", 0);
	    if (sector == 0) {
	      addlog("<b>Error!!! No oneworld service exists " + cities[i][0] + "-" + cities[i][1]);
		  ++fatalerr;
	      setowestatus(1,1);
	      if(!ignoreerrs) { return -1; }
	      sector = cities[i][0] + "-" + cities[i][1];
	    }

	    /* Calculate distance A->B and # of points/miles earned */
	    dist = calcdist(cities[i][0], cities[i][1]);
	    var eamap = earn_mapper(earn_map, dist);
	    if (eamap != null) {
	      var sx = find_owe_continent(cities[i][0])+"-"+find_owe_continent(cities[i][1]);
	      add_award(eamap[1],eamap[3],eamap[4], sector, sx, dist);
	    }
	    tdist += dist;
	 }

	// now do duplicate sector processing
	if(sector != "") {
		 if((sectors[sector] === null) || (sectors[sector] === undefined)) {
	 		sectors[sector] = 1;	// remember in case we see this sector again
	 	} else {
	 		++fatalerr;
		 	addlog("<b>Error!!!   Duplicate sector " + sector);
			setowestatus(1,1);
	 	}
	 }
  }


  /* Ok.. routing is valid.. check end rules here
   *   Must start/end in same region
   *   Must cross both atlantic/pacific (eg: tc1-tc2 == 1, tc3-tc1 == 1)
   *     bleh.. hardcoded index for tc rules is bad
   */
  if (!(owe_flag & 0x20)) {
    addlog("<b>Rule violated!!! Must cross Atlantic!</b>");
	++fatalerr;
    setowestatus(1,1);
    if(!ignoreerrs) { return -1; }
  }
  if (!(owe_flag & 0x40)) {
    addlog("<b>Rule violated!!! Must cross Pacific!</b>");
	++fatalerr;
    setowestatus(1,1);
    if(!ignoreerrs) { return -1; }
  }
  if (!check_owe_endrules(cities[0][0], cities[cities.length-1][1])) {
    addlog("<b>Rule violated!!! Must start/end in same region/country!</b>");
	++fatalerr;
    setowestatus(1,1);
    if(!ignoreerrs) { return -1; }
  }

  /* Success!! */
  if(fatalerr) {
      var errtxt = " error" + (fatalerr==1?"":"s");
  	  setowestatus(fatalerr + errtxt,1);
  	  addlog("<h1>" + fatalerr + " serious" + errtxt + " detected.  This is likely to be an invalid itinerary ("  + tdist + " miles)</h1>");
  } else {
	  setowestatus("Valid!",2);
	  addlog("<h1>Congratulations!! Valid itinerary!!! - (" + tdist + " miles)</h1>");
  }
  sethelp(earn_help);
  show_awards(1,1);
  return 0;
}

function valid_field(str)
{
  if (str == "") {
    return str;
  }
  var lstr = str.toLowerCase();
  var ustr = str.toUpperCase();
  if (countrycodes[ustr] != null) {
    /* value is a country code.. convert to lowercase */
    return lstr;
  }
  if (citycodes[ustr] != null) {
    /* Check if city name is not valid */
    return str;
  }
  if (str.length == 4) {
    /* Value is a continent code */
    if (lstr == "~nam") { return lstr; }
    if (lstr == "~sam") { return lstr; }
    if (lstr == "~afr") { return lstr; }
    if (lstr == "~eur") { return lstr; }
    if (lstr == "~swp") { return lstr; }
    if (lstr == "~asa") { return lstr; }
    alert("Unknown continent: "+str+"\nUse one of:~nam|~sam|~afr|~eur|~swp|~asa");
  }
  return -1;
}

function matchlone(code, fi)
{
  var cc = find_country(fi);
  var tc = find_owe_continent(fi);

  /* Input: code is a location designator
   *			This may be an airport code (LHR), metro code (LON), country (gb), or continent (~eur):
   *			 blank, match anything
   *        	 two characters, match country
   *        	 three characters = match airport
   *        	 four characters = match continent
   *		fi is an airport code from the fl[] array
   *
   * Function: determine if 'code' matches 'fi'.  Examples:
   *	code=gb fi=LHR		MATCH
   *	code=LON fi=LHR		MATCH
   *	code=LHR fi=LHR		MATCH
   *	code=~eur fi=LHR	MATCH
   *	code=au fi=LHR		no match
   *	  etc.
   *
   * Returns:  1=match, 0=no match
   */
  fi = fi.toUpperCase();
  if (code == "") { return 1; }
  if (code == cc) { return 1; }
  if (code == tc) { return 1; }

  /* Match country synonyms */
  var clist = countrysyns[code.toUpperCase()];
  if (clist != null) {
    if (matchlist(clist, cc.toUpperCase()) >= 0) {
      return 1;
    }
  }
	  /* Didn't match country.. check synonyms */
  var fsi = new Array;
  fsi = get_synlist(code);
  for (var i=0; i<fsi.length; i++) {
    	if (fi == fsi[i]) { return 1; }
  }
  return 0;
}


/* map the "from" location using google maps */
function owemapfrom()
{
  var from = getTextValue('owplanfrom');
  if(from.length != 3) { alert("Map only works with a single airport code in the From field"); return; }
  set_gmap(from);
}

/* List all routes from A->XXX or XXX->B */
function oweplanner()
{
  var ifrom = getTextValue('owplanfrom');
  var ito   = getTextValue('owplanto');
  var migt = getTextValue('owplangt');
  var milt = getTextValue('owplanlt');

  clearall();
  setearn();
  sethelp("Click on table header to sort contents");
  setlinks();

  /* --== Check input values ==-- */
  if (from == "" && to == "" && migt == "" && milt == "") {
    alert("Please enter a value\n");
    return -1;
  }

  var count = 0;
  var destinations = "";
  var cabinfilter = getRadioSetting('cabins');

  var arrfrom = ifrom.split(',');
  for (var i in arrfrom) {	// iterate through multiple entries (e.g. if "de,nl" passed as icode)
	  var from = arrfrom[i];

  /* Support searching for country/continent */
  from = valid_field(from);
  if (from < 0) { return -1; } // invalid ... we'll already have alert()ed

  var arrto = ito.split(',');
  for (var i in arrto) {	// iterate through multiple entries (e.g. if "de,nl" passed as icode)
	  var to = arrto[i];

  to   = valid_field(to);
  if (to < 0) { return -1; }

  /* --== Loop through all flights and match ==-- */
  for(var flightiter in fl) {
    fi = flightiter.split('-');
    if (matchlone(from, fi[0])) {
      if (matchlone(to, fi[1])) {

	/* Found a matching flight... check distance, add to list */
	var d = calcdist(fi[0],fi[1]);

	/* Check if out of mile range */
    if ((migt > 0) && (d < migt)) continue;
    if ((milt > 0) && (d > milt)) continue;


	var emap = earn_mapper(earn_map, d);
	if (emap != null) {
	  add_award(emap[1],emap[3],emap[4],flightiter,"",d);
	  // build GCMAP string
	  if(count > 0) {
		destinations += ",";
	  }

	  var route = fi[0] + "-" + fi[1];
	  if(is_cabin_avail(route, cabinfilter)) {
		  destinations += route;
		 count++;
	  }
	 }
     }
    }
  }
  }
  }
  if (count == 0) {
    alert("No flights found");
  }
  else {
    show_awards(0,2);
    setmap(destinations);
  }
  return 0;
}
function awardhelp()
{
  alert("These functions are used to help plan your award itinerary by showing the number of miles required for your segments."
  );
}

function ephelp()
{
  alert("Choose your frequent flyer program.  If you have cookies enabled\n" +
  		"in your browser, this selection will be remembered for next time."
  );
}

function elitehelp()
{
  alert("Choose your elite status level in your frequent flyer program.  " +
  		"Note, this value is currently only used to adjust AA miles earned.\n\n" +
  		"If you have cookies enabled " +
  		"in your browser, this selection will be remembered for next time."
  );
}

function sharehelp()
{
  alert("This option lets you share your itinerary to Twitter, Facebook, email etc.\n\n" +
  		'Be sure to press "Go!" in the Point-to-point and/or Oneworld Explorer Validator sections first!\n' +
  		"Both itineries will be included if they're specified\n"
 	  );
}

function owehelp()
{
  alert("This function tests if a OWE itinerary is valid. Enter a list of cities, eg. LHR-JFK-SYD-LHR." +
  	"You may also use open jaws, eg. LHR-LAX,JFK-SYD,MEL-LHR\n\n" +
  	"Other syntax options permitted are\n* whitespace (spaces, tabs, line breaks) is ignored\n* '//' or ';' " +
  	"may be used to designate a surface sector in addition to ','\n"+
  	"* '-xAAA' may be used to indicate a transit at AAA (this is ignored by the tool but may be useful for your planning purposes)\n" +
  	"* '-oAAA' may be used to indicate a stopover at AAA (this is ignored by the tool but may be useful for your planning purposes)\n" +
  	"\nThus, another valid itinerary is:  CAI-oLHR//LGW-xMCO-oMIA-  oSFO   ,LAX-oHKG-LHR-DXB\n\n" +
  	"The 'Ignore Errors' option will override the validator's rule checks, allowing the itinerary to be fully parsed. " +
  	"This should only be used if you suspect an error in the validator, but still want your itinerary to be displayed.\n\n"
  	);
}
function oweplanhelp()
{
  alert("This function can be used to help plan your OWE itinerary, typically by helping you determine where you "+
    "can get to (on OW services) from a given location/country/continent.\n"+
	"\nYou may display all flights from/to a city by leaving one of the fields blank. eg. to display all flights from CMH, select CMH in the From: field, and leave To: blank.\n"+
	"\nYou may test if a flight exists between two cities by specifying a value in both From: and To: fields.\n"+
	"\nYou may display all flights to/from a country by specifying a country code instead of an airport code (eg. gr for Greece, gb for Great Britain, etc). " +
		"Note that as Russia is split across Asia and Europe, you need to use either 'ru-ue' (east of Urals) or 'ru-uw' (west of Urals) instead of 'ru'. \n"+
	"\nSpecify continents by using one of the following: ~nam|~sam|~eur|~afr|~asa|~swp\n"+
	"  for the different OWE regions\n"+
	"\nSort the results by clicking on the Miles or Description header\n"+
        "\nYou may also use an integer in the Greater than/Less than fields, e.g.:\n"+
        "Show all flights under 900 miles from SCL:      From:SCL Less than:900\n"+
        "Show all flights over 900 miles from SCL:       From:SCL Greater than:900\n" +
	"\nMultiple parameters are possible, try From=gb,es and To=ch,at,str,muc\n" +
    "\nRestrict by cabins available: if you select 'F only', this will filter out all routes which don't have First class, "+
    "allowing you to make the best use of a AONEx ticket by choosing routes with F. "+
    "Note that this is only an approximation; the data is incomplete - if you notice a "+
    "discrepancy (e.g. a route on which F is offered but it is shown as Y & J only), please report this.\n" +
    "\nThe 'Map' button will take the city in the 'From' box and produce a Google map of the location"
    );
}

function toggleLayer(whichLayer)
{
  var style2 = findElement(whichLayer).style;
  style2.display = (style2.display == "block") ? "none" : "block";
}
function showLayer(whichLayer,shown)
{
  var style2 = findElement(whichLayer).style;
  style2.display = shown ? "block" : "none";
}

//==================================================================================
/*  Client-side access to querystring name=value pairs
	Version 1.2.3
	22 Jun 2005
	Adam Vandenberg
	URL in next line obfuscated as WebSense categorize it as malicious
	hXXp: //ada mv.com/de v/ javascript/querystring

	I (SLF) emailed Adam asking about copyright etc.  He replied:
		Use it in any way you see fit.
		As far as I’m concerned the code is in the public domain,
		though I could put an explicit BSD style license on it if you want.

*/
function Querystring(qs) { // optionally pass a querystring to parse
	this.params = new Object()
	this.get=Querystring_get

	if (qs == null)
		qs=location.search.substring(1,location.search.length)

	if (qs.length == 0) return

// Turn <plus> back to <space>
// See: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.13.4.1
	qs = qs.replace(/\+/g, ' ')
	var args = qs.split('&') // parse out name/value pairs separated via &

// split out each name=value pair
	for (var i=0;i<args.length;i++) {
		var value;
		var pair = args[i].split('=')
		var name = unescape(pair[0])

		if (pair.length == 2)
			value = unescape(pair[1])
		else
			value = name

		this.params[name] = value
	}
}

function Querystring_get(key, default_) {
	// This silly looking line changes UNDEFINED to NULL
	if (default_ == null) default_ = null;

	var value=this.params[key]
	if (value==null) value=default_;

	return value
}

//=====================================================================================
// set things up...
//
function initialize() {
	loadearn();
	var qs = new Querystring();
	var param, field, needOWEPlanner;

	param = qs.get("p2p","");
	if(param.length > 4) {
		field = findElement('citylist');
		field.innerHTML = param;
		showp2p();
	}

	param = qs.get("owe","");
	if(param.length > 4) {
		field = findElement('owecitylist');
		field.innerHTML = param;
		validateowe();
	}
	
// check the OWE planner section (5 inputs in total)
	needOWEPlanner = 0;	// assume none present
	param = qs.get("owplangt","");
	if(param.length > 0) {
		field = findElement('owplangt');
		field.value = param;
		needOWEPlanner = 1;
	}

	param = qs.get("owplanlt","");
	if(param.length > 0) {
		field = findElement('owplanlt');
		field.value = param;
		needOWEPlanner = 1;
	}
	
	param = qs.get("owplanfrom","");
	if(param.length > 1) {
		field = findElement('owplanfrom');
		field.value = param;
		needOWEPlanner = 1;
	}

	param = qs.get("owplanto","");
	if(param.length > 1) {
		field = findElement('owplanto');
		field.value = param;
		needOWEPlanner = 1;
	}
	
	param = qs.get("cabins","");
	if(param.length > 0) {
		var
			i,
			cabin_array = document.getElementsByName('cabins');
		
		for(i=0, len = cabin_array.length; i < len; i++) {
			cabin_array[i].checked = (cabin_array[i].value == param) ? true : false;
  		}
		// don't need to set needOWEPlanner if only this item is selected
	}

	if(needOWEPlanner) { oweplanner(); }
// end of OWE planner section
	
}
//==================================================================================
