# tinymeasurement
Tiny JavaScript client for the Google Measurement Protocol. Originally written for [eaio](http://eaio.com)'s widget.

## Features

* Respects DoNotTrack
* Event tracking
* Page view tracking
* Exception tracking
* User timing tracking (sampled at 20 %)
* Survives Google Closure with Advanced Optimizations
* HTML 5 Resource Timing API tracking based on regular expressions
* All parameters can be overwritten through a separate object
* Less than 1 KB post gzip

## Usage

- Chose a namespace to export the functions under (default is "eaio")
- Add your own property ID
- You may want to change the host name

```JavaScript
})(window, 'eaio', 'UA-XXXXXXX-XX', location.host) <-- here!
```

## Examples

### Event Tracking

```JavaScript
eaio.track.event('fnuh', 'guh', location.host)
```

### Page view tracking

```JavaScript
eaio.track.pageview('http://guh.com', 'Guh - literally the best Guh EVER!')
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

Some stack trace mangling is done in order to transport as much information as possible to Google Analytics.

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

### HTML 5 Resource Timing tracking

```HTML
<script src="//some-shady-3rd-party-server.com/weird-widget-that-we-dont-trust.js"></script>
<script>
eaio.trackResourcePerformance(/3rd-party-server/, 'That damn 3rd party script')
</script>
```

Timing information for the 3rd party widget includes:

* DNS lookup
* TCP handshake
* SSL handshake (excluded from the TCP handshake time, which is different from Souder's code that I stole)
* TTFB (time to first byte)

(This only works if the script sends a `Timing-Accept-Origin` header. Many CDNs do.)

