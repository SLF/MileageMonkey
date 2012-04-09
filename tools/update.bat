@echo off
set BDIR=..\build
set MMDIR=..\mm
set YUI=..\3party\yuicompressor-2.4.7\build\yuicompressor-2.4.7.jar
set UPLOAD=..\upload


@echo ======================================================================
@echo Before running this batch file, you may want to have updated files in ..\mm
@echo such as changelog.htm, version.txt, award.js etc.
@echo.
@echo about to run scanow.pl
@echo.
rem perl ow-merge.pl

cd %MMDIR%

"C:\Program Files\UnixUtils\cat.exe" flights.js cities.js zones.js owe.js award.js > %BDIR%\temp-merged.js

@echo Running Java Compressor (should use -v for verbose output at some stage :) )
rem *** java -jar %YUI% -v -o %BDIR%\temp-compressed.js %BDIR%\temp-merged.js
rem *** java -jar %YUI% --line-break 0 -o %BDIR%\temp-compressed.js %BDIR%\temp-merged.js
java -jar %YUI% -o %BDIR%\temp-compressed.js %BDIR%\temp-merged.js

rem ** build two versions - one with the JS compression, and one without
"C:\Program Files\UnixUtils\cat.exe" award-htm-part1.htm %BDIR%\temp-compressed.js award-htm-part2.htm version.txt award-htm-part3.htm > %UPLOAD%/award.htm
"C:\Program Files\UnixUtils\cat.exe" award-htm-part1.htm %BDIR%\temp-merged.js     award-htm-part2.htm version.txt award-htm-part3.htm > %UPLOAD%/award-uncompressed.htm

copy changelog.htm 	%UPLOAD%\
copy version.txt 	%UPLOAD%\
	
@echo ======================================================================
@echo End of script - award.htm is stored in:  %UPLOAD%
@echo You now need to test, then commit changes, then update GitHub, then upload
@echo.
@pause