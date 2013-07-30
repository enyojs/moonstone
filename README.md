# moonstone

Moonstone UI library for TV user interfaces.

## Changes

Any time you commit a change to a `.less` file, you also need to regenerate the
top-level `.css` file for the library, as follows:

    cd lib/moonstone/css
    ../../../enyo/tools/lessc.sh ./package.js 

This will generate a new `moonstone.css`, which you should check in along with
your changes to the `.less` files.

Please do not edit the top-level `moonstone.css` file manually.  It should be
treated as an output file; we should make changes to `.less` files only, then
generate the `moonstone.css` file using the above command.
