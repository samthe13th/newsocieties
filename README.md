# NewSocieties

Digital assets for New Societies theatre show

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Changelog
### 05/17/2022
#### IPAD UPDATES
* Don't close scan-view after contamination reporting
* Increase actions by one each scan
* Add no-decision options for principles and scenarios voting
* Pop-up division-score change immediately (remove delay for ipad version)

### 05/18/2022
#### IPAD UPDATES
* No longer increase actions when scanning resources
* When season 0, instead of a "SCAN" button there is a "Scan: R" and a "Scan: C" button which will launch the scanner to do a demo scan ("Scan: R") will always produce a clean-resource scan, and "Scan: C" will always produce a contamination.
* There is now a "New Harvest" button -- this is what hosts should click when they want to refresh the deck to see what needs to be dealt early. "New Season" should be clicked when the season is actually over.

### 05/19/2022
#### GENERAL UPDATES
* Show-number can be adjusted in the admin-panel at the top of the "Show" tab

#### IPAD UPDATES
* Hosts can now scan multiple harvest tiles at once, via a number-selector beneath the "SCAN" button on the scanning screen -- this is intended to be used in the case of scanning owned-land at the beginning of a season
* "Review" tab added to ipad UI. A review for a division can be generated via a "Generate Review" button at the bottom of the screen. Once generated, reviews can also be accessed at a unique url with the format: https://new-societies-8049d.web.app/main/archive/{DATE}/{SHOWNUMBER}/{DIVISION}. For example: https://new-societies-8049d.web.app/main/archive/051922/1/N is the review url for the north division, May 19th 2022, show #1.

### 05/20/2022
#### GENERAL UPDATES
* Central will now get a popup whenever a division score changes

### 05/21/2022
#### IPAD UPDATES
* BUG FIX: Season 0 scanning: r and scanning: c both say “scan results” but not the contaminant or contaminant-free screen 
* BUG FIX: If you scan more than ~12, there’s no scrolling option on the tablets. The screen cuts off at #12 and anything below that cannot be accessed.
* BUG FIX: On scan screen, most (not all) of the of the tablets show black text, but some show white
* harvest size changed to the following values:  low = 21, mid-low = 28, mid = 35, mid-high = 42, high = 49. 
* “Resources in hand” removed from review
* Add secondary options to scenarios

### 05/23/2022
#### GENERAL UPDATES
* Bug fix: Archive reviews were getting deleted when show resets

#### IPAD UPDATES
* Bug fix: Sometimes a single scan was showing up as a list of scans with a single item
* Keyboard support added for editing division properties (can press 'enter' on keyboard as an alternative to clicking 'update' button)
* Scan animations shortened.

### 05/24/2022
#### IPAD UPDATES
* New "Sell" tab for ipad where hosts can log advancements and land that are sold-off. These amounts are also reflected in the final reviews
* BUG FIX: Principles vote-tab should be engaged by default now (should fix the issue of need to select multiple times before the vote dropdown becomes available)

### 05/26/2022
#### GENERAL UPDATES
* Division tab order for admin/central changed to be N,E,S,W,NE,SE,SW,NW 
* Admin panel can now change the show size when resetting the show (if you click "Reset Show" a dialog will appear where you can set the show size).

### 05/29/2022
#### GENERAL UPDATES
* Summary page for central displays division capacity/actions as simple text rather than as a graph
* Contamination for a division is now partially based on the reserve threshold met by a division at the time of scanning a resource

### 05/30/2022
#### IPAD UPDATES
* In-progress votes are kept in memory so if you switch tabs, and come back to a resolution/principle/scenario vote, you should be able to resume where you left off

### 05/31/2022
#### GENERAL UPDATES
* BUG FIX: Setting division properties to zero now properly updates (was not working correctly)
#### IPAD UPDATES
* Ipad UIs now include some global divisions data (season and land cost)
* Edit buttons slightly large
* New harvest and New Season buttons moved to bottom toolbar
* Demo scan buttons are now color-coded and have icons (clean-scan button is a green checkmark, contamination-scan button is a red contamination icon)

### 06/01/2022
#### GENERAL UPDATES
* Dirty magic now has a max value of 10000
* Final votes can be viewed by central/admin in a new "Final Vote" tab
* Date formatting for QR code urls fixed (June 1st was being written as 06122 instead of 060122)
#### IPAD UPDATES
* Final votes can be entered by a host via a "Final Vote" button in the Review tab
* Final votes can be weighted as 0 if necessary