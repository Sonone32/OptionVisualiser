## React frontend for www.flowersync.com
---
### What is this?
An option visualiser built mainly with React, Chart.js, and Material-UI. Hosted on a Github page and interacts with a Sanic + Redis [backend](https://github.com/Sonone32/OptionVisualiserAPI) via a REST API. Visit the website for more information about the conceptual aspects of it, and hopefully you will find this website useful.

### Why this?
My brokerage account did not come with an option payout graphing utility and judging by Google results not a lot of other brokers have them. Online searches yield difficult-to-use tools which require users to input everything that could easily have been gathered from Yahoo Finance or other sources while also requiring a number of parameters difficult to obtain for the average users who just want an intuition on how multi-legged positions behave. So I built this website to make everything easier for everyone and myself, educationally of course.

### What is in here?
Inside the `src` folder contains all of the written source files for this repo.

* `__tests__` - Folder with all the automated tests. Still working on it, so not much to be said here.
* `api`
  * `api-client.js` - Factory function or class (since inheritance in ES6 classes does not have imposed virtual methods so the line is really blurry) which returns an object that interacts with the backend API.
  * `yahoo.js` - Class which uses data from Yahoo Finance. Currently the default one.
  * `tradier.js` - Class which uses data from Tradier. Since Tradier offers a free development API so this project was built with their API until later when I figured out that Yahoo Finance is better to work with.
* `fonts`
  * `Kelvetica.otf` - I found [Kelvetica](https://www.dafont.com/kelvetica.font) years ago and I really liked its design. The only downside is that it does not have upper cases.
* `graph`
  * `charts`
    * `charts.jsx` A wrapper component that displays one of the three plots below based on user's choice.
    * `data-table.jsx` Table that displays values at current underlying price.
    * `data-table.css` CSS file that styles `data-table.jsx`.
    * `plot-greeks.jsx` Plots option greeks. A child of `charts.jsx`.
    * `plot-iv.jsx` IV stands for implied volatility. Also a child of `charts.jsx`.
    * `plot-payoff.jsx` Creative name speaks for itself. And its parent is apparent.
  * `models`
    * `bsm.js` Implementation of solutions to aspects of Black-Scholes-Merton model.
    * `math.js` General math formulae. Currently contains normal distribution cdf, pdf, and a rounding function.
    * `model.js` A factory function that returns an option valuation model to be called upon. 
  * `add-menu.jsx` - A component that is responsible for converting user input into adding new option position.
  * `graph-title.jsx` - The top bar of a graph. Handles expiry selection, removal, and refresh.
  * `graph.jsx` - The wrapper that fetches data through an APIClient object and routes them where they need to be. Contains everything else in here as children directly or indirectly.
  * `option-chip.jsx` - The blobs that represent an asset or position. The menu to edit these blobs is also in here.
  * `plot-basket` - Wrapper for all the presentational components here. Direct child of `graph.jsx` and does not handle any data modification.
* `about.jsx` - This is where I put the site description in a dialog.
* `animation.css` - Well named CSS file.
* `config-menu.jsx` - Is exactly what it sounds like.
* `cookies_min.js` - A cookie-accessing API found on Mozilla.
* `entry.jsx` - Shows the disclaimer page and handles agreement or decline accordingly.
* `index.css` - A very messy CSS file as JSX files have object styles in them.
* `index.js` - The DOM mounter.
* `index.jsx` - Handles top level interactions including searches, addition or removal of graphs and other functional components not related to the main purpose ot this website.

### What now?
I am currently writing automated tests before adding anything new. Meanwhile giving any feedback is greatly appreciated!

### How can I talk to you?
Email me at owner@flowersync.com. Comments, suggestions, ideas, or anything related to finance, math, or programming is appreciated.
