# Fireworksify

Ever wanted to create exploding fireworks on your website or app? Ever want to have images flying through your website or app with an exploding effect? If yes, then this little project is for you!

We created Fireworksify to help developers add something fun to their application. This project will add a VERY minimal size to your page. The total size for this function is **~2k**.

## Installing

Installation is pretty simple. Download the latest release and upload the CSS and JS files to your webserver. You will need to change the [PATH] variables to reflect where you uploaded the files.

```html
<link type="text/css" href="[CSS_FILE_PATH]/fireworksify.css" />
<script src="[JS_FILE_PATH]/fireworksify.js"></script>
```

## Usage

We have a couple of ways to implement this within your app. The most common way would be to instantiate the object and pass in a configuration value. Check out the example below:

```javascript
window.onload = function() {
    let fireworksify = new Fireworksify({
        duration: 10
    });
    fireworksify.start();
};
```
The above example will run a fireworks display on page load and will run for 10 seconds. The other example is if you wanted to generate fireworks manually. (fires from the middle of the screen)

```javascript
fireworksity.generate((window.innerWidth / 2), (window.innerHeight / 2));
```
The final example shows how to include a custom class with a background image and apply that to a new firework seed:

```css
.hedgie-stunna-shades {
    width: 100px;
    height: 124px;
    background-image: url('./images/mini-hedgie-stunna.png');
}
```
```javascript
window.onload = function() {
    let fireworksify = new Fireworksify({
        duration: 10,
        additionalSeeds: [{
            explode: true,
            destroy: false,
            class: 'hedgie-stunna-shades'
        }]
    });
    fireworksify.start();
};
```

## Settings

Variable | Type | Description
--- | --- | ---
duration | *integer* | Sets the number of seconds the fireworks display will run. (**Default: 10**)
showDefault | *boolean* | Determines if the instantiated object is going to use the default fireworks seed. (**Default: true**)
additionalSeeds | *array* | An array of additional seed type objects that will be selected at random when a new seed is triggered. (**Default: []**)
additionalSeeds.explode | *boolean* | Determines if a seed is going to explode at the top of its arch.
additionalSeeds.destroy | *boolean* | Determines if a seed gets destroyed at the top of its arch. (removed from dom) If not, it will fall back down and get removed from the dom when it leaves the view.
additionalSeeds.class | *boolean* | This is a styling options for the new seed.

## Authors

* **nowtwo-llc** - [nowtwo-llc.com](https://nowtwo-llc.com/)

## License

This project is licensed under the MIT License.

## Acknowledgments

* [Original Fireworks Project](https://shenhuang.github.io/demo_projects/fireworkdemo.html)