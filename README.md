# QuickMyAnimeList
QuickMyAnimeList (QMAL) is a handy Chrome extension that allows you to edit, add, or delete an anime in your MyAnimeList list. Of course, there are many more features...? 

## Official Website
Official QuickMyAnimeList website is at http://www.foxinflame.tk/QuickMyAnimeList

## Webstore
I will not put this Chrome Extension on the webstore, simply because I don't want to pay.

## Installation
Check out the official website to see specific instructions to installing Chrome extensions from websites.

## Sources
- Bootstrap : Used in popup for layout, and because required for MDB
- MaterialDesignBootstrap : Used in popup for layout, buttons, and animations
- ColorPicker : Used in options for selecting Badge Color
- jQuery : Used for easy DOM selection, AJAX calls, and everything
- MaterializeCSS : Used in options because MDB didn't have form elements stylized
- RateYo : Used in popup to rate the selected anime easily
- Select2 : Used in popup to search and select the anime easily

## Development
The Chrome Extension uses jQuery for mostly everything, including the AJAX Requests, the Show/Hide toggles, the Next/Previous buttons, and a lot more. Without jQuery, this Chrome Extension would be nothing.

The MAL API also hepled out a TON in creating this. Well, not helped out, but more like, was neccessary. Becuase without the API, the extension wouldn't have been able to retreive, add, and delete data from your anime list.

Not just the MAL API, but a whole freaking JS/CSS library helped me style it to look like Google's Material Design. The library is called Material Design Bootstrap, and as the name suggests, I used Twitter Boostrap as well. In the Options page, however, I couldn't

I use a lot of inline styling. I know it's a bad practice, but I really don't like to go back and forth between files just to edit one simple margin. So please bear with me.

## What's new!?
### Release 1.2!

Lots of new stuff! Redesigned Options page, badges, everything!

#### Features kept from previous veresion (1.0)

- Ability to add edit, or delete an anime to your MAL account
- Ability to rate, add or edit tags and other options for the chosen anime
- Ability to view synopsis and other titles for the chosen anime
- Ability to search for an anime easily using the Select2 jQuery library and the MAL API
- Ability to login to your MAL account in the options, and verify if the credentials are real or not

#### New features of Version 1.2

- Nice little homepage on Options page
- Nice Clean Source Files (sorted into libraries folder)
- Badges on the icon to show the anime count (configurable in options)
- Redesigned Material Design options page to configure badge, popup elements, and credentials.
- Choose which action to execute when icon clicked (open MAL list, open QMAL popup, open QMAL list, etc) *Took ages to make :D*
- Automatically displays a popup when you visit a streaming site (Works only on gogoanime so far, but still awesome)
- Probably more.

##### Small Update : 1.2.1

- Fixed Bug [2]

#### Removed features from previous version (1.0)

- Options page (to be replaced with the new)
- Icon (to be replaced with an even cooler one)

#### Next up for 1.X, 2.0, and later on.

- Change layout design (1.X)
- Change CSS library from Material Design to Bootstrap (2.0) **PARTIALLY DONE**
- More input fields in popup for chosen anime, such as start/end date, rewatched episodes, etc (1.X)
- ~~Add options to show/hide inputs in the popup (1.X)~~ **DONE**
- ~~Better organized and stylized options page (1.X)~~ **DONE**
- Ability to select a theme of CSS, Material Design, Bootstrap, Classic, etc. (2.0)
- Automatically increase number and change to "Watching" if video site is visited (e.g. gogoanime.io/blah-episode-1) (2.0 or later) **PARTIALLY DONE**
- Display popup on video site (e.g. kissanime.to/Anime/blah/Episode-1) and let user choose if QMAL should automatically update the list or not (2.0 or later) **PARTIALLY DONE**
- Probably more. You know what, let me rephrase. There will 100% be more stuff. (1.X, 2.0, 3.0)

#### Bugs / Problems / Suggestions / Support

- **BUG** [1] In-Page only works on gogoanime.io (Will be fixed for later 1.X)
- ~**BUG** [2] In-Page doesn't work when there is only one result in the API search~ (Fixed with 1.2.1)
- **Suggestions** None... :(
- **Support** None, not even replies to threads I make... :(

There are several ways you can tell me your opinion :

- Create a branch and a pull request on GitHub
- Create an issue ticket on GitHub, so I can have a look at your opinion
- Email me at burningfoxinflame@gmail.com
- Tweet to me at @FoxInFlame with the hashtag "#QuickMyAnimeList"
- PM me on Reddit @FoxInFlame
- etc.

## Licence
<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms" property="dct:title">QuickMyAnimeList</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">FoxInFlame</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
