# @bookay/plugin

This is a browser extension that lets you bookmark sites as you browse.

## How to use

Install it from your browser's extension store:

- [bookay ~~in the Chrome Web Store~~](https://chrome.google.com/webstore/detail/bookay/pfickfheilmaneonfehmocbebkdnlhjm)\*
- [bookay in Firefox Add-Ons](https://addons.mozilla.org/addon/bookay/)\*\*

**\*** Currently unavailable because of the [manifest debacle](https://www.eff.org/de/deeplinks/2021/12/googles-manifest-v3-still-hurts-privacy-security-innovation). I might not upgrade to manifest v3. You can download it for sideloading [here](https://drive.google.com/file/d/10bDYvpU-Xx6GagahA5pWelBMekWqQwin/view?usp=sharing) or you can clone this repo and build the extension manually. Also works for other Chromium-based browsers.

**\*\*** The Firefox addon is straightforward to use on desktop, but sadly very cumbersome on recent versions of Firefox for Android. [This is the official workaround](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/).

### Keyboard navigation

Toggle the plugin with `Ctrl/Cmd+Shift+E` (customizable), then
- choose an option: `Tab` or arrow keys
- or directly select a folder to add to: keys `1-n`
- or directy open a recent bookmark: first letter of name

## Development

The plugin can run in the latest browsers as-is (pre-build).

Edit code directly and load this folder as a Chromium browser extension to see the results.

To preview in Firefox / Firefox for Android, use [web-ext](https://github.com/mozilla/web-ext), e.g.

```
npm run build
cd ./build/mozilla
web-ext lint
web-ext run -f /Applications/Firefox\ Developer\ Edition.app
web-ext run --target=firefox-android --android-device=LGH930c7e1760d --firefox-apk org.mozilla.firefox
```

All tests are under ../test/.
