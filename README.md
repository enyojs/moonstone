# moonstone

Moonstone UI library for TV user interfaces.

## Changes

Any time you commit a change to a `.less` file, you also need to regenerate the
top-level `.css` file for the library, as follows:

    cd lib/moonstone/css
    ../../../enyo/tools/lessc.sh ./all-package.js 

This will generate a new `moonstone-dark.css` and  `moonstone-light.css`, which you should check in along with
your changes to the `.less` files.

Please do not edit the top-level `CSS` files manually.  They should be
treated as an output file; we should make changes to `.less` files only, then
generate the CSS file using the above command.
