# QuickMyAnimeList
[![Join the chat at https://gitter.im/QuickMyAnimeList/Lobby](https://badges.gitter.im/QuickMyAnimeList/Lobby.svg)](https://gitter.im/QuickMyAnimeList/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![license](https://img.shields.io/github/license/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)]() [![GitHub release](https://img.shields.io/github/release/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)](https://github.com/FoxInFlame/QuickMyAnimeList/releases) [![GitHub commits](https://img.shields.io/github/commits-since/FoxInFlame/QuickMyAnimeList/1.2.svg?maxAge=2592000)]() [![Github All Releases](https://img.shields.io/github/downloads/FoxInFlame/QuickMyAnimeList/total.svg?maxAge=2592000)]()

[![GitHub forks](https://img.shields.io/github/forks/FoxInFlame/QuickMyAnimeList.svg?style=social&label=Fork&maxAge=2592000)]()
[![GitHub watchers](https://img.shields.io/github/watchers/FoxInFlame/QuickMyAnimeList.svg?style=social&label=Watch&maxAge=2592000)]() [![Twitter Follow](https://img.shields.io/twitter/follow/FoxInFlame.svg?style=social&label=Follow&maxAge=2592000)]()

QuickMyAnimeList (QMAL) is a handy Chrome extension that allows you to edit, add, or delete an anime in your MyAnimeList list. Of course, there are many more features...? 

## Official Website [![Website](https://img.shields.io/website-up-down-green-red/http/www.foxinflame.tk.svg?maxAge=2592000&label=official website)](http://www.foxinflame.tk/QuickMyAnimeList)
Official QuickMyAnimeList website is at http://www.foxinflame.tk/QuickMyAnimeList

## Webstore
I will not put this Chrome Extension on the webstore, simply because I don't want to pay the initial $5 fee.

## Installation
Check out the official website to see specific instructions to installing Chrome extensions from websites.

## Screenshots
Check out the official website for screenshots in HD.

## Included Libraries
- Bootstrap : Used in popup for layout, and because required for MDB
- QuickFit : To create dynamically-resizing text for anime titles in the MaterializeCSS theme
- MaterialDesignBootstrap : Used in popup for layout, buttons, and animations for the MDB theme
- ColorPicker : Used in options for selecting Badge Color
- Bez : To use cubiz-beizers within .animate()
- jQuery : Used for easy DOM selection, AJAX calls, and everything
- MaterializeCSS : Used in options and popup for layout, buttons, and animations for the MaterializeCSS theme
- RateYo : Used in popup to rate the selected anime easily for both themes
- Select2 : Used in popup to search and select the anime easily for the MDB theme

## Development
The Chrome Extension uses jQuery for mostly everything, including the AJAX Requests, the Show/Hide toggles, the Next/Previous buttons, and a lot more. Without jQuery, this Chrome Extension would be nothing.

The MAL API also hepled out a TON in creating this. Well, not helped out, but more like, was neccessary. Becuase without the API, the extension wouldn't have been able to retreive, add, and delete data from your anime list.

Not just the MAL API, but a lot of other JS/CSS libraries helped me style it to look like Google's Material Design. The main CSS library is called MaterializeCSS, however you can configure the extension to use the Material Design Bootstrap Library instead if you want to.


## What's new!?
### Release 1.3!

Redesigned Popup!! Yeah. Uh-huh. And in-page on Crunchyroll.

#### Features kept from previous veresion (1.2)

- Ability to add edit, or delete an anime to your MAL account
- Ability to rate, add or edit tags and other options for the chosen anime
- Ability to view synopsis and other titles for the chosen anime
- Ability to search for an anime easily using the Select2 jQuery library and the MAL API
- Ability to login to your MAL account in the options, and verify if the credentials are real or not
- Material Design Options pages
- In-Page QMAL for gogoanime.io

#### New features of Version 1.3

- Ability to choose CSS theme to be used in popup from Options
- MaterializeCSS popup theme [Features a new Search function!]
- Added Crunchyroll In-Page QMAL! (May or may not function properly, I don't know, I don't use Crunchyroll) (Which means I kinda fixed Bug [[#7](https://github.com/FoxInFlame/QuickMyAnimeList/issues/7)])
- Easier Installation Method
- Auto App Updates! 
- Impletemented Suggesstion [[#12](https://github.com/FoxInFlame/QuickMyAnimeList/issues/12)] for MaterializeCSS theme
- Fixed Many Bugs.
- Probably more.

#### Removed features from previous version (1.2)

- Options.js and Options.html in the root directory (they were there for nothing)
- Many other useless files used for nothing such as the whole in-page directory

#### Next up for 1.X, 2.0, and later on.

- Change CSS library from Material Design to Bootstrap (2.0) **PARTIALLY DONE**
- More input fields in popup for chosen anime, such as start/end date, rewatched episodes, etc (1.X)
- ~~Add options to show/hide inputs in the popup (1.X)~~ **DONE**
- ~~Better organized and stylized options page (1.X)~~ **DONE**
- Ability to select a theme of CSS, Material Design, Bootstrap, Classic, etc. (2.0)
- Automatically increase number and change to "Watching" if video site is visited (e.g. gogoanime.io/blah-episode-1) (2.0 or later) **PARTIALLY DONE**
- Display popup on video site (e.g. kissanime.to/Anime/blah/Episode-1) and let user choose if QMAL should automatically update the list or not (2.0 or later) **PARTIALLY DONE**
- Probably more. You know what, let me rephrase. There will 100% be more stuff. (1.X, 2.0, 3.0)

#### Bugs / Problems / Suggestions / Support [![GitHub issues](https://img.shields.io/github/issues-raw/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)]() [![GitHub pull requests](https://img.shields.io/github/issues-pr/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)]()

- **BUG** [[#7](https://github.com/FoxInFlame/QuickMyAnimeList/issues/7)] In-Page only works on gogoanime.io (Will be fixed for later 1.X) *Added Crunchyroll in 1.3!*
- **BUG** [[#11](https://github.com/FoxInFlame/QuickMyAnimeList/issues/11)] Space within Anime Search for MDB theme makes results disappear (WIll be fixed for later 1.X)
- **Suggestion** [[#12](https://github.com/FoxInFlame/QuickMyAnimeList/issues/12)] A link/button for MAL page of anime in popup *Implemented in MaterializeCSS theme, but not MDB theme*

There are several ways you can tell me your opinion :

- Create a branch and a pull request on GitHub
- Create an issue ticket on GitHub, so I can have a look at your opinion
- Email me at burningfoxinflame@gmail.com
- Tweet to me at @FoxInFlame with the hashtag "#QuickMyAnimeList" or "#QMAL"
- PM me on Reddit @FoxInFlame
- Chat on the [Gitter.im chat](https://gitter.im/QuickMyAnimeList/Lobby)
- etc.

## License
Licensed under the MIT License. For more info, view the License file.
