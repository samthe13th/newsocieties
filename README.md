# NewSocieties

Digital assets for New Societies theatre show

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Changelog
### 05/17/2022
#### IPAD updates
* Don't close scan-view after contamination reporting
* Increase actions by one each scan
* Add no-decision options for principles and scenarios voting
* Pop-up division-score change immediately (remove delay for ipad version)

### 05/18/2022
#### IPAD updates
* No longer increase actions when scanning resources
* When season 0, instead of a "SCAN" button there is a "Scan: R" and a "Scan: C" button which will launch the scanner to do a demo scan ("Scan: R") will always produce a clean-resource scan, and "Scan: C" will always produce a contamination.
* There is now a "New Harvest" button -- this is what hosts should click when they want to refresh the deck to see what needs to be dealt early. "New Season" should be clicked when the season is actually over.

### 05/19/2022
#### IPAD updates
* Hosts can now scan multiple harvest tiles at once, via a number-selector beneath the "SCAN" button on the scanning screen -- this is intended to be used in the case of scanning owned-land at the beginning of a season
* "Review" tab added to ipad UI. A review for a division can be generated via a "Generate Review" button. Once generated, reviews can also be accessed at a unique url with the format: https://new-societies-8049d.web.app/main/archive/{DATE}/{SHOWNUMBER}/{DIVISION}. For example: https://new-societies-8049d.web.app/main/archive/051922/1/N is the review url for the north division, May 19th 2022, show #1.
* Show-number can be adjusted in the admin-panel at the top of the "Show" tab
