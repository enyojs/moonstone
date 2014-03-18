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

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2014 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
