<h1>Fight of Dwarves</h2>

Arena fighting game for up to 4 players based on MelonJS.
http://melonjs.github.io/tutorial-platformer/

<h3>Contributions:</h3>
<ul>
	<li>Dwarf sprites: <a href="http://opengameart.org/content/delve-deeper-dwarves">http://opengameart.org/content/delve-deeper-dwarves</a></li>
	<li>Level tiles: <a href="http://opengameart.org/content/pixel-art-castle-tileset">http://opengameart.org/content/pixel-art-castle-tileset</a></li>
	<li>Music</li>
	<ul>
		<li>Title screen: We're the Resistors by Eric Skiff: <a href="http://ericskiff.com/music/">http://ericskiff.com/music/</a></li>
		<li>In game music: Ferrous Rage by Ozzed (Album: Cor Metallicum): <a href="http://ozzed.net/music/">http://ozzed.net/music/</a></li>
	</ul>
</ul>

<h3>Known issues</h3>
If you encounter errors while `npm-install` with package `chromium-pickle`, remove `grunt-asar` from package.json (https://github.com/melonjs/boilerplate/issues/20).

melonJS boilerplate
-------------------------------------------------------------------------------

features :
- video autoscaling
- mobile optimized HTML/CSS
- swiping disabled on iOS devices
- debug Panel (if #debug)
- default icons
- distribution build
- standalone build for desktop operating systems

## To run distribution

To build, be sure you have [node](http://nodejs.org) installed. Clone the project:

    git clone https://github.com/melonjs/boilerplate.git

Then in the cloned directory, simply run:

    npm install

You must also have `grunt-cli` installed globally:

    npm install -g grunt-cli

Running the game:

	grunt serve

And you will have the boilerplate example running on http://localhost:8000

## Building Release Versions

To build:

    grunt

This will create a `build` directory containing the files that can be uploaded to a server, or packaged into a mobile app.

----

Building a standalone desktop release:

    grunt dist

Running the desktop release on Windows:

    .\bin\electron.exe

Running the desktop release on Mac OS X:

    open ./bin/Electron.app

Running the desktop release on Linux:

    ./bin/electon

Note that you may have to edit the file `Gruntfile.js` if you need to better dictate the order your files load in. Note how by default the game.js and resources.js are specified in a specific order.

-------------------------------------------------------------------------------
Copyright (C) 2011 - 2015 Olivier Biot, Jason Oster, Aaron McLeod
melonJS is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
