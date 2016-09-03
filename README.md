# QuickMyAnimeList
QuickMyAnimeList (QMAL) is a handy Chrome extension that allows you to edit, add, or delete an anime in your MyAnimeList list. Of course, there are many more features...? 

## Official Website
Official QuickMyAnimeList website is at http://www.foxinflame.tk/QuickMyAnimeList

## Webstore
I will not put this Chrome Extension on the webstore, simply because I don't want to pay.

## Installation
Check out the official website to see specific instructions to installing Chrome extensions from websites.

## Screenshots
Check out the official website for screenshots in HD.

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
### Release 1.3!

Redesigned Popup!!

#### Features kept from previous veresion (1.2)

- Ability to add edit, or delete an anime to your MAL account
- Ability to rate, add or edit tags and other options for the chosen anime
- Ability to view synopsis and other titles for the chosen anime
- Ability to search for an anime easily using the Select2 jQuery library and the MAL API
- Ability to login to your MAL account in the options, and verify if the credentials are real or not
- Material Design Options pages
- In-Page QMAL for gogoanime.io

#### New features of Version 1.3

- Ability to choose CSS theme on popup (WIP)
- MaterializeCSS popup theme (WIP) [Features a new Search style!]
- More QMAL sites (WIP)
- Probably more.

#### Removed features from previous version (1.2)

- Options.js and Options.html in the root directory (they were there for nothing)

#### Next up for 1.X, 2.0, and later on.

- Change layout design (1.X)
- ~~Change CSS library from Material Design to Bootstrap (2.0)~~ **ABORTED**
- More input fields in popup for chosen anime, such as start/end date, rewatched episodes, etc (1.X)
- ~~Ability to select a theme of CSS, Material Design, Bootstrap, Classic, etc. (2.0)~~ **PARTIALLY DONE**
- Automatically increase number and change to "Watching" if video site is visited (e.g. gogoanime.io/blah-episode-1) (2.0 or later) **PARTIALLY DONE**
- Display popup on video site (e.g. kissanime.to/Anime/blah/Episode-1) and let user choose if QMAL should automatically update the list or not (2.0 or later) **PARTIALLY DONE**
- Probably more. You know what, let me rephrase. There will 100% be more stuff. (1.X, 2.0, 3.0)

#### Bugs / Problems / Suggestions / Support

- **BUG** [[#7](https://github.com/FoxInFlame/QuickMyAnimeList/issues/7)] In-Page only works on gogoanime.io (Will be fixed for later 1.X)
- ~~**BUG** [[#8](https://github.com/FoxInFlame/QuickMyAnimeList/issues/8)] In-Page doesn't work when there is only one result in the API search~~ (Fixed with 1.2.1)
- **BUG**  [[#9](https://github.com/FoxInFlame/QuickMyAnimeList/issues/9)] In-Page QMAL doesn't work when anime name contains special characters (Will be fixed for later 1.X)
- **BUG** [[#10](https://github.com/FoxInFlame/QuickMyAnimeList/issues/10)] Thumbs.db file error when loading extension (Fixed in 1.3)
- **BUG** [[#11](https://github.com/FoxInFlame/QuickMyAnimeList/issues/11)] Space within Anime Search makes results disappear (Fixed in 1.3)
- **Suggestion** [[#12](https://github.com/FoxInFlame/QuickMyAnimeList/issues/12)] A link/button for MAL page of anime in popup (Will be added in 1.3)
- **BUG** [[#13](https://github.com/FoxInFlame/QuickMyAnimeList/issues/13)] Change anime status number to text (Will be fixed in 1.3)
- **BUG** [[#14](https://github.com/FoxInFlame/QuickMyAnimeList/issues/14)] Options Page Not Responsive (Will be fixed in 1.3)

There are several ways you can tell me your opinion :

- Create a branch and a pull request on GitHub
- Create an issue ticket on GitHub, so I can have a look at your opinion
- Email me at burningfoxinflame@gmail.com
- Tweet to me at @FoxInFlame with the hashtag "#QuickMyAnimeList" or "#QMAL"
- PM me on Reddit @FoxInFlame
- etc.

## Licence
<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms" property="dct:title">QuickMyAnimeList</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">FoxInFlame</span> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
