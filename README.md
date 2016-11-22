![Banner](http://i.imgur.com/U2piPr4.png)
# QuickMyAnimeList
[![Join the chat at https://gitter.im/QuickMyAnimeList/Lobby](https://badges.gitter.im/QuickMyAnimeList/Lobby.svg)](https://gitter.im/QuickMyAnimeList/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![license](https://img.shields.io/github/license/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)]() [![GitHub release](https://img.shields.io/github/release/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)](https://github.com/FoxInFlame/QuickMyAnimeList/releases) [![Github All Releases](https://img.shields.io/github/downloads/FoxInFlame/QUickMyAnimeList/total.svg)]() [![Replies on Thread](http://www.foxinflame.tk/dev/matomari/api/forumTopic.php?id=1552137&color=blue&filetype=png&style=flat)]()

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
Check out the official website for screenshots.

## Included Libraries
- Bootstrap : Used in popup for layout, and because required for MDB
- QuickFit : To create dynamically-resizing text for anime titles in the MaterializeCSS theme
- MaterialDesignBootstrap : Used in popup for layout, buttons, and animations for the MDB theme
- ColorPicker : Used in options for selecting Badge Color
- Bez : To use cubic-beizers within .animate()
- jQuery : Used for easy DOM selection, AJAX calls, and everything
- Custom edited MaterializeCSS : Used in options and popup for layout, buttons, and animations for the MaterializeCSS theme
- RateYo : Used in popup to rate the selected anime easily for both themes
- Select2 : Used in popup to search and select the anime easily for the MDB theme
- xml2json : Convert XML to JSON easily. Used with like, all of the AJAX requests.

## Development
The Chrome Extension uses JavaScript for everything, including the AJAX Requests, the Show/Hide toggles, the Next/Previous buttons, and a lot more. This Chrome Extension would be nothing without JavaScript. 

The MAL API also hepled out a TON in creating this. Well, not helped out, but more like, was neccessary. Becuase without the API, the extension wouldn't have been able to retreive, add, and delete data from your anime list.

Not just the MAL API, but a lot of other JS/CSS libraries helped me style it to look like Google's Material Design. The main CSS library is called MaterializeCSS, however you can configure the extension to use the Material Design Bootstrap Library instead if you want to.


## What's new!?
### Release 1.3.4!

More links!

#### Features kept from previous version (1.3.3)

- Ability to add edit, or delete an anime to your MAL account
- Login to your MAL account in the options, and verify if the credentials are real or not
- Choose what to open when icon clicked (popup, panel, website, etc)
- Awesome icon.
- In-Page QMAL for gogoanime.io, crunchyroll.com and kissanime.to

#### New features of Version 1.3.4

- Waaaaay quicker loading time in the popup (remember how you had to wait a while before pressing add/edit?)
- Smoother animation when clicking on the add/edit button in the popup
- Fixed 2 bugs
- Probably more.

#### Removed features from previous version (1.3.3)

- None.

#### Next up for 1.X, 2.0, and later on.

- Detailed Options for In-Page QMAL
- Link to open QMAL on many other anime pages, such as AniDB, AniList, gogoAnime, etc.
- Use a better MAL API
- More input fields in popup for chosen anime, such as start/end date, rewatched episodes, etc (1.X)
- Add an option to disable CPU-demanding animations and transitions (1.X)
- Login using Google+, Twitter, or third-party auth.
- Use more of FoxInFlame's MAL scraper.
- Probably more. You know what, let me rephrase. There will 100% be more stuff. (1.X, 2.0, 3.0)

#### Bugs / Problems / Suggestions / Support [![GitHub issues](https://img.shields.io/github/issues-raw/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)]() [![GitHub pull requests](https://img.shields.io/github/issues-pr/FoxInFlame/QuickMyAnimeList.svg?maxAge=2592000)]()

Everything is filed under Issues.


There are several ways you can tell me your opinion :

- Create a branch and a pull request on GitHub
- Create an issue ticket on GitHub, so I can have a look at your opinion
- Email me at burningfoxinflame@gmail.com
- Tweet to me at @FoxInFlame with the hashtag "#QuickMyAnimeList" or "#QMAL"
- PM me on Reddit @FoxInFlame
- Chat on the [Gitter.im chat](https://gitter.im/QuickMyAnimeList/Lobby)
- Submit stuff on the subreddit [/r/QuickMyAnimeList](https://reddit.com/r/QuickMyAnimeList)
- etc.

## License
Licensed under the MIT License. For more info, view the License file.
