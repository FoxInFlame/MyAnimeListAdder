![Banner](https://i.imgur.com/U2piPr4.png)
# QuickMyAnimeList
[![Join the chat at https://gitter.im/QuickMyAnimeList/Lobby](https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=3600)]() [![license](https://img.shields.io/github/license/FoxInFlame/QuickMyAnimeList.svg?maxAge=3600)]() [![GitHub release](https://img.shields.io/github/release/FoxInFlame/QuickMyAnimeList.svg?maxAge=3600)](https://github.com/FoxInFlame/QuickMyAnimeList/releases) [![Github All Releases](https://img.shields.io/github/downloads/FoxInFlame/QuickMyAnimeList/total.svg?maxAge=3600)]() 

[![Chrome Web Store](https://img.shields.io/chrome-web-store/d/hbaegdehoobdkpfffdjmecohehhegaoo.svg?maxAge=3600)]() [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hbaegdehoobdkpfffdjmecohehhegaoo.svg?maxAge=3600)]() [![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/hbaegdehoobdkpfffdjmecohehhegaoo.svg?maxAge=3600)]() [![Chrome Web Store](https://img.shields.io/chrome-web-store/rating-count/hbaegdehoobdkpfffdjmecohehhegaoo.svg?maxAge=3600)]()

QuickMyAnimeList (QMAL) is a handy Chrome extension that allows you to edit, add, or delete an anime in your MyAnimeList list. Of course, there are many more features...? 

## Official Website [![Website](https://img.shields.io/website-up-down-green-red/http/www.foxinflame.tk.svg?maxAge=2592000&label=official website)](https://www.foxinflame.tk/QuickMyAnimeList)
Official QuickMyAnimeList website is at https://www.foxinflame.tk/QuickMyAnimeList

## Installation
A fairly strong computer might increase the smoothness because of all the transitions and AJAX requests.

### Webstore
You can install this extension from the Chrome Web Store. This is the recommended method, and is a lot easier. [Link to QMAL in the Store](https://chrome.google.com/webstore/detail/quickmyanimelist/hbaegdehoobdkpfffdjmecohehhegaoo).

Hundreds and thousands of thanks to Ampharos 2.0, who created the Web Store account (it costs $5 to create one)!

### Manual Installation
Check out the official website to see specific instructions to installing Chrome extensions from websites.

## Updating
Check out the official website to see specific instructions to updating QMAL.

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
- Codebird : Unofficial Twitter JavaScript library
- xml2json : Convert XML to JSON easily. Used with like, all of the AJAX requests.
- CryptoJS : Encrypting and Decrypting QMALSETTING files.
- ColorThief : To generate dynamic coloring in MaterializeCSS theme popup

## Development
The Chrome Extension uses JavaScript for everything, including the AJAX Requests, the Show/Hide toggles, the Next/Previous buttons, and a lot more. This Chrome Extension would be nothing without JavaScript. 

The MAL API also hepled out a TON in creating this. Well, not helped out, but more like, was neccessary. Becuase without the API, the extension wouldn't have been able to retreive, add, and delete data from your anime list.

Another API is used in this Chrome extension. Try guessing. I doubt that you'll get it right, because it's not at all known. It's the matomari API, developed by me myself and I. This API supplied the parts where the official API lacked (detailed information about an anime, etc)  

Not just those two MAL related API, but a lot of other JS/CSS libraries helped me style it to look like Google's Material Design. The main CSS library is called MaterializeCSS, however you can configure the extension to use the Material Design Bootstrap Library instead if you want to.


## What's new!?
### Release 1.3.6!

== SHORT DESCRIPTION GOES HERE ==

#### Features kept from previous version (1.3.5)

- Ability to add edit, or delete an anime to your MAL account
- Login to your MAL account in the options, and verify if the credentials are real or not
- Tons of configurable options
- In-Page QMAL for gogoanime.io, crunchyroll.com and kissanime.to
- Smooth and quick animations everywhere in the popup.
- A lot more than you can imagine.

#### New features of Version 1.3.6

- Fix 0 issues.
- Probably more.

#### Removed features from previous version (1.3.5)

- None.

#### Next up for 1.X, 2.0, and later on.

- Detailed Options for In-Page QMAL. (1.X)
- Link to open QMAL on many other anime pages, such as AniDB, AniList, gogoAnime, etc. (1.X)
- Use a better MAL API.
- More input fields in popup for chosen anime, such as start/end date, rewatched episodes, etc. (1.X)
- Add an option to disable CPU-demanding animations and transitions. (1.X)
- Login using Google+, Twitter, or third-party auth.
- Use more of matomari API.
- Encrypt username/password inside extension. (1.X)
- Bug report / crash report. (1.X, 2.X)
- Collect anonymous usage information. (2.X)
- Probably more. You know what, let me rephrase. There will 100% be more stuff. (1.X, 2.0, 3.0)

#### Bugs / Problems / Suggestions / Support [![GitHub issues](https://img.shields.io/github/issues-raw/FoxInFlame/QuickMyAnimeList.svg?maxAge=3600)]() [![GitHub pull requests](https://img.shields.io/github/issues-pr/FoxInFlame/QuickMyAnimeList.svg?maxAge=3600)]()

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
