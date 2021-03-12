# low-ink-overlays

A [NodeCG](http://github.com/nodecg/nodecg) bundle, used for the Low Ink Splatoon tournament, hosted by [Inkling Performance Labs.](https://iplabs.ink/)

## Install

- Install [git](http://git-scm.com/)

- Install [node.js](https://nodejs.org/en/) (Using the LTS release (14.x as of writing) is recommended.)

- Install [nodecg-cli](https://github.com/nodecg/nodecg-cli) using `npm`: `npm install -g nodecg-cli`

- Install `nodecg` in a new folder:

```shell
mkdir nodecg
cd nodecg
nodecg setup
```

- Install the dashboard: `nodecg install inkfarer/ipl-overlay-controls` 
    
    - The overlays work with v2.x.x of `ipl-overlay-controls`. Specify a version by adding the version number with a
      \# symbol: `nodecg install ipl-overlay-controls#2.0.3`

- Install the overlays: `nodecg install inkfarer/low-ink-overlays`

- (Optional) Create the configuration file in `[nodecg root]/cfg/ipl-overlay-controls.json` with the following contents:

```json
{
	"lastfm": {
		"targetAccount": "Your Last.fm account name",
		"apiKey": "Your last.fm API key",
		"secret": "Your last.fm API secret"
	}
}
```

- Start nodecg using the `nodecg start` command in the folder you installed NodeCG in.

- Access the dashboard from `http://localhost:9090/` in your browser.

- Access the graphics from the "Graphics" tab in the dashboard. They are made to be used as browser sources in your preferred broadcast application, with a resolution of 1920x1080.
