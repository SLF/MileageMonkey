#
# ow-merge.pl
# Copyright(C) SLF 2007-2011
#
# Read in one or more flights database files; accumulate class information and then
# output a combined file.
#
# Purposes of this script:
#   permit overrides from the input file (e.g. add seasonals, remove mistakes)
#	add cabin information, based on airline / aircraft type
#
#
# USAGE:
#   copy the oneworld-x-fldump.txt file into this folder 
#   edit overrides.txt			if any overrides are needed
#   perl ow-merge.pl	        to generate flights.js
#
#

use English;
use strict;

######################################################################################

my $debug = 0;

### input files to this script
my $inPrimary = "oneworld-x-fldump.txt"; 	# raw timetable data
my $inOverride = "overrides.txt";			# contains adds/moves/changes which need to be applied
my $cities_file = "../mm/cities.js";  			# (read only by this script...)

### output information directory
my $outdir = "../logs/";

### output file from this script
my $out1 = "../mm/flights.js";		# this will contain the merged flights data
my $out2 = $outdir . "aircraft.txt";		# this is for interest only ...
my $out3 = $outdir . "flightmerge_log.txt";

if(! -d $outdir) {
	mkdir($outdir) || die "$!\n";
}

######################################################################################

### DEFUNCT airlines
# define any airlines which are defunct - all flights will be removed.  initialize
# with zero count - we output the total # flights removed
my %defunct = (
	MA	=> 0,
	MX	=> 0,
);

my %ow = ( 
	"4M" => "LAN Argentina",
	AA => "American Airlines", 
	AB => "Air Berlin",
	AY => "Finnair",
	BA => "British Airways",
	CX => "Cathay Pacific",
	IB => "Iberia",
	HG => "Niki",
	JC => "JAL Express",
	JJ => "TAM Airlines",
	JL => "JAL",
	JO => "JALways",
	KA => "Dragonair",
	LA => "LAN",
	LP => "LAN Peru",
	MH => "Malaysian",
	NU => "Japan Transocean Air",
	QF => "Qantas",
	QR => "Qatar",
	RJ => "Royal Jordanian",
	S7 => "S7 Airlines",
	UL => "Sri Lankan",
	US => "US Airways",
	XL => "Lan Ecuador"
	);

my %cities = undef;
my %cabins = undef;
my @logs = undef;
my %store = undef;
my %country_ref = undef;	# country codes referenced by cities
my %country_def = undef;	# country codes defined in country code section of cities.js
my %unknown_cities = undef;

#===============================================================
print '=' x 60, "\nMerging ($inPrimary, $inOverride) into $out1\n   ... using $cities_file as reference\n\n";


#===============================================================
load_cities($cities_file); # we only do this to detect duplicates, not needed elsewhere
print "\n";

init_cabins();


%store = undef;
@logs = undef;

loadfile($inPrimary, 0);	# get database
loadfile($inOverride, 2); 	# subsequent invocations are treated as "extras"
dumpfile($out1, $out2, "fl");

print ">>> Defunct airlines (all flights removed)\n";
foreach my $k (sort keys %defunct) {
	print "$k - $defunct{$k} flights removed\n";
}
print "\n";


my $header = 1;
foreach my $k (sort keys %unknown_cities) {
	next if $k eq "";
	if($header == 1) {
		$header = 2;
		print "!!! ERROR - unknown cities (referenced in flights but not found in cities.js):\n";
	}
	print $k, " ";
}
if($header == 2) { print "\n\n"; }

open(OUT, "> $out3") || die "couldn't create output log file $out3\n";
print OUT "//--- Logs start ---\n";
foreach my $le ( @logs ) {
	next if $le =~ /^\s*$/;
	print OUT "//      $le\n";
}
print OUT "//--- Logs  end  ---\n\n";
close(OUT);

exit 0;


####################################################################################


sub elog {
	my($entry) = @_;
	push @logs, $entry;
}

sub addService {
	my($citypair, $aircraft, $extras, $fin) = @_;
	# citypair ... e.g. ABZ-LHR
	# aircraft ... e.g. BA319

	my($airline) = substr($aircraft,0,2);
	
	if(defined($defunct{$airline})) {
		++$defunct{$airline};
		print "dropping defunct: $citypair, $aircraft, $extras\n" if $debug;
		return;
	}
	
	if(!defined($ow{uc($airline)})) {
		warn "Airline $airline isn't in oneworld!!!, ignoring ($citypair, $aircraft, $extras):\n\t$_\n";
		return;
	}

	my($flight) = $citypair . "|" . $aircraft;
	my($known) = $store{$citypair};
	# $flight contains e.g.    "ABZ-LHR|BA319"
	if(defined($known)) {
		if($known =~ /$aircraft/) { # is this flight already included?
			if($extras == 2) {
				print "warn: $flight:$aircraft is already in DB, ignoring (remove from override file $fin?)\n";
			} elsif ($extras == 0) {
				print "warn: $flight:$aircraft is already in DB, ignoring (duplicate in file $fin)\n";
			} elsif ($extras == 1) {
				# do nothing
			}
		} else {
			$store{$citypair} .= "|" . $aircraft;
			if($extras > 1) {
				print "note:  $flight was in DB as $known; adding new aircraft $aircraft\n";
				elog("adding $aircraft to $citypair (from DB: $known), now=$store{$citypair}");
			}
		}
	} else {
		$store{$citypair} = $aircraft;
		elog("creating $citypair with $aircraft") if $extras;
	}
}

# load/parse the flight file into something we can use more easily
# this sub populates the following:
#  %store - contains entries like "ABZ-LHR|BA319".  index is important, value of each entry is simply "1"
#   fin - input filename
#   extras -  how to handle errors with this source file
#              0 = this is the primary source file, so be quite strict
#              1 = this is additional flight data (i.e. previous months).  ignore duplicates etc.
#              2 = this is the overrides file - report on issues
#
sub loadfile {
	my($fin, $extras) = @_;

	foreach my $f ( split(/;/,$fin)) {
		open(IN, "< $f") || die "couldn't open input file $f\n";
		while(<IN>) {
			next if m{^//};
			next if /^\s*$/;
			next if /^\s*#/;
			next if /^var flight([_\w]+)? =/;
			
			if (/^\s*adjust\s*/) {
				print "-ignored following line as we don't support 'adjust' at the moment (see get_cabins() in this script instead):\n\t$_\n";
			} elsif ( /^extras\s*$/ && !$extras)  { # subsequent entries in this data file are "additional" (extras).  e.g. older timetable data
				print "$fin: switching to extras mode\n";
				$extras = 1;
			} elsif ( /^\s*removeall\s*(\w\w\w\-\w\w\w)$/) {
				if(defined($store{$1})) {
					elog("removeall $1 (was $store{$1})");
					delete $store{$1};
				} else {
					print "warn: 'removeall $1': this isn't in the database!\n";
				}
			} elsif ( /^\s*remove\s*(\w\w\w\-\w\w\w)\|(\w\w\w\w\w)$/) {
				my($citypair) = $1;
				my($entry) = $store{$citypair};
				my($svc) = $2;
				
				if(defined($entry)) {
					if($entry =~ /$svc/) {
						#print "before: $store{$citypair}\n";
						$store{$citypair} =~ s/$svc//;
						$store{$citypair} =~ s/\|\|/\|/;
						$store{$citypair} =~ s/^\|//;
						$store{$citypair} =~ s/\|$//;
						#print "after: $store{$citypair}\n";
						if("" eq $store{$citypair}) {
							delete $store{$citypair};
							##print "deleting entry entirely, no operators left\n";
							elog("removing $citypair as last service $svc was removed");
						} else {
							elog("removing $svc from $citypair (now $store{$citypair})");
						}
					} else {
						print "warn: 'remove $1|$2' - $2 is not in entry: $entry\n";
					}
				} else {
					print "warn: 'remove $citypair': this isn't in the database!\n";
				}
			} elsif(/^\s*flight(_hippo|_new)?\[\"(\w\w\w\-\w\w\w)\"\]\s*=\s*\"[\w\|]+/) {
				# this is our output format
				my($citypair)=uc($2);
				check_cities($citypair);
				
				if(/\s*=\s*\"([\w\|]+)\"/) {
					foreach my $service ( split(/\|/, $1) ) {
						my $flight = $citypair . "|";
						if($service =~ /^(\w\w\w\w\w),(\w{1,4})$/) {
							my $aircraft = $1;
						#	my $acabins = $2;   # discarded for now
						#	if($acabins =~ /y/) { $ystore{$aircraft} = 1; }
						#	if($acabins =~ /j/) { $jstore{$aircraft} = 1; }
						#	if($acabins =~ /f/) { $fstore{$aircraft} = 1; }
							addService($citypair, $aircraft, $fin); # e.g. "ABZ-LHR", "BA319"
						} elsif ($service =~ /^(\w\w\w\w\w)$/) {
							addService($citypair, $1, $extras); # e.g. "ABZ-LHR", "BA319"
						} else {
							print "err: unrecognised: $_\n";
						}
					}
				} else {
					print "err: didn't parse services ($2) correctly: $_\n";
				}


			} else {
				print "-ignored following line due to unrecognized syntax:\n\t$_\n";
			}
		}
		close(IN);
	}
}


sub dumpfile {
	my($fout1, $fout2, $arrayName) = @_;

	my(%ac) = undef;
	my(%acr) = undef;
	
	open(OUT, "> $fout1") || die "couldn't create output file $fout1\n";
	print "\nCreating $fout1 (contains merged flights database)...\n\n";

	print OUT "// auto generated, do not manually edit this!!\nvar $arrayName = new Array;\n";

	foreach my $f (sort keys %store) {
		next if $f eq "";
		if($f =~ /^(\w\w\w)\-(\w\w\w)$/ ) {
			my($cfrom) = $1;
			my($cto) = $2;
			my(@services) = split(/\|/, $store{$f} );
			
			print OUT qq{${arrayName}["$cfrom-$cto"]="};

			my($count) = 0;
			foreach my $service ( sort @services ) {
				if($service =~ /^(\w\w\w\w\w)$/) {
					++$ac{$service};
					$acr{$service} .= "$cfrom-$cto ";
					
					my($cabins) = get_cabins($service, $cfrom, $cto);
			
					if($count++) {
						print OUT "|";
					}
					print OUT qq{$service,$cabins};
				} else {
					print "unrecognised service $service in:\n\t$f: $store{$f}\n";
				}
			}
			print OUT qq{";\n};
		} else {
			warn "dumpfile: unrecognised line:\n\t$f\n";
		}
	}
	close(OUT);

	open(OUT, "> $fout2") || die "couldn't create output file $fout2\n";
	print "\nCreating $fout2 (contains list of airlines & aircraft types found)...\n\n";
	print OUT "# auto generated!!\n# this file is for interest only!\n";
	my($lastcarrier) = undef;
	foreach my $f (sort keys %ac) {
		next if $f eq "";
		if($f =~ /^(\w\w)(\w\w\w)$/ ) {
			my($svc) = $1 . $2;
			my($res) = get_cabins("$svc","","");
			if($lastcarrier ne $1) {
				$lastcarrier = $1;
				print OUT "\n";
			}
			print  OUT qq[$1 $2: $res; $ac{$svc} routes: $acr{$svc}\n];
		} else {
			warn "dumpfile: unrecognised line:\n\t$f\n";
		}
	}
	print OUT "\n";
	close(OUT);
	
	
}

# load/parse the existing "cities.js" file into something we 
# can use easily
sub load_cities {
	my($ccount) = 0;
	my($countrycount) = 0;
	my($fin) = @_;

	foreach my $f ( split(/;/,$fin)) {
		open(IN, "< $f") || die "couldn't open input file $f\n";
		while(<IN>) {
			if(/^\s*citycodes\s*\[\s*\"(\w\w\w)\"\s*\]\s*=\s*\[\s*\"(\w\w\-\w{2,3}|\w\w)\"\s*,\s*([\d\.\-]+)\s*,\s*([\d\.\-]+)/) {
				if(defined($cities{$1})) {
					print "duplicate city entries for $1:\n\t1:$_\n\t2:$cities{$1}\n";
				}
				my($city) = $1;
				my($country) = lc($2);
				my($lat) = $3;
				my($long) = $4;
				$cities{$1} = $country;
				if($country =~ /^ru/) {
					process_russian_city($city, $country, $lat, $long); # params=(city,country,latitude,longitude)
				}
				$country_ref{$2}++;
				++$ccount;
			} elsif (/^\s*citycodes/) {
				warn "failed citycode parse:   $_";
			}

			if(/^\s*countrycodes\s*\[\s*\"(\w\w\-\w{2,3}|\w\w)\"\s*\]/) {
				if(defined($country_def{$1})) {
					print "duplicate country entries for $1:\n\t1:$_\n\t2:$country_def{$1}\n";
				}
				$country_def{$1} = $_;
				++$countrycount;
			}

		}
		close(IN);
	}
	print "$ccount cities and $countrycount countries loaded from cities.js\n";

# now check that all referenced country codes have actually been defined!
	foreach my $c (sort keys %country_ref ) {
		next if $c eq "";
		if(!defined($country_def{$c})) {
			warn"country code $c is referenced by a 'citycodes' entry, but not defined in a 'countrycodes' one!\n";
		}
	}


}

# process Russian cities.  OWE rules differ for cities according to which side of the Urals they are
#  east => the city is in Asia
#  west => the city is in Europe
# Here we try to do this programatically, based on longitude 60 East being roughly where the Urals are
# Some exceptions can be caught in here if needed
sub process_russian_city {
	my($city) = shift;
	my($country) = shift;  # this should be 'ru-ue' (east of Urals) or 'ru-uw' (west of Urals)
	my($lat) = shift;
	my($long) = shift;
	
	my($is_east) = 0;  # assume city is west of Urals
	my($msg) = ""; # assume we don't need to show a warning

	if($long > 60) { # if further east than 60E, assume it's east of Urals
		$is_east = 1;
	}

	if($country eq "ru") {	# it should be ru-ue or ru-uw (east or west of urals)
		$msg .= "Country code is just 'ru', it should be 'ru-ue' (east of Urals) or 'ru-uw' (west of Urals). ";
	}
	
	if( (($country eq "ru-ue") && $is_east) ||		# if it's marked as east, and we calculate it so
		(($country eq "ru-uw") && ! $is_east) ) 	# or if it's marked as west and we agree
	{
		# actually do nothing :)
	} else {
		$msg = "Marked country ($country) disagrees with our longitude check east/west of Urals ($long) - exception in ow-merge.pl may be needed. ";
	}
	
	if($msg gt "") {
		warn "Russian city: $city,$country,$lat,$long : $msg\n\tOur guesstimate: " .
			($is_east ? " (East" : " (West") . " of Urals)";
	}
}


# check that cities for a flight exist in DB
sub check_cities {
	my($flight) = shift;
	if($flight =~ /^(\w\w\w)\-(\w\w\w)$/) {
		if(!defined($cities{$1})) { $unknown_cities{$1} = 1; }
		if(!defined($cities{$2})) { $unknown_cities{$2} = 1; }
	} else {
		warn "expected from-to city pair: $flight\n";
	}
}


# get_cabins:  return the cabins available on a given service (e.g. "BA744") type
# example return values:  "fjy", "y"
# this sub processes any generics/exceptions to the static data in %cabins (e.g. route-specific overrides)
sub get_cabins {
	my($service) = shift;	# e.g. "BA744"
	my($cfrom) = shift;	# e.g. "LHR"
	my($cto) = shift;	# e.g. "SIN"

	my($airline) = "";
	my($aircraft) = "";
	if($service =~ /^(\w\w)(\w\w\w)$/) {
		$airline = $1;
		$aircraft = $2;
	} else {
		die "get_cabins(): unexpected service=$service\n";
	}
	
	if(!defined($cabins{$service})) {
		print "err: aircraft $service is undefined in this script; using 'Y';",
			" (first seen on $cfrom-$cto:$service)\n";
		$cabins{$service} = "y";
		# having given a one-time error, let's forge on ... assuming y-only
	}
	
	if((($airline eq "AA") || ($airline eq "US")) && domestic("us", $cfrom, $cto)) {
		my ($c1) = $cabins{$service};
		if($c1 eq "jy") {
			return "fy";
		}
		return $c1;
	}

	if(($airline eq "QF") && domestic("nz", $cfrom, $cto)) {
		#print "changing $service $cfrom-$cto to y\n";
		return "y";
	}

	if(($airline eq "QF") && $aircraft eq "744" && route($cfrom, $cto, "SIN", "FRA")) {
		return "jpy";
	}
	if(($airline eq "QF") && $aircraft eq "744"  && route($cfrom, $cto, "SYD", "NRT")) {
		return "jpy";
	}

#      removed this BA constraint - discussing it on FT the conclusion was that you can book J tickets
#      on these services, and these do earn J points/miles.  Further the "Business UK" ticket gives
#      lounge access - so the only thing missing is the onboard J cabin & catering.
#      Given that MileageMonkey is aimed at points/miles earning, I'll leave the domestics as "jy"
#	if(($airline eq "BA") && domestic("gb", $cfrom, $cto)) {
#		#print "changing $service $cfrom-$cto to y\n";
#		return "y";
#	}
	
	if(($service eq "LA320") && route($cfrom, $cto, "AEP", "IGR")) {
		return "y";
	}
	
	if(($airline eq "CX") && route($cfrom, $cto, "DPS", "HKG")) {
		return "jy";
	}

# I changed the default cabin type for JO744 to "jy" so don't need this specific now
#	if(($service eq "JO744") && route($cfrom, $cto, "SYD", "NRT")) {
#		return "jy";
#	}
	
	if(defined($cabins{$service})) {
		return $cabins{$service};
	}
	
# should never get here (see code at start of sub)
	return "y";
}

sub route {
	my($cfr) = shift;
	my($cto) = shift;
	my($r1) = shift;
	my($r2) = shift;
	
	return (
		(($cfr eq $r1) && ($cto eq $r2)) ||
		(($cfr eq $r2) && ($cto eq $r1)) )
		? 1 : 0;
}


# is "loc"ation equal to either "from" or "to"?
sub serves {
	my($loc) = shift;
	my($cfr) = shift;
	my($cto) = shift;
	
	return (($loc eq $cfr) || ($loc eq $cto)) ? 1 : 0;
}

# is the from-to city pair wholly domestic in a country?  E.g. for AA this means a "-jy" cabin is sold as "f-y".
# examples:    domestic("us|ca", $from, $to)
#              domestic("au", $from, $to)
#
sub domestic {
	my($country) = lc(shift);
	my($cfr) = shift;
	my($cto) = shift;

	if(($cfr eq "") || ($cto eq "")) {
		return 0;
	}

	my($c1) = $cities{$cfr};
	my($c2) = $cities{$cto};
	
	my($inc1) = (defined($c1) && ($c1 =~ /$country/)) ? 1 : 0;
	my($inc2) = (defined($c2) && ($c2 =~ /$country/)) ? 1 : 0;
	
	#print "domestic($country,$cfr,$cto): c1=$c1, c2=$c2, inc1=$inc1, inc2=$inc2\n";
	
	return ($inc1 && $inc2) ? 1 : 0;
}


# update the below to correct any defaults...
############

# http://www.planespotters.net/Airline/

sub init_cabins {
	$cabins{"4M318"} = "y";
	$cabins{"4M320"} = "y";
	$cabins{"4M763"} = "jy";

# Note: AA entries here should reflect "jy" for two cabin planes, not "fy".  This anomaly
# is handled above in domestic_us() where "fy" is reported for two cabin domestic services
# We need "jy" when those same aircraft operate routes outside the US
	$cabins{"AA319"} = "jy"; 
	$cabins{"AA32B"} = "jy"; 
	$cabins{"AA738"} = "jy"; 
	$cabins{"AA757"} = "jy"; 
	$cabins{"AA762"} = "fjy";
	$cabins{"AA763"} = "jy"; 
	$cabins{"AA777"} = "fjy";
	$cabins{"AA77W"} = "fjy";
	$cabins{"AAAB6"} = "jy"; 
	$cabins{"AAAT7"} = "y";  
	$cabins{"AACR7"} = "jy"; 
	$cabins{"AACRJ"} = "jy"; 
	$cabins{"AAER3"} = "y";  
	$cabins{"AAER4"} = "y";  
	$cabins{"AAERD"} = "y";  
	$cabins{"AAE75"} = "jy";  
	$cabins{"AAM80"} = "jy"; 
	$cabins{"AAM83"} = "jy"; 
	$cabins{"AASF3"} = "y";  

# http://www.planespotters.net/Airline/Air-Berlin
	$cabins{"AB738"} = "y";
	$cabins{"AB320"} = "y";		# most are y only, D-ALTK is jy
	$cabins{"AB321"} = "y";
	$cabins{"AB319"} = "y";
	$cabins{"AB73G"} = "y";
	$cabins{"AB332"} = "jy";	# some are y only, some jy
	$cabins{"AB333"} = "y";		# unknown ... guessing y
	$cabins{"ABDH4"} = "y";
	$cabins{"ABE90"} = "y";
	$cabins{"AB142"} = "y";
	$cabins{"ABAT7"} = "y";

# http://www.planespotters.net/Airline/Finnair	
	$cabins{"AYAT5"} = "y"; 
	$cabins{"AYAT7"} = "y"; 
	$cabins{"AYATR"} = "y"; 
	$cabins{"AY319"} = "jy"; 
	$cabins{"AY320"} = "jy"; 
	$cabins{"AY321"} = "jy"; 
	$cabins{"AY32B"} = "jy"; 
	$cabins{"AY330"} = "jy"; 
	$cabins{"AY333"} = "jy"; 
	$cabins{"AY340"} = "jy"; 
	$cabins{"AY343"} = "jy"; 
	$cabins{"AY75W"} = "y"; 
	$cabins{"AYE70"} = "jy";  
	$cabins{"AYE90"} = "y";  
#	$cabins{"AYER4"} = "y";  
#	$cabins{"AYM11"} = "jy"; 

# http://www.planespotters.net/Airline/British-Airways
	$cabins{"BA142"} = "jy"; 
	$cabins{"BA146"} = "jy"; 
	$cabins{"BA318"} = "j";  # CWLCY LCY-JFK
	$cabins{"BA319"} = "jy"; 
	$cabins{"BA320"} = "jy"; 
	$cabins{"BA321"} = "jy"; 
	$cabins{"BA388"} = "fjpy"; 
	$cabins{"BA732"} = "jy"; 
	$cabins{"BA733"} = "jy"; 
	$cabins{"BA734"} = "jy"; 
	$cabins{"BA738"} = "jy"; 
	$cabins{"BA744"} = "fjpy";
	$cabins{"BA752"} = "jpy"; 
	$cabins{"BA767"} = "jpy"; 
	$cabins{"BA777"} = "fjpy"; # F not on all
	$cabins{"BA788"} = "jpy";

# below aren't BA mainline
	$cabins{"BAAR1"} = "jy";  
	$cabins{"BAAR8"} = "jy"; 
	$cabins{"BAAT4"} = "y"; 
	$cabins{"BAAT7"} = "y"; 
	$cabins{"BAATR"} = "y"; 
	$cabins{"BAD38"} = "y";  
	$cabins{"BADHT"} = "y";  
	$cabins{"BAE70"} = "jy";
	$cabins{"BAE90"} = "jy";
	$cabins{"BAFRJ"} = "y";  
	$cabins{"BAJ31"} = "y";  
	$cabins{"BASF3"} = "y";  
	$cabins{"BAS20"} = "y";  
	
# http://www.planespotters.net/Airline/Cathay-Pacific
#	$cabins{"CX319"} = "y";  
#	$cabins{"CX321"} = "jy";  
	$cabins{"CX330"} = "jy"; 
	$cabins{"CX333"} = "fjy";
	$cabins{"CX343"} = "fjy";  # 343s have mixed config, some jy, some fjy
	$cabins{"CX346"} = "fjy";
#	$cabins{"CX737"} = "y";  
	$cabins{"CX744"} = "fjy";
	$cabins{"CX772"} = "jy";	# 777-200s are all jy
	$cabins{"CX773"} = "jy"; 	# 777-300 are all jy, 777-300(ER) are fjy, shown as 77A?
	$cabins{"CX777"} = "fjy";
	$cabins{"CX77A"} = "fjy";
	$cabins{"CX77W"} = "fjy";

	$cabins{"HG319"} = "y"; 
	$cabins{"HG320"} = "y"; 
	$cabins{"HG321"} = "y";
	$cabins{"HG738"} = "y";
	$cabins{"HG73G"} = "y";
	$cabins{"HGE90"} = "y"; 
	$cabins{"HGDH4"} = "y"; 
	
	$cabins{"IB319"} = "jy"; 
	$cabins{"IB320"} = "jy"; 
	$cabins{"IB321"} = "jy"; 
	$cabins{"IB32B"} = "jy";
	$cabins{"IB32S"} = "y";  
	$cabins{"IB333"} = "jy"; 
	$cabins{"IB340"} = "jy"; 
	$cabins{"IB342"} = "jy";
	$cabins{"IB345"} = "jy"; 
	$cabins{"IB346"} = "jy"; 
	$cabins{"IBAT7"} = "y";  
	$cabins{"IBCR2"} = "y";  
	$cabins{"IBCR9"} = "y";  
	$cabins{"IBCRK"} = "jy";  
	$cabins{"IBDH3"} = "y";  
	$cabins{"IBM88"} = "y";  
	
	$cabins{"JC734"} = "y";  
	$cabins{"JC73H"} = "y";  
	$cabins{"JCM81"} = "y";  
	
	$cabins{"JJ319"} = "y";
	$cabins{"JJ320"} = "jy";
	$cabins{"JJ321"} = "y";
	$cabins{"JJ330"} = "fjy";
	$cabins{"JJ763"} = "jy";
	$cabins{"JJ773"} = "fjy";
	$cabins{"JJAT7"} = "y";
	$cabins{"JJL4T"} = "y";

	
	$cabins{"JL734"} = "y";  
	$cabins{"JL737"} = "y";  
	$cabins{"JL73H"} = "y";  
	$cabins{"JL744"} = "fjy";
	$cabins{"JL747"} = "y";  
	$cabins{"JL767"} = "jy"; 
	$cabins{"JL773"} = "fjpy";
	$cabins{"JL777"} = "fjpy";
	$cabins{"JL788"} = "fjpy";
	$cabins{"JLAB6"} = "y";  
	$cabins{"JLCRJ"} = "y";  
	$cabins{"JLE70"} = "y";  
	$cabins{"JLEMJ"} = "y";  
	$cabins{"JLM81"} = "y";  
	$cabins{"JLM90"} = "y";  
	
	$cabins{"JO744"} = "jy"; 
	$cabins{"JO747"} = "jy"; 
	$cabins{"JO767"} = "jy"; 
	$cabins{"JO777"} = "jy"; 
	
# http://www.planespotters.net/Airline/DragonAir
	$cabins{"KA320"} = "jy"; 
	$cabins{"KA321"} = "jy"; 
	$cabins{"KA330"} = "fjy";
	$cabins{"KA333"} = "fjy";	# 333 is a mix of jy, fjy
	$cabins{"KA738"} = "jy"; 
	$cabins{"KA773"} = "fjy";

# http://www.planespotters.net/Airline/LAN-Airlines
	$cabins{"LADH2"} = "y";  
	$cabins{"LADH4"} = "y";  
	$cabins{"LA318"} = "y";  
	$cabins{"LA319"} = "y";  
	$cabins{"LA320"} = "y";  
	$cabins{"LA32S"} = "y";  
	$cabins{"LA340"} = "jy";
	$cabins{"LA343"} = "jy";
	$cabins{"LA737"} = "y"; 	# Poss. Lan Colombia (not yet a OW affiliate as of Mar 2012)
	$cabins{"LA763"} = "jy";  
	$cabins{"LA787"} = "jy";  

# 	http://www.planespotters.net/Airline/Lan-Peru
	$cabins{"LP318"} = "y";  
	$cabins{"LP319"} = "y"; 
	
	$cabins{"MH333"} = "jy";  
	$cabins{"MH380"} = "fjy";  
	$cabins{"MH734"} = "jy";  
	$cabins{"MH738"} = "jy";  
	$cabins{"MH772"} = "jy";  

	
	$cabins{"NU734"} = "y";  
	$cabins{"NU767"} = "jy"; 
	$cabins{"NUBNT"} = "y";  
	$cabins{"NUDH1"} = "y";  
	$cabins{"NUDH3"} = "y";  
	
	$cabins{"QF100"} = "y";  
	$cabins{"QF332"} = "jy"; 
	$cabins{"QF333"} = "jy"; 
	$cabins{"QF388"} = "fjpy";
	$cabins{"QF717"} = "y";  
	$cabins{"QF733"} = "jy"; 
	$cabins{"QF734"} = "jy"; 
	$cabins{"QF73H"} = "jy";  
	$cabins{"QF743"} = "jy";  
	$cabins{"QF744"} = "fjpy";
	$cabins{"QF763"} = "jy";  
	$cabins{"QFDH3"} = "y";  
	$cabins{"QFDH4"} = "y";  
	$cabins{"QFDH8"} = "y";  
	$cabins{"QFF50"} = "y";  
	
	$cabins{"QR319"} = "jy";
	$cabins{"QR320"} = "jy";
	$cabins{"QR321"} = "jy";
	$cabins{"QR332"} = "fjy";
	$cabins{"QR333"} = "fjy";
	$cabins{"QR346"} = "fjy";
	$cabins{"QR77L"} = "jy";
	$cabins{"QR77W"} = "jy";
	$cabins{"QR788"} = "jy";


	$cabins{"RJ310"} = "jy"; 
	$cabins{"RJ313"} = "jy"; 
	$cabins{"RJ319"} = "jy"; 
	$cabins{"RJ320"} = "jy"; 
	$cabins{"RJ321"} = "jy"; 
	$cabins{"RJ32S"} = "jy"; 
	$cabins{"RJ330"} = "jy"; 
	$cabins{"RJ340"} = "jy"; 
	$cabins{"RJ342"} = "jy"; 
	$cabins{"RJ787"} = "jy";
	$cabins{"RJE75"} = "y";  
	$cabins{"RJE95"} = "jy"; 
	
	$cabins{"S7310"} = "jy";
	$cabins{"S7319"} = "jy";
	$cabins{"S7320"} = "jy";
	$cabins{"S7321"} = "jy";
	$cabins{"S7734"} = "jy";
	$cabins{"S7738"} = "jy";
	$cabins{"S7763"} = "jy";
	
	$cabins{"UL320"} = "jy";
	$cabins{"UL321"} = "jy";
	$cabins{"UL332"} = "jy";
	$cabins{"UL343"} = "jy";
	$cabins{"ULCNC"} = "jy";
	
# Note: US entries here should reflect "jy" for two cabin planes, not "fy".  This anomaly
# is handled above in domestic_us() where "fy" is reported for two cabin domestic services
# We need "jy" when those same aircraft operate routes outside the US
	$cabins{"US319"} = "jy";
	$cabins{"US320"} = "jy";
	$cabins{"US321"} = "jy";
	$cabins{"US332"} = "jy";
	$cabins{"US333"} = "jy";
	$cabins{"US734"} = "jy";
	$cabins{"US752"} = "jy";
	$cabins{"US762"} = "jy";
	$cabins{"USCR7"} = "jy";
	$cabins{"USCR9"} = "jy";
	$cabins{"USCRJ"} = "y";
	$cabins{"USDH3"} = "y";
	$cabins{"USDH8"} = "y";
	$cabins{"USE70"} = "jy";
	$cabins{"USE75"} = "jy";
	$cabins{"USE90"} = "jy";
	$cabins{"USERJ"} = "jy";

	$cabins{"XL319"} = "y";  
	$cabins{"XL320"} = "y";  
	$cabins{"XL763"} = "y";  
}

