# APAS Script

APAS is short for Automatic Performance Assessment System, it uses Google Apps Script.

Code here serves as backup only. 

Created for [UTChinese](http://utchinese.org).

# Explanation

The script will read a google spreadsheet which has all the member names, emails, roles, etc. Everyone needs to give some feedback for (1) their leader if they are a member, or (2) their members if they are the leader. A person can have multiple roles. 

The script will create a google form for each person - yes, that's right, one form for one person - and send it to their email.

The process of collecting data seems a little tedious. Each form has its own "sheet" in a spreadsheet. So the script will need to extract data from each sheet and put them all together.

# License

This repo is under GNU General Public License v3.0.

