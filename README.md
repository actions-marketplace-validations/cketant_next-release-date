# next-release-date action

This action gets the next date for the Release Candidate build based on the deployment schedule. 

## Development

### Prerequisite
You must have `ncc` installed in your global *node_modules* in order to build the project and not need to use local *node_modules* for the workflow. 

1. `npm i -g @vercel/ncc` (*you may have to run as sudo*)

### To Test Changes

1. Run `npm run build && npm run start`

### Committing

After making source changes and before committing be sure to run `npm run build` then commit. The **dist/index.js** file is used to run this Action in order to avoid needing the **node_modules** directory. It builds the modules all in the **index.js** file.

## Inputs

### `releaseDays`

**Required** Comma separated list of numbers representing day of the week that the Release Candidate is generated. `0=Sunday`, `1=Monday`, `2=Tuesday`, `3=Wednesday`, `4=Thursday`, `5=Friday`, `6=Saturday`

## Outputs

### `next_rc_day_of_week`

The day of the week (i.e. Monday, Tuesday, Wednesday, etc) that the next Release Candidate will get generated. 

### `next_rc_date_title`

Get the date for the next Release Candidate MM-DD-YYYY

### `next_rc_date_iso`

Get the date for the next Release Candidate in ISO format

## Example usage
```
steps:
      - name: Next Release Date
        uses: cketant/next-release-date@v1.0.0
        with:
          releaseDays: "1,2,3,4,5"
```