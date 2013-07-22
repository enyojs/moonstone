moonstone
=========

Moonstone UI library for TV user interfaces.

## Changes

Any time  you commit  a change  to a  `.less` file,  you also  need to
re-generate the top-level library `.css` file as follows:

  cd lib/moonstone/css
	../../../enyo/tools/lessc.sh ./package.js 

This command will generate a new `moonstone.css`, which you should check in
with your `.less` changes.

Please don't manually  edit the top-level `moonstone.css`:  those should be
treated  as output  files, and  we should  only be  making changes  to
`.less` files and generating the `.css` file using the above command.
