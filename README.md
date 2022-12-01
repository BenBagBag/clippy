# Clippy Clone

## Running locally

In the terminal, run:

`
$ npm install
$ live-server
`
Navigate to http://127.0.0.1:8080/ in your browser.

## Viewing online

TODO: add url

## To-dos

I ran out of time before I got everything done. Here's some stuff I would have added if I'd had more time:

- Do more research on the trade-offs/conventions of setting HTML vs. using `document.createElement`, improve the code accordingly.
- Improve the visuals: this is a very bare-bones layout where my main requirement was that none of the elements overlap. I also nabbed a fun color scheme (https://colorhunt.co/palette/10a19d540375ff7000ffbf00) but it's not the most readable and it should definitely be fleshed out beyond four colors for a more complicated UI.
- Better error handling for the quote API. A spinner while the quote loads would also be a better UI experience.

## Testing

I took a (very) quick look at the Adobe Spectrum Web Components project's testing. It looks like they're using Sinon and Chai to write individual tests and Mocha to run the test suite.

To do some unit tests for this project, you could:

- stub the `getQuote` function result with Sinon.
- write some unit tests, using Chai for assertions:
    - test that each of the elements show up when the page initially loads (both links and the inspiration button)
    - test that no quote renders on first page load
    - test that a quote appears when you click the inspiration button
    - test that the inspiration button's text changes after being clicked
    - test that the quote changes after you click the button a second time (would need to create a second stub for a new quote)
