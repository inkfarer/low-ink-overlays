# low-ink-overlays

A [NodeCG](http://github.com/nodecg/nodecg) bundle.

## Screenshots

* to be added

## Install

1.1. Install NodeCG and [nodecg-cli](https://github.com/nodecg/nodecg-cli) (optional)

If you're using nodecg-cli:

2.1. Run `nodecg install inkfarer/low-ink-overlays`.

Otherwise:

2.1. Clone low-ink-overlays to `nodecg/bundles/low-ink-overlays`.

2.2. Install dependencies by running `npm install` and `bower install` in `nodecg/bundles/low-ink-overlays`.

3.1. For last.fm integration to work, create the configuration file at `nodecg/cfg/low-ink-overlays.json`.

Example configuration file:
```
{
	"lastfm": {
		"targetAccount": "Your last.fm account",
		"apiKey": "your API key",
		"secret": "your secret"
	}
}
```

## Usage

Start NodeCG. By default, the dashboard can be accessed from `localhost:9090` in your browser.

From the dashboard, URLs to the graphics can be found from the graphics tab. To use them, they should be added as browser sources in a broadcast application such as OBS Studio. The graphics are made to run at a resolution of 1920x1080.

## Credits

Last.fm extension (extension/lastfm-playing.js) from [toth5-overlay.](https://github.com/TipoftheHats/toth5-overlay)