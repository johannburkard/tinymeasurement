# tinymeasurement
Tiny JavaScript client for the Google Measurement Protocol. Originally written for [eaio](http://eaio.com)'s widget.

* Respects DoNotTrack.
* Less than 1 KB post gzip.

## Features

* Event tracking
* Page view tracking
* Exception tracking
* User timing tracking (sampled at 20 %)
* Survives Google Closure with Advanced Optimizations
* HTML 5 Resource Timing API tracking based on regular expressions
* All parameters can be overwritten through a separate object

## Usage

- Chose a namespace to export the functions under (default is "eaio")
- Add your own property ID
- You may want to change the host name

## Samples

### Event Tracking

```JavaScript
eaio.track.event('fnuh', 'guh', location.host)
```

### Page view tracking

```JavaScript
eaio.track.pageview('http://guh.com', 'Guh - the best Guh on the web!')
```

### Exception tracking

```JavaScript
try {
 pickedUpTheTelephoneThenDialedTheSevenDigits()
}
catch (e) {
 eaio.track.exception('yo', e, location.href)
}
```

### User timing tracking

```HTML
...
</footer>
<script>
try {
 eaio.track.timing('performance', 'time to footer', 1 * new Date() - window.performance.timing.domInteractive)
}
catch (e) { /* Browser doesn't support the HTML 5 timing APIs which is cool */ }
</script>
```
