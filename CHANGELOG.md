﻿# Migration Notes/API Changes

This file tracks changes made to the Moonstone API since the last public
release.  While this list should not be considered exhaustive, we hope it will
provide useful guidance for those maintaining existing Moonstone apps, as well
as those planning new ones.

Since the release of Enyo 2.5.1.1, we have made many changes across Enyo and its
related libraries to bring the framework into compliance with JavaScript's
Module Pattern.  Significant changes have been made to the way that Enyo apps
are structured and built; existing applications will need to be converted to
be compatible with the new scheme.  (The conversion process is outlined in the
Enyo 2.6 Conversion Guide.)

In addition to the overarching structural changes, there have also been some
significant changes in functionality.  Most notably, we have introduced support
for resolution independence, a set of new abilities that allow apps to
automatically scale themselves to run under different screen resolutions.  The
`moon-resolution.js` file makes the resolution independence code from Enyo core
available to the Moonstone library.

Also new is support for custom history handling (i.e., the ability to define
how the app responds to a "back" keypress or `window.history.back()`).  This is
implemented in the new `moon.HistorySupport` mixin, which has been integrated
into numerous Moonstone controls, including `moon.ContextualPopup`,
`moon.Dialog`, `moon.Drawer`, `moon.Drawers`, `moon.ListActions`, `moon.Panels`,
`moon.Popup`, and `moon.VideoPlayer`.  The new functionality may be seen at work
in the new sample, "HistorySample".

In addition to the work on resolution independence and custom history, we have
made the following API changes in Moonstone:

* Added `moon.DayPicker`.

* Added `moon.ExpandableListDrawer`, an `enyo.Drawer` with `renderOnShow` set to
    `true` by default.

* Added `moon.ItemOverlay`, a helper control for managing layout within a
    `moon.Item`.  Also added related mixin `moon.ItemOverlaySupport`.

* Added `moon.PanelsHandle`.

* Added work-in-progress kinds `moon.LightPanels` and `moon.LightPanel`.

* Standardized implementation of `uppercase` property across Moonstone library.

* Replaced `moon.HourPicker` with base kind `moon.HourMinutePickerBase` plus
    subkinds `moon.HourPicker` and `moon.MinutePicker`.

* In `moon.CheckboxItem`, added `active` property, used to track whether the
    checkbox is the active item in a group.

* In `moon.ExpandableIntegerPicker`, set default value of `0` and removed
    unnecessary `noneText` property.

* In `moon.ListActions`, added events for start and end of open and close
    animations (`onShow`, `onShown`, `onHide`, and `onHidden`).

* In `moon.Scroller`, added `hideScrollColumnsWhenFit`, a Boolean flag that may
    be set to `true` to force paging controls to be hidden (default is `false`).
