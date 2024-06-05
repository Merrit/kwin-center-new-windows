# Center New Windows KWin Script

KWin script that causes new windows to be centered on the screen.

The `Centered` window placement policy 
[was changed](https://invent.kde.org/plasma/kwin/-/merge_requests/3229) to 
include a cascading behaviour. This script restores the previous behaviour of 
_actually centering_ new windows on the screen.

An options dialog is included to allow the user to exclude applications from 
being centered.
