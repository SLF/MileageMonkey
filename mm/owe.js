/* This file contains the rules etc. for the OneWorld explorer ticket
 */ 

var owe_hawaii    = "HNL|OGG|KOA|LIH";
var owe_westcoast = "LAS|LAX|OAK|PHX|PDX|SAN|SFO|SJC|SEA|YVR|SNA|LGB";
var owe_eastcoast = "BWI|BOS|CLT|CLE|FLL|HFD|BDL|MIA|EWR|JFK|LGA|MCO|PHL|PIT|RDU|SJU|YYZ|IAD|DCA|PBI";

var owe_mideast   = "ae|bh|eg|il|iq|ir|jo|kw|lb|ly|om|qa|sa|sd|sy|ye";

/*longhaul - this defines the countries to which only 2 flights are allowed to/from the UK */
var owe_longhaul  = owe_mideast + "|" +
					"al|" + // Albania
					"am|" + // Armenia
					"az|" + // Azerbaijan
					"ba|" + // Bosnia and Herzegovina
					"bg|" + // Bulgaria
					"cy|" + // Cyprus
					"dz|" + // Algeria
					"FNC|"+ // Madeira / Funchal
					"gr|" + // Greece
					"ge|" + // Georgia
					"hr|" + // Croatia
					"ly|" + // Libya
					"mk|" + // Macedonia
					"ma|" + // Morocco
					"mt|" + // Malta
					"ro|" + // Romania
					"rs|" + // Serbia
					"ru|" + // Russia
					"tn|" + // Tunisia
					"tr|" + // Turkey
					"ua|" + // Ukraine
					"yu";	// Yugoslavia


var owe_namerica  = "us|us-ak|us-hi|ca|mx|bz|gt|sv|hn|ni|cr|pa|aw|tt|gd|bb|lc|mq|dm|" +
			"gp|bl|mf|ag|kn|cw|bq|sx|vg|vi|pr|do|ht|jm|cu|ky|bs|bm|ai|tc";
var owe_samerica  = "co|ve|ec|pe|bo|cl|br|py|uy|ar|fk";
var owe_europe    = "ie|gb|is|no|se|fi|dk|ru-uw|ee|lv|lt|by|ua|am|az|ge|md|" +
			"ro|bg|tr|gr|mk|al|yu|ba|hr|si|rs|me|hu|sk|cz|pl|de|ch|it|" +
			"mt|pt|pt-20|pt-30|es|es-cn|es-ib|gi|fr|be|nl|lu|ma|dz|tn|eg|cy|at|sd|"+owe_mideast;

// owe_africa2 handles the second permissible European entry from some African countries - 
//	look for what is not present:

// owe_africa2:  all "normally" treated African countries
var owe_africa2   = "ao|bj|bw|bf|bi|cm|cv|cf|td|cg|gq|er|et|ga|gm|gn|gw|ci|ls|lr|mg|mw|ml|mr|mu|mz|na|ne|zr|re|rw|sn|sc|sl|so|za|sz|tg|tz|zm|zw";

// owe_africa_second_eur_entry:	african countries from which a second EUR entry is permissible
var owe_africa_second_eur_entry = "gh|ke|ng|ug"; // if you change this, you need to change owe_africa2 also

// owe_africa:  all African countries (just add the above two together)
var owe_africa    = owe_africa2 + "|" + owe_africa_second_eur_entry;

var owe_asia      = "af|pk|in|np|bd|bt|bn|gu|pw|mm|id|sg|ru-ue|mv|my|th|kh|la|vn|cn|mn|kr|jp|ph|tw|hk|lk|kz|kg|tj|tm|uz";
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
 *		Note; from 0.95015, this rule will compare primary cities rather than the 
 *		actual ones specified...so if origin is actually LHR, and a transit point
 *		is LGW, then the origin is stored as LON, and the comparison will be done
 *		against LON
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
 *  0x4000 : if city pair is ORD & DEL, then don't process this rule
 *  0x8000 : AU trans-con rule exception - rule doesn't apply if either:
 *                   - origin is NZ, and JNB is included, or
 *                   - origin is PER and one of JNB/BOM/SHA/PEK is included
 *   alist: list of cities/countries
 *   blist: list of cities/countries
 *   count: max # of segments a<-->b
 *   descr: Description of rule
 */
var owe_rulemap = [
 [ 0x04, "***", "", 1, "Travel via original point of origin (or co-term) not permitted" ], /* filled in with origin airport */
 [ 0x04, "***", "", 1, "One intl departure/arrival from country of origin" ], /* filled in with origin country */
 [ 0x01, "ANC", owe_tc1, 1, "N.America - Anchorage" ],       /* one flight from ANC */
 [ 0x02, "ANC", owe_tc1, 1, "N.America - Anchorage" ],       /* one flight to ANC */
 [ 0x03, owe_hawaii, "us|ca|pr|vi", 1, "N.America - Hawaii" ],  /* max one segment to hawaii */ 
 [ 0x13, owe_eastcoast, owe_westcoast, 1, "North America Transcon" ],  /* max one transcon */
 [ 0x03, "gb",  owe_longhaul, 2, "UK <--> Middle East/Eastern Europe/North Africa" ],  /* max two longhaul segments from the UK */
 [ 0x8003, "PER", "SYD|CBR|CNS|BNE|MEL", 1, "Sydney/Canberra/Cairns/Brisbane/Melbourne - Perth" ], /* max one segment to perth */
 [ 0x03, "DRW", "MEL|SYD|CBR", 1, "Melbourne/Sydney/Canberra - Darwin (DRW)" ], /* max one segment to darwin */
 [ 0x03, "BME", "MEL|SYD|BNE", 1, "Melbourne/Sydney/Brisbane - Broome (BME)" ], /* max one segment to broome */
 [ 0x03, "KTA", "MEL|SYD|BNE", 1, "Melbourne/Sydney/Brisbane - Karratha (KTA)" ], /* max one segment to Karratha */
 
 [ 0x1b, "NRT", "GRU", 1, "Direct NRT-GRU or v.v. service is considered to touch North America, but MM doesn't count this yet - beware!" ],

 /* Intra-Continent segment limits */
 [ 0x13, owe_namerica, owe_namerica, 6, "North America" ],
 [ 0x13, owe_samerica, owe_samerica, 4, "South America" ],
 [ 0x13, owe_europe,   owe_europe, 4, "Europe" ],
 [ 0x13, owe_africa,   owe_africa, 4, "Africa" ],
 [ 0x13, owe_asia,     owe_asia,   4, "Asia" ],
 [ 0x13, owe_swp,      owe_swp,    4, "Southwest Pacific" ],


 /* ORD-DEL - (& back) treated as transatlantic */
 [ 0x23, "DEL", "ORD", 1, "ORD-DEL is transatlantic" ],   /* max one segment (transatlantic) */
 
 
 /* No backtracking between TC zones */
 [ 0x23, owe_tc1, owe_tc2, 1, "No backtracking: TC1-TC2" ],   /* max one segment from tc1-tc2 (transatlantic) */
 [ 0x03, owe_tc2, owe_tc3, 1, "No backtracking: TC2-TC3" ],   /* max one segment from tc2-tc3 */
 [ 0x4043, owe_tc3, owe_tc1, 1, "No backtracking: TC3-TC1" ],   /* max one segment from tc3-tc1 (transpacific) */

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
  "us|us-ak|us-hi|ca|pr|vi",/* between usa/canada */
  "dk|no|se",   /* Denmark/Norway/Sweden are considered one country */
  "hk|cn",      /* between hong kong/china */
  "my|sg",      /* between malaysia/singapore */
  "mv|in|lk",	/* between Maldives/India/Sri Lanka */
  owe_mideast,  /* within middle east */
  owe_africa    /* within africa */
];
