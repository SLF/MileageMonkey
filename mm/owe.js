/* This file contains the rules etc. for the OneWorld explorer ticket
 */ 

var owe_hawaii    = "HNL|OGG|KOA|LIH";
var owe_westcoast = "LAS|LGB|LAX|OAK|SNA|PDX|SAN|SFO|SEA|SJC|YVR";
var owe_eastcoast = "BWI|BOS|FLL|BDL|MIA|EWR|JFK|LGA|MCO|PHL|SJU|YYZ|IAD|DCA";
var owe_longhaul  = "dz|am|az|bh|bg|cy|eg|gr|ge|ir|il|jo|kw|lb|mk|mt|ma|om|FNC|qa|ro|ru|sa|sy|tn|ae|ua|yu";

var owe_mideast   = "eg|sd|il|lb|sy|jo|ir|iq|kw|bh|qa|ae|om|ye|sa";
var owe_namerica  = "us|ca|mx|bz|gt|sv|hn|ni|cr|pa|aw|tt|gd|bb|lc|mq|dm|gp|ag|kn|an|vg|vi|pr|do|ht|jm|cu|ky|bs|bm|ai|tc";
var owe_samerica  = "co|ve|ec|pe|bo|cl|br|py|uy|ar|fk";
var owe_europe    = "ie|gb|is|no|se|fi|dk|ru|ee|lv|lt|by|ua|am|az|ge|md|ro|bg|tr|gr|mk|al|yu|ba|hr|si|hu|sk|cz|pl|de|ch|it|mt|pt|es|gi|fr|be|nl|lu|ma|dz|tn|eg|cy|at|sd|"+owe_mideast;

// owe_africa2 handles the second permissible European entry from some African countries - look for what is not present:

// owe_africa2:  all "normally" treated African countries
var owe_africa2   = "ao|bj|bw|bf|bi|cm|cv|cf|td|cg|gq|er|et|ga|gm|gn|gw|ci|ls|lr|ly|mg|mw|ml|mr|mu|mz|na|ne|zr|re|rw|sn|sc|sl|so|za|sz|tg|zm|zw";

// owe_africa_second_eur_entry:	african countries from which a second EUR entry is permissible
var owe_africa_second_eur_entry = "gh|ke|ng|tz|ug";

// owe_africa:  all African countries (just add the above two together)
var owe_africa    = owe_africa2 + "|" + owe_africa_second_eur_entry;

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
  owe_mideast,  /* within middle east */
  owe_africa    /* within africa */
];
