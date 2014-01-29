## dozuki-js

A client-side javascript library and example (`index.html`) for accessing
iFixit.com or Dozuki.com's api and displaying instructional content.

## Usage
See `index.html` for a full example, but once the dependencies are in place,
all that's needed is the below javascript (note: one of the dependencies is a
stylesheet).

```js
var HTTP = new Dozuki.http.jQuery($); \\ creating a wrapper for other
                                      \\ libraryies is easy.
var dozuki = new Dozuki("www.ifixit.com", HTTP);
dozuki.guides.get(17383).then(function(guide) {
   var guideView = new Dozuki.GuideView(guide);
});
```

## Development

```
$ git clone https://github.com/danielbeardsley/dozuki-guide-view
$ cd dozuki-guide-view
$ git submodule update --init --recursive
$ open ./index.html
