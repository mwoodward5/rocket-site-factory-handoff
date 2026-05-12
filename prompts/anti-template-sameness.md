# Anti-Template Sameness and Residue Rules

Every build and Finish Pass must remove old-template residue before it can be considered complete.

## Hard Blockers

- old company names
- old phone numbers
- old domains
- old city names
- old service names
- old schema IDs
- old Google Place IDs
- old social links
- old image alt text
- source-template commentary such as "based on" a previous client

## Known Blocked Residue Strings

- Bass Pool Pros
- Blue Coast Cleaning
- Danny's Construction
- D Lux Pools
- KRAB
- South Orange
- Classy Clean
- Mantra Botanicals
- Sitecraft
- Site Sculptor

## Required Action

Run the QA residue gate. If any hit is found, mark the project blocked, run Cleanup Pass, regenerate QA, and do not publish.
