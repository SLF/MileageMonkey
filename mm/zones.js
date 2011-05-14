// Conventions used in this file
// There are generally three types of data kept in lists: airlines, airports, and countries
// By convention: airports and countries are in lowercase, airports and airline codes are in uppercase
// Airline codes and countries are two characters, airports are three
// If the list starts with '!', implies NOT in list

// Define some commonly used lists
var canaries = "SPC|VDE|GMZ|TFN|TFS|LPA|FUE|ACE";
var hawaii   = "HNL|OGG|KOA|LIH";
var c_amer   = "bz|gt|hn|sv|ni|cr|pa";
var n_samer  = "co|ve|ec|pe";
var s_samer  = "bo|py|br|uy|ar|cl";
var carib    = "aw|tt|bb|gd|vc|lc|mq|dm|gp|ag|ms|kn|an|vg|vi|pr|do|ht|cu|ky|jm|tc|bs";
var mideast  = "sy|lb|il|jo|sa|ye|om|ae|bh|qa|kw|iq|ir";
var seasia   = "vn|la|kh|th|my|sg|id|bn|tl";

var distmap = new Array();
var awardmap = new Array();
var zonemap = new Array();
var partnermap = new Array();

/* Partnermap is a mapping of which airlines can be used between different zones. 
 * [ fromzone, tozone, airlist ]
 *   fromzone,tozone: index into zonelist
 *   airlist : list of airlines valid between these two zones
 *
 *  -1 implies all zones
 */

// Asiamiles partners
var asiapartners = "EI|AS|AA|BA|CX|MU|KA|AY|GF|IB|JL|EG|LA|QF|BI|SA|LX|VN";

partnermap["ba oneworld"] = [
 [ -1, -1, "AA|BA|LA|LP|EI|IB|AY|CX|QF|XL" ],
];
partnermap["asiamiles ow"] = [
 [ -1, -1, "EI|AS|AA|BA|CX|MU|KA|GF|QF|BI|LX|VN" ]
];
partnermap["asiamiles oneworld"] = [
 [ -1, -1, "EI|AA|BA|CX|QF|LA|AY|IB" ]
];
partnermap["asiamiles rt"] = [
 [ -1, -1, "EI|AS|AA|BA|CX|MU|KA|AY|GF|IB|JL|LA|QF|BI|SA|LX|VN" ]
];
partnermap["aa oneworld"] = [
  [ -1, -1, "AA|BA|LA|LP|EI|IB|AY|CX|QF" ],
];
partnermap["qf oneworld"] = [
  [ -1, -1, "AA|BA|LA|LP|EI|IB|AY|CX|QF|XL" ],
];
partnermap["qf select (r/t)"] = [
 [ -1, -1, "QF|4N|FJ|AA|AO|FQ|BA|BN|JQ|NC|YE|UQ|PH|QantasLink|XR|CQ" ],
];
partnermap["qf other (r/t)"] = [
  [ -1, -1, "AZ|CC|LY|LX|PX|SA|SK|TL|US" ]
];
partnermap["dl"] = [
 [ -1, -1, "DL|AM|AF|AZ|KE" ]
];

/* distmap is of format:
 *  getmap(dist) : i=0; while(dist > map[i]) i++; return i;
 */

/* Qantas status credits map */
var qf_scmap = [
 [ 600,  10, 20, 40, 60 ],
 [ 1200, 15, 30, 60, 90 ],
 [ 2400, 20, 40, 80, 120 ],
 [ 3600, 25, 50, 100, 150 ],
 [ 4800, 30, 60, 120, 180 ],
 [ 5800, 35, 70, 140, 210 ],
 [ 7000, 40, 80, 160, 240 ],
 [ 8400, 45, 90, 180, 270 ],
 [ 9600, 50, 100, 200, 300 ],
 [ 15000, 60, 120, 240, 360 ]
];

/* Qantas awards map */
distmap["qf select (r/t)"] = [
 [ 2000,  20, 30, 40 ],
 [ 5400,  30, 45, 60 ],
 [ 10000, 50,100,125 ],
 [ 17500, 80,160,200 ],
 [ 30000,110,220,275 ]
];
distmap["qf.new select (o/w)"] = [
 [ 600,  8, 16, 24 ],
 [ 1200, 12, 24, 36 ],
 [ 2400, 18, 36, 54 ],
 [ 3600, 25, 50, 75 ],
 [ 4800, 30, 60, 90 ],
 [ 5800, 36, 72, 108 ],
 [ 7000, 42, 84, 126 ],
 [ 8400, 48, 96, 144 ],
 [ 9600, 56,112, 168 ],
 [ 15000,64,128, 192 ]
];

distmap["qf other (r/t)"] = [
 [ 2000, 25, 45, 65 ],
 [ 5400, 40, 60, 80 ],
 [ 10000,65,105,135 ],
 [ 17500,95,170,230 ],
 [ 30000,125,235,290 ]
];
distmap["qf.new other (o/w)"] = [
 [ 600,  10, 18, 26 ],
 [ 1200, 14, 26, 38 ],
 [ 2400, 20, 38, 56 ],
 [ 3600, 28, 53, 78 ],
 [ 4800, 35, 65, 95 ],
 [ 5800, 42, 78, 114 ],
 [ 7000, 50, 92, 134 ],
 [ 8400, 56,104, 152 ],
 [ 9600, 65,121, 177 ],
 [ 15000,75,139, 203 ],
];

distmap["qf oneworld"] = [
 [ 2000, 30, 60, 90 ],
 [ 5400, 50, 80, 110 ],
 [ 10000,70, 110, 150 ],
 [ 17500,100,175, 250 ],
 [ 35000,130,240, 300 ]
];
distmap["qf.new oneworld"] = [
 [ 1200, 32.5,62.5,92.5 ],
 [ 2400, 42.5,82.5,112.5 ],
 [ 4800, 57.5,112.5,167.5 ],
 [ 7200, 77.5,152.5,227.5 ],
 [ 9600, 87.5,172.5,257.5 ],
 [ 11600,102.5,202.5,302.5 ],
 [ 16800,122.5,242.5,362.5 ],
 [ 19200, 132.5,262.5,392.5 ],
 [ 35000, 142.5,282.5,422.5 ]
];

/* AA oneworld awards */
distmap["aa oneworld"] = [
 [ 1500, 30, 60, 80 ],
 [ 4000, 35, 75, 100 ],
 [ 9000, 60, 80, 100 ],
 [ 10000, 70, 90, 120 ],
 [ 14000, 90, 115, 150 ],
 [ 20000, 100,130, 180 ],
 [ 25000, 120,150, 230 ],
 [ 35000, 140,190, 280 ],
 [ 50000, 160,220, 330 ]
];

/* asiamiles */
distmap["asiamiles ow"] = [
 [ 600, 10, 20, 25 ],
 [ 1200, 15, 25, 30 ],
 [ 2500, 20, 30, 40 ],
 [ 5000, 25, 35, 55 ],
 [ 7500, 40, 60, 85 ],
 [ 10000, 55, 70, 110 ],
 [ 99999, 70, 90, 130 ]
];
distmap["asiamiles rt"] = [
 [ 600,  15, 40, 50 ],
 [ 1200, 25, 45, 55 ],
 [ 2500, 35, 50, 70 ],
 [ 5000, 45, 60, 90 ],
 [ 7500, 60, 100, 140 ],
 [ 10000,90, 120, 180 ],
 [ 99999,110,145, 210 ]
];
distmap["asiamiles oneworld"] = [
 [  1000, 30, 55, 70 ],
 [  1500, 30, 60, 80 ],
 [  2000, 35, 65, 90 ],
 [  4000, 35, 70, 95 ],
 [  7500, 60, 80, 105 ],
 [  9000, 60, 85, 115 ],
 [ 10000, 65, 95, 130 ],
 [ 14000, 85, 115, 155 ],
 [ 18000, 90, 135, 190 ],
 [ 20000, 95, 140, 205 ],
 [ 25000, 110, 160, 235 ],
 [ 35000, 130, 190, 275 ],
 [ 50000, 150, 220, 335 ]
];

/* British Airways oneworld */
distmap["ba oneworld"] = [
 [ 1500, 30, 60, 90 ],
 [ 4000, 35, 70, 105 ],
 [ 9000, 60,120, 180 ],
 [10000, 70,140, 210 ],
 [14000, 90,180, 270 ],
 [20000,100,200, 300 ],
 [25000,120,240, 360 ],
 [35000,140,280, 420 ],
 [50000,160,320, 480 ]
];

/* This file contains the mappings of zones and awards in two arrays
 * zonemap is used to store the different zones for each program
 *   each zone map entry contains a list of countries or airports, separated by '|'
 * awardmap contains the actual award amounts
 * Award map keeps track of values of awards between zones
 *
 * Format of awardmap is: <zone a>,<zone b>,<econ>,<biz>,<first>,<comment>
 */ 
var owe_hawaii    = "HNL|OGG|KOA|LIH";
var owe_westcoast = "LAS|LGB|LAX|OAK|SNA|PDX|SAN|SFO|SEA|SJC|YVR";
var owe_eastcoast = "BWI|BOS|FLL|BDL|MIA|EWR|JFK|LGA|MCO|PHL|SJU|YYZ|IAD|DCA";
var owe_longhaul  = "dz|am|az|bh|bg|cy|eg|gr|ge|ir|il|jo|kw|lb|mk|mt|ma|om|FNC|qa|ro|ru|sa|sy|tn|ae|ua|yu";

var owe_mideast   = "eg|sd|il|lb|sy|jo|ir|iq|kw|bh|qa|ae|om|ye|sa";
var owe_namerica  = "us|ca|mx|bz|gt|sv|hn|ni|cr|pa|aw|tt|gd|bb|lc|mq|dm|gp|ag|kn|an|vg|vi|pr|do|ht|jm|cu|ky|bs|bm|ai|tc";
var owe_samerica  = "co|ve|ec|pe|bo|cl|br|py|uy|ar|fk";
var owe_europe    = "ie|gb|is|no|se|fi|dk|ru|ee|lv|lt|by|ua|am|az|ge|md|ro|bg|tr|gr|mk|al|yu|ba|hr|si|hu|sk|cz|pl|de|ch|it|mt|pt|es|gi|fr|be|nl|lu|ma|dz|tn|eg|cy|at|"+owe_mideast;
var owe_africa    = "ao|bj|bw|bf|bi|cm|cv|cf|td|cg|gq|er|et|ga|gm|gh|gn|gw|ci|ke|ls|lr|ly|mg|mw|ml|mr|mu|ma|mz|na|ne|ng|zr|re|rw|sn|sc|sl|so|za|sz|tz|tg|ug|zm|zw";
var owe_africa2   = "ao|bj|bw|bf|bi|cm|cv|cf|td|cg|gq|er|et|ga|gm|gn|gw|ci|ls|lr|ly|mg|mw|ml|mr|mu|ma|mz|na|ne|zr|re|rw|sn|sc|sl|so|za|sz|tg|zm|zw";
var owe_asia      = "af|pk|kz|kg|uz|tm|tj|in|np|bd|bt|bn|mm|id|sg|my|th|kh|la|vn|cn|mn|kr|jp|ph|tw|hk|lk|SVX";
var owe_swp       = "au|nz|nc|pg|pf|to|ws";

var owe_tc1       = owe_namerica+"|"+owe_samerica;
var owe_tc2       = owe_europe+"|"+owe_africa;
var owe_tc3       = owe_asia+"|"+owe_swp;

/* Rulemap:
 *  each array contains the following
 *   flag: mask of bits. 
 *    0x01 : from in alist and to in blist
 *    0x02 : from in blist and to in alist
 *    0x04 : from in alist and to not in alist
 *    0x08 : if triggered, this rule is a warning only (doesn't terminate checking process)
 *    0x10 : display message in log
 *    0x20 : transatlantic
 *    0x40 : transpacific
 *    0x80 : from in alist & to in blist & next also in blist
 *   0x100 : europe
 *   0x200 : africa
 *   0x400 : asia
 *   0x800 : swp
 *  0x1000 : namerica
 *  0x2000 : samerica
 *   alist: list of cities/countries
 *   blist: list of cities/countries
 *   count: max # of segments a<-->b
 *   descr: Description of rule
 */
var owe_rulemap = [
 [ 0x04, "***", "", 1, "One intl departure/arrival from country of origin" ], /* filled in with origin country */
 [ 0x01, "ANC", owe_tc1, 1, "N.America - Anchorage" ],       /* one flight from ANC */
 [ 0x02, "ANC", owe_tc1, 1, "N.America - Anchorage" ],       /* one flight to ANC */
 [ 0x03, owe_hawaii, "us|ca|pr|vi", 1, "N.America - Hawaii" ],  /* max one segment to hawaii */ 
 [ 0x13, owe_eastcoast, owe_westcoast, 1, "North America Transcon" ],  /* max one transcon */
 [ 0x03, "gb",  owe_longhaul, 2, "UK <--> Middle East/Eastern Europe/North Africa" ],  /* max two longhaul segments from the UK */
 [ 0x03, "PER", "SYD|CNS|BNE|MEL", 1, "Sydney/Cairns/Brisbane/Melbourne - Perth" ], /* max one segment to perth */
 [ 0x03, "DRW", "MEL|SYD", 1, "Melbourne/Sydney - Darwin" ], /* max one segment to darwin */
 [ 0x03, "BME", "MEL|SYD", 1, "Melbourne/Sydney - Broome" ], /* max one segment to broome */

 /* Intra-Continent segment limits */
 [ 0x13, owe_namerica, owe_namerica, 6, "North America" ],
 [ 0x13, owe_samerica, owe_samerica, 4, "South America" ],
 [ 0x13, owe_europe,   owe_europe, 4, "Europe" ],
 [ 0x13, owe_africa,   owe_africa, 4, "Africa" ],
 [ 0x13, owe_asia,     owe_asia,   4, "Asia" ],
 [ 0x13, owe_swp,      owe_swp,    4, "Southwest Pacific" ],

 /* No backtracking between TC zones */
 [ 0x23, owe_tc1, owe_tc2, 1, "No backtracking: TC1-TC2" ],   /* max one segment from tc1-tc2 (transatlantic) */
 [ 0x03, owe_tc2, owe_tc3, 1, "No backtracking: TC2-TC3" ],   /* max one segment from tc2-tc3 */
 [ 0x43, owe_tc3, owe_tc1, 1, "No backtracking: TC3-TC1" ],   /* max one segment from tc3-tc1 (transpacific) */

 [ 3, owe_europe,     owe_africa2, 1, "Ghana/Nigeria/Kenya/Uganda/Tanzania transit (second EUR entry?)" ],

 /* Max entry/exit per continent */
 [ 0x03, owe_europe,   owe_tc1+"|"+owe_tc3+"|"+owe_africa,   4, "Europe entry/exit" ],
 [ 0x03, owe_asia,     owe_tc1+"|"+owe_tc1+"|"+owe_swp,      4, "Asia entry/exit" ],
 [ 0x03, owe_namerica, owe_tc2+"|"+owe_tc3+"|"+owe_samerica, 4, "North America entry/exit" ],
 [ 0x03, owe_africa,   owe_tc1+"|"+owe_tc3+"|"+owe_europe,   2, "Africa entry/exit" ],
 [ 0x03, owe_swp,      owe_tc1+"|"+owe_tc2+"|"+owe_asia,     2, "Southwest Pacific entry/exit" ],
 [ 0x03, owe_samerica, owe_tc2+"|"+owe_tc3+"|"+owe_namerica, 2, "South America entry/exit" ],

/* Check for continent entries and then subsequent sector - to detect violations of 
 * 2nd entry to continent for transit only (e.g. "transit without stopover": LHR-SIN-SYD=OK, LHR-BKK-SIN-SYD=NOT OK).
 * alist: continent we're arriving from
 * blist: continent we're testing for transit
 */
 [ 0x98, owe_tc1+"|"+owe_tc2+"|"+owe_swp, owe_asia, 1, "intercontinental entry to Asia without immediate transit & departure" ],
 [ 0x98, owe_tc2+"|"+owe_tc3+"|"+owe_samerica, owe_namerica, 1, "intercontinental entry to North America without immediate transit & departure" ]

];

/* Valid starting/ending zones for OWE explorers */
var owe_end_rules = [
  "***",        /* within country of origin - replaced later */
  "us|ca|pr|vi",/* between usa/canada */
  "dk|no|se",   /* Denmark/Norway/Sweden are considered one country */
  "hk|cn",      /* between hong kong/china */
  "my|sg",      /* between malaysia/singapore */
  "bd|SIN",     /* between bangladesh/singapore */
  "bd|BKK",     /* between bangladesh/bangkok */
  owe_mideast,  /* within middle east */
  owe_africa,   /* within africa */
  owe_samerica  /* within south america */
];

//==============================================
//
// British Airways - BA only awards
//
//==============================================
var ba_europe1    = "be|fr|de|ie|lu|nl|ch|gb";
var ba_europe2    = "at|hr|cz|dk|gi|hu|it|lv|no|pl|pt|es|se|yu";
var ba_europe3    = "bg|cy|ee|fi|gr|il|ly|lt|fnc|mt|ma|ro|ru|tn|tr|ua|"+canaries;
var ba_midcasia   = "am|az|bh|eg|ge|ir|kz|kw|kg|lb|om|qa|sa|sy|tj|ae|uz|ye|jo";
var ba_westafrica = "gm|gn|gh|ci|lr|ng|sn|sl";
var ba_ecsafrica  = "ao|bw|cm|dj|et|er|ke|mw|mu|na|rw|sc|za|sd|tz|cg|ug|zm|zw";
var ba_namerica   = "us|bm|ca";
var ba_samerica   = "ar|bo|br|cl|ec|py|pe|uy";
var ba_fareast    = "mm|cn|id|hk|jp|kr|my|ph|sg|tw|th|vn";
var ba_cbncamhi   = "ag|bs|bb|ky|co|gd|jm|mx|lc|tt|ve|"+hawaii;
var ba_sasia      = "bd|in|mv|pk|lk";
var ba_swp        = "au|nz";

/* BA Tier Credits map */
var ba_tcmap = [
 [ 2000, 20, 20, 40, 60 ],
 [ 15000,60, 60,120,180 ]
];

/* Only BA flights are valid */
partnermap["ba"] = [
 [ -1, -1, "BA" ],
];

zonemap["ba"] = [
  /* 0: Europe 1 */
    ba_europe1,
  /* 1: Europe 2 */
    ba_europe2,
  /* 2: Europe 3/North Africa */
    ba_europe3,
  /* 3: Middle East/Central Asia */
    ba_midcasia,
  /* 4: West Africa */
    ba_westafrica,
  /* 5: East/Central/South Africa */
    ba_ecsafrica,
  /* 6: North America */
    ba_namerica,
  /* 7: Caribbean/Central America/Hawaii */
    ba_cbncamhi,
  /* 8: South Asia */
    ba_sasia,
  /* 9: South America */
    ba_samerica,
  /* 10: Far East */
    ba_fareast,
  /* 11: South West Pacific */
    ba_swp
];

awardmap["ba"] = [
  /* Europe1 -> XXX */
  [ 0, 0, 12, 24, 36 ],
  [ 0, 1, 20, 40, 60 ],
  [ 0, 2, 25, 50, 75 ],
  [ 0, 3, 40, 80, 120 ],
  [ 0, 4, 40, 80, 120 ],
  [ 0, 5, 50, 100, 150 ],
  [ 0, 6, 50, 100, 150 ],
  [ 0, 7, 50, 100, 150 ],
  [ 0, 8, 50, 100, 150 ],
  [ 0, 9, 70, 140, 210 ],
  [ 0,10, 80, 160, 240 ],
  [ 0,11,100, 200, 300 ],

  /* Europe 2 -> XXX */
  [ 1, 1, 30, 60, 90 ],
  [ 1, 2, 35, 75, 105 ],
  [ 1, 3, 50, 100, 150 ],
  [ 1, 4, 50, 100, 150 ],
  [ 1, 5, 60, 120, 180 ],
  [ 1, 6, 60, 120, 180 ],
  [ 1, 7, 60, 120, 180 ],
  [ 1, 8, 60, 120, 180 ],
  [ 1, 9, 80, 140, 210 ],
  [ 1,10, 90, 160, 240 ],
  [ 1,11,110, 200, 300 ],

  /* Europe 3/North Africa -> XXX */
  [ 2, 2, 40, 80, 120 ],
  [ 2, 3, 55, 110, 165 ],
  [ 2, 4, 55, 110, 165 ],
  [ 2, 5, 65, 130, 195 ],
  [ 2, 6, 65, 130, 195 ],
  [ 2, 7, 65, 130, 195 ],
  [ 2, 8, 65, 130, 195 ],
  [ 2, 9, 85, 170, 255 ],
  [ 2,10, 95, 190, 285 ],
  [ 2,11,115, 230, 345 ],

  /* Middle East/Central Asia -> XXX */
  [ 3, 3, 70, 140, 210 ],
  [ 3, 4, 70, 140, 210 ],
  [ 3, 5, 80, 160, 240 ], 
  [ 3, 6, 80, 160, 240 ], 
  [ 3, 7, 80, 160, 240 ], 
  [ 3, 8, 80, 160, 240 ], 
  [ 3, 9,100, 200, 300 ],
  [ 3,10,110, 220, 330 ],
  [ 3,11,130, 260, 390 ],

  /* West Africa -> XXX */
  [ 4, 4, 70, 140, 210 ],
  [ 4, 5, 80, 160, 240 ], 
  [ 4, 6, 80, 160, 240 ], 
  [ 4, 7, 80, 160, 240 ], 
  [ 4, 8, 80, 160, 240 ], 
  [ 4, 9,100, 200, 300 ],
  [ 4,10,110, 220, 330 ],
  [ 4,11,130, 260, 390 ],

  /* ECS Africa -> XXX */
  [ 5, 5, "18/20", 40,  60, "in South Africa" ], 
  [ 5, 6, 90, 180, 270 ], 
  [ 5, 7, 90, 180, 270 ], 
  [ 5, 8, 90, 180, 270 ], 
  [ 5, 9,110, 220, 330 ],
  [ 5,10,120, 240, 360 ],
  [ 5,11,140, 280, 420 ],

  /* North America -> XXX */
  [ 6, 8, 90, 180, 270 ], 
  [ 6,10,120, 240, 360 ],
  [ 6,11,140, 280, 420 ],

  /* Caribbean/Central America/Hawaii -> XXX */
  [ 7, 7, 12, 24, 36 ],
  [ 7, 8, 90,180, 270 ],
  [ 7,10,120,240, 360 ],
  [ 7,11,140,280, 420 ],

  /* South Asia -> XXX */
  [ 8, 9, 110, 220, 330 ],
  [ 8,10, 120, 240, 360 ],
  [ 8,11, 140, 280, 420 ],

  /* South America -> XXX */
  [ 9, 9, 20, 40, 60 ],
  [ 9,10,140, 280,420 ],
  [ 9,11,160, 320,480 ],

  /* Far East -> XXX */
  [ 10,11, 50, 10, 150 ],

  /* Intra South Africa award */
  [ -10, "za", 18, 36, 54 ],
];

//==============================================
//
// British Airways - single partner awards
//
//==============================================
zonemap["ba other"] = zonemap["ba"];

/* Single-partner awards.. specific partners are valid per zone */
partnermap["ba other"] = [
 [ 0, 0, "EI|SN" ],
 [ 0, 1, "EI|IB|SN" ],
 [ 0, 2, "EI|AY|SN" ],
 [ 0, 3, "EK" ],
 [ 0, 4, "SN" ],
 [ 0, 5, "SN" ],
 [ 0, 6, "EI" ],
 [ 0, 7, "IB" ],
 [ 0, 8, "EK" ],
 [ 0, 9, "IB|LA" ],
 [ 0,10, "QF|CX|JL" ],
 [ 0,11, "QF|CX|JL" ],

 [ 1, 1, "IB" ],
 [ 1, 2, "IB|AY" ],
 [ 1, 3, "IB|EK" ],
 [ 1, 4, "IB" ],
 [ 1, 5, "IB" ],
 [ 1, 6, "IB" ],
 [ 1, 7, "IB" ],
 [ 1, 8, "EK" ],
 [ 1, 9, "IB|LA" ],
 [ 1,10, "CX|JL" ],
 [ 1,11, "QF|CX|JL" ],

 [ 2, 2, "AY" ],
 [ 2, 3, "EK" ],
 [ 2, 5, "IB" ],
 [ 2, 6, "AY" ],
 [ 2, 7, "IB" ],
 [ 2, 8, "EK" ],
 [ 2, 9, "IB|LA" ],
 [ 2,10, "AY|JL" ],
 [ 2,11, "QF|CX|JL" ],

 [ 3, 3, "EK" ],
 [ 3, 4, "EK" ],
 [ 3, 5, "EK" ],
 [ 3, 6, "EK" ],
 [ 3, 8, "EK" ],
 [ 3,10, "EK|CX" ],
 [ 3,11, "EK" ],

 [ 5, 8, "EK" ],
 [ 5,10, "EK|CX" ],
 [ 5,11, "QF|CX" ],

 [ 6, 6, "AA|AS|HP|CX" ],
 [ 6, 7, "AA|IB|HP|CX" ],
 [ 6, 8, "CX" ],
 [ 6, 9, "AA|LA" ],
 [ 6,10, "JL" ],
 [ 6,11, "QF" ],

 [ 7, 7, "AA" ],
 [ 7, 9, "AA|LA" ],
 [ 7,10, "JL" ],
 [ 7,11, "QF" ],

 [ 8,10, "CX|JL" ],
 [ 8,11, "QF|CX|JL" ],

 [ 9, 9, "LA" ],
 [ 9,10, "LA|JL" ],
 [ 9,11, "QF|LA" ],

 [ 10,10, "CX|JL" ],
 [ 10,11, "CX|JL|QF" ],

 [ 11, 11, "QF" ],
];

awardmap["ba other"] = [
  /* Europe1 -> XXX */
  [ 0, 0, 12, 24, 36 ],
  [ 0, 1, 20, 40, 60 ],
  [ 0, 2, 25, 50, 75 ],
  [ 0, 3, 40, 80, 120 ],
  [ 0, 4, 40, 80, 120 ],
  [ 0, 5, 50, 100, 150 ],
  [ 0, 6, 50, 100, 150 ],
  [ 0, 7, 50, 100, 150 ],
  [ 0, 8, 50, 100, 150 ],
  [ 0, 9, 70, 140, 210 ],
  [ 0,10, 80, 160, 240 ],
  [ 0,11,100, 200, 300 ],

  /* Europe 2 -> XXX */
  [ 1, 1, 20, 40, 60 ],
  [ 1, 2, 20, 40, 60 ],
  [ 1, 3, 50, 100, 150 ],
  [ 1, 4, 40, 80,  120 ],
  [ 1, 5, 60, 120, 180 ],
  [ 1, 6, 60, 120, 180 ],
  [ 1, 7, 60, 120, 180 ],
  [ 1, 8, 50, 100, 150 ],
  [ 1, 9, 70, 140, 210 ],
  [ 1,10, 70, 140, 210 ],
  [ 1,11, 90, 180, 270 ],

  /* Europe 3/North Africa -> XXX */
  [ 2, 2, 25, 50, 75 ],
  [ 2, 3, 50, 100, 150 ],
  [ 2, 5, 70, 140, 210 ],
  [ 2, 6, 65, 130, 195 ],
  [ 2, 7, 70, 140, 210 ],
  [ 2, 8, 50, 100, 150 ],
  [ 2, 9, 80, 160, 240 ],
  [ 2,10, 60, 120, 180 ],
  [ 2,11,100, 200, 300 ],

  /* Middle East/Central Asia -> XXX */
  [ 3, 3, 20, 40,  60 ],
  [ 3, 4, 50, 100, 150 ],
  [ 3, 5, 50, 100, 150 ],
  [ 3, 6, 80, 160, 240 ],
  [ 3, 8, 35, 70, 105 ],
  [ 3,10, 60,120, 180 ],
  [ 3,11, 90,180, 270 ],

  /* ECS Africa -> XXX */
  [ 5, 8, 75, 150, 225 ],
  [ 5,10, 70, 140, 210 ],
  [ 5,11, 70, 140, 210 ],

  /* North America -> XXX */
  [ 6, 6, 25, 50, 75 ],
  [ 6, 7, 35, 75,105 ],
  [ 6, 8, 80, 160, 240 ],
  [ 6, 9, 40, 80, 120 ],
  [ 6,10, 50,100, 150 ],
  [ 6,11, 80,160, 240 ],

  /* Caribbean/Central America/Hawaii -> XXX */
  [ 7, 7, 35, 70, 105 ],
  [ 7, 9, 50, 100, 150 ],
  [ 7,10, 50, 100, 150 ],
  [ 7,11, 75, 150, 225 ],

  /* South Asia -> XXX */
  [ 8,10, 40, 80, 120 ],
  [ 8,11, 70, 140, 210 ],

  /* South America -> XXX */
  [ 9, 9, 25, 50, 75 ],
  [ 9,10,140,280, 420 ],
  [ 9,11, 75,150, 225 ],

  /* Far East -> XXX */
  [ 10,10, 40, 80, 120 ],
  [ 10,11, 50,100, 150 ],

  /* Southwest Pacific -> XXX */
  [ 11,11, 50, 100, 150 ],

  /* Special Cases *
   *  -10 - intra-country award (and in same zone)
   *  -11 - inter-country award (and in same zone)
   */
  [ -10, ba_europe1,  12, 24, 36 ],
  [ -10, ba_europe2,  12, 24, 36 ],
  [ -10, ba_europe3,  12, 24, 36 ],
  [ -10, ba_namerica, 25, 50, 75 ],
  [ -10, ba_samerica, 20, 40, 60 ],
  [ -10, ba_fareast, 15, 30, 45 ],
  [ -10, ba_cbncamhi,  35, 70, 105 ],
  [ -10, ba_swp, 30, 60, 90 ]
];

//==============================================
//
// Northwest Airlines awards
//
//==============================================
var nwa_red = "NW|HP|CM|CO|KL|AX|AS|GQ|MA|HA|3M|DL";
var nwa_ppl = "KL|CM|CO|DL";
var nwa_ltg = "DL|KL|KQ|9W";
var nwa_dkb = "NW|KL|CO|MA|UX|XT|A6|DL";
var nwa_org = "NW|DL|9J|CO|5J|GA|MH|KL|JL";
var nwa_ltb = "MH|GA";

partnermap["nw"] = [
 [ 0, -1, nwa_red ],
 [ 1, -1, nwa_red ],
 [ 2, -1, nwa_red ],
 [ 3, -1, nwa_org ],
 [ 4, -1, nwa_org ],
 [ 5, -1, nwa_red ],
 [ 6, -1, nwa_red ],
 [ 7, -1, nwa_ppl ],
 [ 8, -1, nwa_dkb ],
 [ 9, -1, nwa_ltg ],
 [ 10, -1, nwa_ltg ],
 [ 11, -1, nwa_ltg ],
 [ 12, -1, nwa_ltb ]
];

zonemap["nw"] = [
  /* 0: North America */
    "us|ca",
  /* 1: Caribbean/Mexico */
    "ag|aw|bs|bb|bm|cu|do|ky|gp|ht|jm|mq|mx|an|pr|tt|tc|vi",
  /* 2: Hawaii */
    hawaii,
  /* 3: Central America */
    "bz|cr|sv|gt|hn|ni|pa",
  /* 4: Northern S. America */
    "co|ec|pe|gf|sr|ve",
  /* 5: Southern S. America */
    "ar|br|cl",
  /* 6: Europe */
    "al|at|az|be|cy|cz|dk|fi|fr|de|gb|gr|hu|ie|it|lu|mk|mt|nl|no|po|pt|ro|"+
    "ru|es|se|ch|tr|ua|yu",
  /* 7: Middle East */
    "bh|ir|il|jo|kz|kw|lb|om|qa|sa|sy|ae|uz",
  /* 8: Africa */
    "dz|ao|bj|bf|bi|cm|cf|td|cg|dj|eg|gq|et|ga|gh|gn|ci|ke|ly|mg|mw|ml|mr|"+
    "mu|ma|ne|ng|re|rw|sn|sc|za|sd|tz|tg|tn|ug|cd|zm|zw",
  /* 9: India */
    "bd|in|mv|np|pk|lk",
  /* 10: North Asia */
    "jp|kr|mn",
  /* 11: South Asia */
    "bn|my|kh|cn|gu|id|mh|my|fm|pw|ph|ROTA|SPN|sg|tw|th|TINIAN",
  /* 12: Australia/SWP */
    "as|au|fj|nz|pf"
];

awardmap["nw"] = [
  /* 0: North America -> XXX */
  [ 0, 0, 25, -1, 45 ],
  [ 0, 1, 35, -1, 75 ],
  [ 0, 1, 45, -1, 75, "interisland connection" ],
  [ 0, 2, 35, -1, 75 ],
  [ 0, 3, 35, 60, 60 ],
  [ 0, 4, 35, 70, 70 ],
  [ 0, 5, 50, -1, 90 ],
  [ 0, 6, 50, 100, 100 ],
  [ 0, 7, 90, 120, -1 ],
  [ 0, 8, 90, 120, -1 ],
  [ 0, 9, 90, 120, -1 ],
  [ 0,10, 60, 120, 120 ],
  [ 0,11, 60, 120, 120 ],
  [ 0,12, 100, 150, 200 ],

  /* Carib/Mexico -> XXX */
  [ 1, 1, 20, 40, 40 ],
  [ 1, 1, 30, 60, 60, "Delta" ],
  [ 1, 2, 35, -1, 75 ],
  [ 1, 2, 45, -1, 75, "interisland connection" ],
  [ 1, 3, 20, 40, 40 ],
  [ 1, 3, 35, 50, 50, "Delta" ],
  [ 1, 4, 20, 40, 40 ],
  [ 1, 4, 35, 70, 70, "Delta" ],
  [ 1, 5, 40, 80, 80 ],
  [ 1, 5, 50, 90, 90, "Delta" ],
  [ 1, 6, 50, 100, 100 ],
  [ 1, 7, 90, 120, -1 ],
  [ 1, 8, 90, 120, -1 ],
  [ 1, 9, 90, 120, -1 ],
  [ 1,10, 60, 120, 120 ],
  [ 1,11, 60, 120, 120 ],
  [ 1,12, 100,150, 200 ],

  /* 2: Hawaii -> XXX */
  [ 2, 2, 10, -1, -1 ],
  [ 2, 3, 35, 75, 75 ],
  [ 2, 4, 35, -1, 75 ],
  [ 2, 5, 50, -1, 90 ],
  [ 2, 6, 70, 120, 120 ],
  [ 2, 7, 110,140, -1 ],
  [ 2, 8, 110,140, -1 ],
  [ 2, 9, 110,140, -1 ],
  [ 2,10, 40, 60, 80 ],
  [ 2,10, 60, 90, 120, "Korean" ],
  [ 2,10, 60, 120,120, "Delta" ],
  [ 2,11, 40, 60, 80 ],
  [ 2,11, 70, 110, 140, "Korean" ],
  [ 2,12, 100,150,200 ],

  /* 3: Central America -> XXX */
  [ 3, 3, 15, 20, 20 ],
  [ 3, 4, 20, 40, 40 ],
  [ 3, 5, 40, 80, 80 ],
  [ 3, 6, 50, 100, 100 ],
  [ 3, 7, 80, 120, -1 ],
  [ 3, 8, 80, 120, -1 ],
  [ 3, 9, 80, 120, -1 ],
  [ 3,10, 60, 120, 120 ],
  [ 3,11, 60, 120, 120 ],
  [ 3,12, 100, 150, 200 ],

  /* 4: Northern S. America -> XXX */
  [ 4, 4, 20, 40, 40 ],
  [ 4, 5, 20, 40, 40 ],
  [ 4, 6, 90, 140, 140 ],
  [ 4, 7, 120, 210, 210 ],
  [ 4, 8, 120, 210, 210 ],
  [ 4, 9, 120, 210, 210 ],
  [ 4,10, 90, 140, 140 ],
  [ 4,11, 90, 140, 140 ],
  [ 4,12, 90, 140, 140 ],

  /* 5: Southern S. America -> XXX */
  [ 5, 5, 20, 40, 40 ],
  [ 5, 6, 90, 140, 140 ],
  [ 5, 7, 120, 210, 210 ],
  [ 5, 8, 120, 210, 210 ],
  [ 5, 9, 120, 210, 210 ],
  [ 5,10, 90, 140, 140 ],
  [ 5,11, 90, 140, 140 ],
  [ 5,12, 90, 140, 140 ],

  /* 6: Europe -> XXX */
  [ 6, 6, 25, 50, 50 ],
  [ 6, 7, 70, 110, -1 ],
  [ 6, 8, 70, 110, -1 ],
  [ 6, 9, 70, 110, -1 ],
  [ 6,10, 80, 120, 160 ],
  [ 6,11, 80, 120, 160 ],
  [ 6,12, 80, 120, -1 ],

  /* 7: Middle East -> XXX */
  [ 7, 8, 80, 120, 160 ],
  [ 7,10, 80, 120, 160 ],
  [ 7,11, 80, 120, 160 ],
  [ 7,12,110, 170, 220 ],

  /* 8: Africa -> XXX */
  [ 8, 8, 25, 50, -1 ],
  [ 8, 9, 80,120,160 ],
  [ 8,10, 100,150,200 ],
  [ 8,11, 120,180,240 ],
  [ 8,12, 120,180,240 ],

  /* 9: India -> XXX */
  [ 9, 9, 25, 50, -1 ],
  [ 9,10, 50, 70, 100 ],
  [ 9,11, 50, 70, 100 ],
  [ 9,12, 90, 140, 180 ],

  /* 10: N. Asia -> XXX */
  [ 10,10, 20, 30, 60 ],
  [ 10,10, 25, 30, 60, "continental" ],
  [ 10,10, 50, 70, 90, "korean" ],
  [ 10,11, 20, 30, 60 ],
  [ 10,11, 25, 30, 60, "continental" ],
  [ 10,11, 50, 70, 90, "korean" ],
  [ 10,12, 70,110,140 ],

  /* 11: S. Asia -> XXX */
  [ 11, 11, 20, 30, 60 ],
  [ 11, 11, 25, 30, 60, "continental" ],
  [ 11, 11, 50, 70, 100, "korean" ],
  [ 11, 12, 70,110,140 ],
  [ 11, 12, 80,120,160,"Korean" ],

  /* 12: SWP */
  [ 12, 12, 40, 60, 85 ],

  /* Special Cases *
   *  -10 - intra-country award (and in same zone)
   *  -11 - inter-country award (and in same zone)
   */
  [ -10, "jp", 15, 19, -1 ],
  [ -10, "kr", 15, 20, 20 ]
];

//==============================================
//
// American Airlines - AA Awards
//
//==============================================
var minearn = [
 [ "AA", "AA|AY|CX|LA|QF|BA", 500 ],
 [ "AA", "IB", 300 ],
 [ "AA", "EI", 250 ],
];

partnermap["aa"] = [
 [ -1, -1, "AA" ]
];

zonemap["aa"] = [
  /* 0: North America */
    "us|ca",
  /* 1: Mexico/Caribbean/Bahamas/Bermuda */
    "bs|bm|mx|ag|aw|bs|bb|vg|cu|dm|do|ky|gd|gp|ht|jm|mq|ms|pr|kn|lc|vc|tt|vi|vg",
  /* 2: Hawaii */
    hawaii,
  /* 3: Central America/Northern South America */
    "BZE|GUA|SAL|SJO|TGU|SAP|MGA|PTY|BOG|GYE|UIO|LIM|CCS|MAR",
  /* 4: Southern South America */
    "EZE|LPB|VVI|GRU|GIG|CNF|SCL|ASU|MVD",
  /* 5: Europe */
    "LHR|LGW|MAN|GLA|CDG|BRU|FCO|FRA|MAD|ZRH|DUB",
  /* 6: Japan */
    "NRT"
];

var aa_cbnoff="offpeak Sep 7-Nov 14";
var aa_camoff="offpeak Jan 16-Jun 14; Sep 7-Nov 14";
var aa_samoff="offpeak Mar 1-May 31; Aug 16-Nov 30";
var aa_euroff="offpeak Oct 15-May 15";
var aa_asaoff="offpeak Oct 1-Apr 30";

awardmap["aa"] = [
  /* North America -> XXX */
  [ 0, 0, 25, 45, 60 ],
  [ 0, 1, 25, 60, 80, aa_cbnoff ],
  [ 0, 1, 30, 60, 80 ],
  [ 0, 2, 35, 75, 95 ],
  [ 0, 3, 30, 60, 80, aa_camoff ],
  [ 0, 3, 35, 60, 80 ],
  [ 0, 4, 40, 90, 125, aa_samoff ],
  [ 0, 4, 60, 90, 125 ],
  [ 0, 5, 40, 90, 125, aa_euroff ],
  [ 0, 5, 60, 90, 125 ],
  [ 0, 6, 50, 90, 125, aa_asaoff ],
  [ 0, 6, 60, 90, 125 ],

  /* Mexico/Cbn -> XXX */
  [ 1, 1, 25, 60, 60, aa_cbnoff ],
  [ 1, 1, 30, 60, 60 ],
  [ 1, 2, 35, 75, 95 ],
  [ 1, 3, 30, 60, 80, aa_camoff ],
  [ 1, 3, 35, 60, 80 ],
  [ 1, 4, 40, 90, 125, aa_samoff ],
  [ 1, 4, 60, 90, 125 ],
  [ 1, 5, 40, 90, 125, aa_euroff ],
  [ 1, 5, 60, 90, 125 ],
  [ 1, 6, 50, 90, 125, aa_asaoff ],
  [ 1, 6, 60, 90, 125 ],

  /* Hawaii -> XXX */

  /* Central/Northern South America -> XXX */
  [ 3, 5, 70, 110, 140 ],

  /* Southern South America */
  [ 4, 5, 90, 140, 180 ],
];

//==============================================
//
// American Airlines - all Airline Award zones
//
//==============================================
partnermap["aa all"] = [
 [ 0, 3,   "AA|EI|BA|AY|IB|LY|SN|LX|TK" ],
 [ 0, 8,   "FJ|QF|TN" ],
 [ 1, -1, "AA|EI|BA|CX|AY|IB|LA|LP|QF|FJ|TN|AS|LY|TA|HA|JL|MX|SN|LX|A4|JJ|TK" ]
];

zonemap["aa all"] = [ 
  /* 0: North America */ 
    "us|ca|mx|bm|bs|ag|aw|ai|bb|vg|ky|cu|dm|do|gd|gp|ht|jm|mq|an|pr|lc|vc|kn|tc|tt|vi",
  /* 1: Central America/South America 1 */
    "bz|co|cr|sv|ec|gt|hn|ni|pa|pe|ve",
  /* 2: South America 2 */
    "ar|bo|br|cl|py|uy",
  /* 3: Europe */
    "al|am|at|az|by|be|ba|bg|hr|cy|cz|dk|ee|fi|fr|de|ge|gi|gr|gl|hu|is|ie|it|lv|"+
    "lt|lu|mk|mt|md|nl|no|pl|pt|ro|ru|sk|si|es|se|ch|tr|ua|gb|yu|"+canaries,
  /* 4: Indian Subcontinent/Middle East */
    "af|bh|bd|eg|in|ir|iq|il|jo|kz|kg|kw|lb|om|pk|sa|sy|tj|tm|ae|uz",
  /* 5: Africa */
    "dz|ao|bj|bw|bf|bi|cm|cv|cf|td|cg|gq|er|et|ga|gm|gh|gn|gw|ci|ke|ls|lr|ly|mg|mw|ml|mr|mu|MLN|"+
    "ma|mz|na|ne|ng|zr|re|rw|sn|sc|sl|so|za|sd|sz|tz|tg|tn|ug|zm|zw",
  /* 6: Asia1 */
    "cn|jp|kr|mn",
  /* 7: Asia2 */
    "bt|bn|gu|hk|id|la|my|mm|np|ph|spn|sg|lk|tw|th|vn",
  /* 8: South Pacific */
    "au|IPC|fj|pf|nc|nz|pg|to|ws",
  /* 9: Hawaii */
    hawaii
];

var aa_all_soff = " offpeak: Mar1-May31; Aug16-Nov30";  // south america off season
var aa_all_eoff = " offpeak: Oct15-May15";              // europe off season
var aa_all_aoff = " offpeak: Oct1-Apr30";               // asia off season

awardmap["aa all"] = [
  /* North America -> XXX */
  [ 0, 9, 35, 75, 95 ],

  /* Central America / South America 1 -> XXX */
  [ 1, 0, 35, 60, 80 ],
  [ 1, 1, 30, 60, "N/A" ],

  /* South America 2 -> XXX */
  [ 2, 0, 40, 90, 125, aa_all_soff ],
  [ 2, 0, 60, 90, 125 ],
  [ 2, 1, 40, 65, 80 ],
  [ 2, 2, 25, 45, 60 ],

  /* Europe -> XXX */
  [ 3, 0, 40, 90, 125 ,  "via Atlantic" + aa_all_eoff ],
  [ 3, 0, 60, 90, 125 ,  "via Atlantic" ],
  [ 3, 1, 90, 110, 140,  "via Atlantic" ],
  [ 3, 2, 100, 140, 180, "via Atlantic" ],
  [ 3, 3, 20, 40, "N/A" ],

  /* Indian Subcontinent/Middle East -> XXX */
  [ 4, 0, 75, 135, 180,  "via Atlantic" ],
  [ 4, 1, 120, 165, 205, "via Atlantic" ],
  [ 4, 2, 135, 180, 220, "via Atlantic" ],
  [ 4, 3, 40, 60, 80 ],
  [ 4, 4, 35, 50, 70 ],

  /* Africa -> XXX */
  [ 5, 0, 75, 150, 200,  "via Atlantic" ],
  [ 5, 1, 135, 180, 220, "via Atlantic" ],
  [ 5, 2, 150, 195, 235, "via Atlantic" ],
  [ 5, 3, 60, 75, 100 ],
  [ 5, 4, 60, 90, "N/A" ],
  [ 5, 5, 20, 35, "N/A" ],

  /* Asia 1 -> XXX */
  [ 6, 0, 50, 90, 125, "via Pacific" + aa_all_aoff ],
  [ 6, 0, 65, 90, 125, "via Pacific" ],
  [ 6, 3, 70, 105, 140 ],
  [ 6, 4, 45, 60, 90 ],
  [ 6, 5, 60, 100, 140 ],
  [ 6, 6, 20, 40, 60 ],

  /* Asia2 -> XXX */
  [ 7, 0, 70, 110, 135, "via Pacific" ],
  [ 7, 3, 70, 105, 140 ],
  [ 7, 4, 45, 60, 90 ],
  [ 7, 5, 60, 100, 140 ],
  [ 7, 6, 40, 60, 80 ],
  [ 7, 7, 30, 45, 65 ],

  /* South Pacific -> XXX */
  [ 8, 0, 75, 125, 145, "via Pacific" ],
  [ 8, 1, 80, 130, 150, "via Pacific" ],
  [ 8, 2, 75, 100, 150, "via Pacific" ],
  [ 8, 3, 90, 120, 160 ],
  [ 8, 4, 60, 90, 120 ],
  [ 8, 5, 75, 100, 150 ],
  [ 8, 6, 60, 90, 120 ],
  [ 8, 7, 50, 70, 90 ],
  [ 8, 8, 40, 60, 85 ],

  /* Interisland Hawaii */
  [ 9, 9, 10, "N/A", "N/A" ],

  /* Special Cases :
   *  -10 - both countries must be equal   (and in same zone?)
   *  -11 - both countries must be in list (and in same zone?)
   */
  [ -11, "us|ca", 25, 45, 60 ],
  [ -11, "au|nz", 20, 35, 55 ],
  [ -10, "ar|br|cl|fj|fi|ie|jp|mx|pe|es|ch|tr|gb", 20, 35, 55 ],
];

//==============================================
//
// Continental Airlines - award zones
//
//==============================================
zonemap["co"] = [
  /* 0: Lower48/Canada/Alaska */
    "us|ca",
  /* 1: Carib/Central America/Mexico */
    carib+"|mx|"+c_amer,
  /* 2: Hawaii */
    hawaii,
  /* 3: Asia */
    "jp|cn|hk|ph|tw|vn|la|kh|th|my|sg|bn|mm|gu",
  /* 4: Northern South America */
    "co|ec|gf|gy|pe|sr|ve",
  /* 5: Southern South America */
    "ar|bo|br|cl|py|uy",
  /* 6: Europe */
    "gb|fr|de|es",
  /* 7: South Pacific */
    "au|nz",
  /* 8: Indian Subcontinent/Africa/Middle East */
    "in|pk|np|lk",
  /* 9: Israel */
    "tlv",
  /* 10: Central America */
    c_amer
];

awardmap["co"] = [
 /* North America -> XXX */
 [ 0, 0, 25, "N/A", 45 ],
 [ 0, 0, 50, "N/A", 90, "EasyPass" ],
 [ 0, 1, 35, "N/A", 60 ],
 [ 0, 1, 70, "N/A", 120, "EasyPass" ],
 [ 0, 2, 35, "N/A", 75 ],
 [ 0, 2, 70, "N/A", 150, "EasyPass" ],
 [ 0, 3, 60, 90, 120 ],
 [ 0, 3,120,180, 240, "EasyPass" ],
 [ 0, 4, 35, "N/A", 70 ],
 [ 0, 4, 70, "N/A",140, "EasyPass" ],
 [ 0, 4, 50, "N/A", 90, "Delta" ],
 [ 0, 5, 50, "N/A", 90 ],
 [ 0, 5,100, "N/A",180, "EasyPass" ],
 [ 0, 6, 50, 80, 100 ],
 [ 0, 6,100,160, 200, "EasyPass" ],
 [ 0, 7, 80, 120, "N/A" ],
 [ 0, 7,120, 180, 220, "Evergreen" ],
 [ 0, 8, 90, 120, "N/A" ],
 [ 0, 8,140, 200, "N/A", "EasyPass" ],
 [ 0, 9, 70, 100, "N/A" ],
 [ 0, 9,140, 200, "N/A", "EasyPass" ],

 /* Carib/Central America/Mexico -> XXX */
 [ 1, 1, 15, 20, "N/A" ],
 [ 1, 1, 30, 40, "N/A", "EasyPass" ],
 [ 1, 4, 20, 40, "N/A" ],
 [ 1, 4, 40, 80, "N/A", "EasyPass" ],
 [ 1, 5, 40, 80, "N/A" ],
 [ 1, 5, 80,160, "N/A", "EasyPass" ],

 /* Hawaii -> XXX */
 [ 2, 2, 10, "N/A", "N/A", "Hawaiian" ],
 [ 2, 3, 40, 60, 80 ],
 [ 2, 3, 80,120,160, "EasyPass" ],
 [ 2, 6, 70, 100, 120 ],
 [ 2, 6,120, 180, 220, "EasyPass" ],
 [ 2, 7,120, 180, 220, "Evergreen" ],
 [ 2, 8, 110, 140, "N/A" ],
 [ 2, 8, 160, 220, "N/A", "EasyPass" ],
 [ 2, 9, 90, 120, "N/A" ],
 [ 2, 9, 160,220, "N/A", "EasyPass" ],

 /* Asia -> XXX */
 [ 3, 3, 25,  40, 60 ],
 [ 3, 3, 50,  80,120,  "EasyPass" ],
 [ 3, 3, 40,  70, 140, "Evergreen" ],
 [ 3, 3, 50,  80, 120, "EasyPass" ],
 [ 3, 5, 90, 140, 140 ],
 [ 3, 5,120, 240, 240, "EasyPass" ],
 [ 3, 6, 60, 100, "N/A" ],
 [ 3, 7, 50, 85,  "N/A", "+connect on NW" ],
 [ 3, 7,100, 140, 160, "Evergreen" ],

 /* Southern South America -> XXX */
 [ 5, 6, 90, 140, 140 ],
 [ 5, 6,120, 240, 240, "EasyPass" ],
 [ 5, 8,120, 160, "N/A" ],

 /* Europe -> XXX */
 [ 6, 6, 25, 50, "N/A" ],
 [ 6, 7, 80,120, "N/A" ],
 [ 2, 7,120, 180, 220, "Evergreen" ],
 [ 6, 8, 50, 80, "N/A" ]

];

//==============================================
//
// Delta Airlines - Skyteam award zones
//
//==============================================

/* Delta - Air Jamaica Awards */
partnermap["dl jm"] = [
  [ -1, -1, "JM" ]
];
zonemap["dl jm"] = [
 /* 0: US/Canada */
   "us|ca",
 /* 1: Caribbean */
   "",
 /* 2: Europe */
   ""
];
awardmap["dl jm"] = [
 [ 0, 1, 30, "N/A", 60, "J115/J315" ],
 [ 1, 2, 50, 80,   100, "J134/J234/J334" ],
 [ 1, 1, 30, "N/A", 40, "J114/J314" ]
];

/* Delta - Avianca awards */
partnermap["dl av" ] = [
 [ -1, -1, "AM" ],
];
zonemap["dl av"] = [
 /* 0: US/Canada */
   "us|ca",
 /* 1: Colombia */
   "co",
 /* 2: Carib/Lima */
   "|LIM",
 /* South America */
   ""
];
awardmap["dl av"] = [
 [ 0, 1, 35, 75, "N/A", "A125/A225" ],
 [ 0, 2, 50, 65, "N/A", "A127/A227" ],
 [ 0, 3, 75, 105,"N/A", "A121/A221" ],
];

partnermap["dl emirates"] = [ 
 [-1, -1, "EK" ]
];

zonemap["dl emirates"] = [
  /* Zone 0: UAE */
   "ae",
  /* Zone 1: Oman/Qatar/Bahrain */
   "om|qa|bh",
  /* Zone 2: Iran/Kuwait/Saudi/Yemen */
   "ir|kw|sa|ye",
  /* Zone 3: Cyprus/Jordan/Lebanon/Syria/Egypt */
   "cy|jo|lb|sy|eg",
  /* Zone 4: Greece/Turkey */
   "gr|tr",
  /* Zone 5: europe */
    "",
  /* Zone 6: India/Pakistan */
    "in|pk",
  /* Zone 7: Bangladesh/Maldives/Sri Lanka */
    "bd|mv|lk",
  /* Zone 8: */
    "hk|sg|th|my",
  /* Zone 9: */
     "jp|id|ph",
  /* Zone 10: */
     "ma|dz|tn|ly|eg|ke|tz|ug",
  /* Zone 11: */
    "za",
  /* Zone 12: */
    "au"
];

awardmap["dl emirates"] = [
 [ 0, 1, 10, 25, 35 ],
 [ 0, 2, 25, 55, 80 ],
 [ 0, 3, 25, 55, 80 ],
 [ 0, 4, 40, 85, 125 ],
 [ 0, 5, 50, 105, 155 ],
 [ 0, 6, 25, 55, 80 ],
 [ 0, 7, 40, 85, 125 ],
 [ 0, 8, 55, 115, 170 ],
 [ 0, 9, 70, 145, 215 ],
 [ 0, 10, 45, 95, 140 ],
 [ 0, 11, 70, 145, 215 ],
 [ 0, 12, 90, 185, 275 ],
];

partnermap["dl skyteam"] = [
 [ -1, -1, "DL|AM|AF|AZ|KE" ]
];

zonemap["dl skyteam"] = [
  /* 0: Lower 48/Canada/Alaska */
    "us|ca",
  /* 1: Hawaii */
    hawaii,
  /* 2: Mexico/Caribbean/Bermuda */
    "mx|bm|ag|aw|bs|bb|vg|cu|dm|do|ky|gd|gp|ht|jm|mq|ms|pr|kn|lc|vc|tt|vi",
  /* 3: Central America */
    "bz|cr|sv|gt|hn|ni|pa",
  /* 4: Northern South America */
    "co|ec|gf|gy|pe|sr|ve",
  /* 5: Southern South America */
    "ar|bo|br|cl|py|uy",
  /* 6: Europe */
    "al|ad|at|by|be|ba|bg|hr|cy|cz|dk|ee|fi|fr|de|gr|hu|is|ie|it|lv|li|lt|"+
    "lu|mk|mt|md|mo|nl|no|pl|pt|ro|"+
    "ru|sm|sk|si|es|se|ch|tr|ua|gb|va|yu",
  /* 7: North Africa */
    "dz|eg|ly|ma|tn",
  /* 8: North Asia */
    "jp|kr|mn|VVO|UUS|KHV|RUSSIAN FAR EAST",
  /* 9: Southeast/Southwest Asia */
    "bn|kh|cn|id|la|my|mm|pg|ph|sg|tw|th|vn|GUM|SPN|pw|mh|mp|fm",
  /*10: Indian Subcontinent */
    "bd|bt|in|np|pk|lk",
  /*11: Israel/Middle East */
    "af|am|az|bh|ge|ir|iq|il|jo|kz|kw|kg|lb|om|qa|sa|sy|tj|tm|ae|uz|ye",
  /*12: Central Africa/South Africa */
    "bj|bf|bi|cm|cf|td|cg|ci|zr|dj|gq|er|et|ga|gm|gh|gn|gw|ke|lr|ml|mr|ne|"+
    "ng|rw|st|sn|sl|so|sd|tz|tg|ug|ao|bw|km|ls|mg|mw|mz|na|za|sz|zm|zw",
  /*13: Australia/New Zealand/South Pacific/Indian Ocean */
    "au|nz|"+
    "as|fj|pf|ki|nu|nc|sb|to|tv|vu|ws"+
    "mv|mu|re|sc"
  /* 14: RTW */
];

awardmap["dl skyteam"] = [
  /* Lower48 -> XXX */
  [ 0, 0, 25, "N/A", 45 ],
  [ 0, 1, 35, "N/A", 75 ],
  [ 0, 2, 30, "N/A", 60 ],
  [ 0, 3, 35, 60, "N/A" ],
  [ 0, 4, 35, 70, "N/A" ],
  [ 0, 5, 50, 90, "N/A" ],
  [ 0, 6, 50, 90, 100 ],
  [ 0, 7, 50, 90, 100 ],
  [ 0, 8, 60, 120, 140 ],
  [ 0, 9, 70, 120, 140 ],
  [ 0,10, 80, 120, 160 ],
  [ 0,11, 80, 120, 160 ],
  [ 0,12, 80, 120, 160 ],
  [ 0,13, 100,150, 200 ]

  /* Hawaii -> XXX */
  [ 1, 2, 35, "N/A", 75 ],
  [ 1, 3, 35, 75, "N/A" ],
  [ 1, 4, 35, 75, "N/A" ],
  [ 1, 5, 50, 90, "N/A" ],
  [ 1, 6, 50, 90, 100 ],
  [ 1, 7, 50, 90, 100 ],
  [ 1, 8, 60, 120, 140 ],
  [ 1, 9, 70, 120, 140 ],
  [ 1,10, 80, 120, 160 ],
  [ 1,11, 80, 120, 160 ],
  [ 1,12,100, 150, 200 ],
  [ 1,13,100, 150, 200 ],

  /* Mexico/Carib/Bda -> XXX */
  [ 2, 2, 30, "N/A", 60 ],
  [ 2, 3, 35, 60, "N/A" ],
  [ 2, 4, 35, 70, "N/A" ],
  [ 2, 5, 50, 90, "N/A" ],
  [ 2, 6, 50, 90, 100 ],
  [ 2, 7, 50, 90, 100 ],
  [ 2, 8, 60,120, 140 ],
  [ 2, 9, 70,120, 140 ],
  [ 2,10, 80,120, 160 ],
  [ 2,11, 80,120, 160 ],
  [ 2,12,100,150, 200 ],
  [ 2,13,100,150, 200 ]

  /* Central America -> XXX */
  [ 3, 6, 50, 90, 100 ],
  [ 3, 7, 50, 90, 100 ],
  [ 3, 8, 60, 120, 140 ],
  [ 3, 9, 90, 140, 180 ],
  [ 3,10,100, 150, 200 ],
  [ 3,11, 80, 120, 160 ],
  [ 3,12,100, 150, 200 ],
  [ 3,13,110, 170, 220 ],

  /* Northern S. America -> XXX */
  [ 4, 6, 60, 100, 120 ],
  [ 4, 7, 60, 100, 120 ],
  [ 4, 8, 70, 120, 140 ],
  [ 4, 9, 90, 140, 180 ],
  [ 4,10,100, 150, 200 ],
  [ 4,11,100, 140, 200 ],
  [ 4,12,100, 150, 200 ],
  [ 4,13,110, 170, 220 ],

  /* Southern S. America -> XXX */
  [ 5, 5, 20, 30, 40 ],
  [ 5, 6, 90, 140, 160 ],
  [ 5, 7, 90, 140, 160 ],
  [ 5, 8, 90, 140, 180 ],
  [ 5, 9, 120,175, 210 ],
  [ 5,10, 120,180, 240 ],
  [ 5,11, 110,150, 220 ],
  [ 5,12, 120,180, 240 ],
  [ 5,13, 120,180, 240 ],

  /* Europe -> XXX */
  [ 6, 6, 25, 45, "N/A" ],
  [ 6, 7, 30, 45, "N/A" ],
  [ 6, 8, 80, 120, 160 ],
  [ 6, 9, 80, 120, 160 ],
  [ 6,10, 50, 80, "N/A" ],
  [ 6,11, 40, 60, 80 ],
  [ 6,12, 70, 100, 140 ],
  [ 6,13, 100, 150, 200 ],

  /* North Africa -> XXX */
  [ 7, 7, 30, 45, "N/A" ],
  [ 7, 8, 80,120, 160 ],
  [ 7, 9, 80,120, 160 ],
  [ 7,10, 70, 110, 140 ],
  [ 7,11, 40, 60, 80 ],
  [ 7,12, 70, 110, 140 ],
  [ 7,13, 100, 150, 200 ],

  /* North Asia -> XXX */
  [ 8, 8, 25, 30, 60 ],
  [ 8, 9, 25, 30, 60 ],
  [ 8,10, 50, 70, 100 ],
  [ 8,11, 80, 120, 160 ],
  [ 8,12, 100,150, 200 ],
  [ 8,13, 70, 110, 140 ],

  /* SE/SW Asia -> XXX */
  [ 9, 9, 50, 70, 100 ],
  [ 9,10, 50, 70, 100 ],
  [ 9,11, 80,120, 160 ],
  [ 9,12,120,180, 240 ],
  [ 9,13,80,120,160 ],

  /* Indian Subcontinent -> XXX */
  [ 10, 11, 80, 120, 160 ],
  [ 10, 12, 80, 120, 160 ],
  [ 10, 13, 90, 140, 180 ],

  /* Israel/Middle East -> XXX */
  [ 11,11, 80, 120, 160 ],
  [ 11,12, 80, 120, 160 ],
  [ 11,13,110, 170, 220 ],

  /* Central/South Africa -> XXX */
  [ 12, 12, 80, 120, 160 ],
  [ 12, 13, 120, 180, 240 ],

  /* RTW */
  [ 14, 14, 140, 220, 280 ]
];

//==============================================
//
// United Airlines - Star Alliance zones
//
//==============================================
partnermap["ua star"] = [
  [ -1, -1, "AC|NZ|NH|OZ|OS|BM|LO|LH|SK|SG|JK|TG|UA|US|RG" ]
];

zonemap["ua star"] = [
  /* 0: North America */
    "us|ca",
  /* 1: Hawaii */
    hawaii,
  /* 2: Caribbean */
    "ag|aw|bs|bb|bz|bm|do|mq|pr|lc|vi",
  /* 3: Central America */
    "cr|sv|gt|hn|mx|pa",
  /* 4: South America */
    "ar|bo|br|cl|co|ec|py|pe|uy|ve",
  /* 5: Europe */
    "al|at|by|be|ba|bg|hr|cy|cz|dk|gb|ee|fi|fr|de|gr|hu|ie|it|kz|lv|lt|lu|"+
    "mk|mt|md|nl|no|pl|pt|ro|ru|si|es|se|ch|tr|tm|ua|yu",
  /* 6: Japan */
    "jp",
  /* 7: North Asia */
    "cn|gu|kr|tw",
  /* 8: South Asia */
    "bd|bn|kh|hk|id|la|my|mm|ph|sg|lk|th|vn",
  /* 9: Central Asia */
    "in|np|pk",
  /* 10: Australia/NZ */
    "au|nz",
  /* 11: Oceania */
    "ck|fj|pf|nc|nf|to|ws",
  /* 12: Middle East */
    "az|eg|ir|il|jo|kw|lb|om|sa|sy|ae|uz|ye",
  /* 13: Africa */
    "er|et|gh|ci|ke|ma|na|ng|za|sd|zw|"+canaries
];

awardmap["ua star"] = [
  /* North America -> XXX */
  [ 0, 0, 25, 40, 60 ],
  [ 0, 1, 35, 60, 80 ],
  [ 0, 2, 35, 60, 80 ],
  [ 0, 3, 35, 60, 80 ],
  [ 0, 4, 50, 80, 100 ],
  [ 0, 5, 50, 80, 100 ],
  [ 0, 6, 60, 90, 120 ],
  [ 0, 7, 60, 90, 120 ],
  [ 0, 8, 60, 90, 120 ],
  [ 0, 9, 80,120, 160, "via Atlantic" ],
  [ 0,10, 60, 90, 120 ],
  [ 0,11, 80,120, 150 ],
  [ 0,12, 75,115, 140 ],
  [ 0,13, 80,120, 160 ],

  /* Hawaii -> XXX */
  [ 1, 2, 35, 60, 80 ],
  [ 1, 3, 35, 60, 80 ],
  [ 1, 4, 50, 80, 100 ],
  [ 1, 5, 50, 80, 100 ],
  [ 1, 6, 40, 60, 90 ],
  [ 1, 7, 40, 60, 90 ],
  [ 1, 8, 60, 90, 120 ],
  [ 1, 9, 90, 120, 160, "via Atlantic" ],
  [ 1,10, 60, 90, 120 ],
  [ 1,11, 80,120, 150 ],
  [ 1,12, 75,115, 140 ],
  [ 1,13, 80,120, 160 ],

  /* Caribbean -> XXX */
  [ 2, 3, 35, 60, 80 ],
  [ 2, 4, 50, 80, 100 ],
  [ 2, 5, 50, 80, 100 ],
  [ 2, 6, 60, 90, 120 ],
  [ 2, 7, 60, 90, 120 ],
  [ 2, 8, 60, 90, 120 ],
  [ 2, 9, 80, 120,160, "via Atlantic" ],
  [ 2,10, 60, 90, 120 ],
  [ 2,11, 80,120, 150 ],
  [ 2,12, 80,120, 160 ],
  [ 2,13, 80,120, 160 ],

  /* Central America -> XXX */
  [ 3, 3, 25, 40, 60 ],
  [ 3, 4, 35, 60, 80,  "direct" ],
  [ 3, 4, 50, 80, 100, "via USA" ],
  [ 3, 5, 50, 80, 100 ],
  [ 3, 6, 60, 90, 120 ],
  [ 3, 7, 60, 90, 120 ],
  [ 3, 8, 60, 90, 120 ],
  [ 3, 9, 80,120, 160, "via Atlantic" ],
  [ 3,10, 60, 90, 120 ],
  [ 3,11, 80,120, 150 ],
  [ 3,12, 75,115, 140 ],
  [ 3,13, 80,120, 160 ],

  /* South America -> XXX */
  [ 4, 4, 25, 30, 40 ],
  [ 4, 5, 70, 100, 130 ],
  [ 4, 6, 90, 120, 150 ],
  [ 4, 7, 90, 120, 150 ],
  [ 4, 8, 90, 120, 150 ]
  [ 4, 9, 120,140, 180, "via Atlantic"  ],
  [ 3,10, 80, 120, 150 ],
  [ 3,11, 110,140, 180 ],
  [ 3,12, 80, 120, 150 ],
  [ 3,13, 110,140, 180 ],

  /* Europe -> XXX */
  [ 5, 5, 20, 40, "N/A", "cheaper for BMI" ],
  [ 5, 6, 70, 105, 140, "direct" ],
  [ 5, 6, 90, 135, 170, "via North America" ],
  [ 5, 7, 70, 105, 140, "direct" ],
  [ 5, 7, 90, 135, 170, "via North America" ],
  [ 5, 8, 70, 105, 140, "direct" ],
  [ 5, 8, 90, 135, 170, "via North America" ],
  [ 5, 9, 60, 80, 100 ],
  [ 5,10, 100,120,150, "direct" ],
  [ 5,10, 100,140,170, "via North America" ],
  [ 5,11, 90,135, 170 ],
  [ 5,12, 40, 60, 80 ],
  [ 5,13, 60, 75, 100 ],

  /* Japan -> XXX */
  [ 6, 6, 15, "N/A", "N/A" ],
  [ 6, 7, 20, 30, 40 ],
  [ 6, 8, 40, 60, 80, "cheaper for United" ],
  [ 6, 9, 50, 70, 90 ],
  [ 6,10, 50, 75, 100 ],
  [ 6,11, 70, 90, 120 ],
  [ 6,12, 50, 75, 100 ],
  [ 6,13, 70, 90, 120 ],

  /* North Asia -> XXX */
  [ 7, 7, 20, 30, 40 ],
  [ 7, 8, 40, 60, 80, "cheaper for United" ],
  [ 7, 9, 50, 70, 90 ],
  [ 7,10, 50, 75, 100 ],
  [ 7,11, 70, 90, 120 ],
  [ 7,12, 50, 75, 100 ],
  [ 7,13, 70, 90, 120 ],

  /* South Asia -> XXX */
  [ 8, 8, 20, 30, 40 ],
  [ 8, 9, 40, 60, 80 ],
  [ 8,10, 50, 75, 100 ],
  [ 8,11, 70, 90, 120 ],
  [ 8,12, 50, 75, 100 ],
  [ 8,13, 70, 90, 120 ],

  /* Central Asia -> XXX */
  [ 9,10, 40, 60, 80 ],
  [ 9,11, 50, 70, 90 ],

  /* Australia/NZ -> XXX */
  [ 10,10, 20, 30, 40 ],
  [ 10,11, 20, 40, 50 ],
  [ 10,12, 80,120, 150 ],
  [ 10,13,100,130, 160 ],

  /* Oceania -> XXX */
  [ 11, 11, 20, 30, 40 ],
  [ 11, 12, 80, 120, 150 ],
  [ 11, 13,100, 130, 160 ],

  /* Middle East -> XXX */
  [ 12, 13, 70, 90, 120 ]
];

// List of all zones in this file
var fOW = 0x1;
var fRT = 0x2;
var fPP = 0x4;
var fZN = 0x8;

/* Dist-award zones:
 *  flag, divisor, multiplier, code 
 */
var dist_award_zones = [
 [ fOW, 0.5, 1, "ba" ],         //  BA one-way tickets cost 0.5 amt for r/t
 [ fOW, 0.5, 1, "ba other" ],

 [ fRT, 1, 1, "ba" ],
 [ fRT, 1, 1, "ba other" ],

 [ fRT, 1, 1, "nw" ],
 [ fRT, 1, 1, "aa" ],
 [ fRT, 1, 1, "aa all" ],
 [ fRT, 1, 1, "co" ],
 [ fRT, 1, 1, "dl skyteam" ],
 [ fRT, 1, 1, "dl emirates" ],
 [ fRT, 1, 1, "ua star" ],

 // Zone-based awards, amt depends on total length
 [ fOW|fRT|fPP|fZN, 1, 1, "aa oneworld" ],
 [ fOW|fRT|fPP|fZN, 1, 1, "asiamiles oneworld" ],
 [ fOW|fRT|fPP|fZN, 1, 1, "ba oneworld" ],

 [ 0xE,      1, 1, "qf oneworld" ],
 [ fRT|fZN,, 1, 1, "qf select (r/t)" ],
 [ fRT|fZN,  1, 1, "qf other (r/t)" ],
 [ fOW|fZN,  1, 1, "qf.new select (o/w)" ],
 [ fRT|fZN,  1, 1, "qf.new select (o/w)" ],

 // Asiamiles R/T: based on one-way distance: tdist *= 0.5
 [ fOW|fPP|fZN, 1, 1,   "asiamiles ow" ],
 [ fRT|fPP|fZN, 1, 0.5, "asiamiles rt" ]
];
