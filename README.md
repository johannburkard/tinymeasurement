# tinymeasurement

Tiny JavaScript client for the [Google Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters). Originally written for [EAIO](http://eaio.com)'s widget.
Useful if you want to ping back some data from your widget into your Google Analytics account, without relying on ga.js or analytics.js being present.

## Features

* Respects DoNotTrack
* Event tracking
* Page view tracking
* Exception tracking
* User timing tracking (sampled at 20 %)
* Survives Google Closure with Advanced Optimizations
* HTML 5 Resource Timing API tracking based on regular expressions
* Parameters can be overwritten through a separate object
* Less than 1 KB post gzip

## Usage

- Chose a namespace to export the functions under (default is "eaio")
- Add your own property ID
- You may want to change the host name

```JavaScript
})(window, 'eaio', 'UA-XXXXXXX-XX', location.host) <-- edit these!
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
catch (e) { /* Browser doesn't support the HTML 5 timing APIs which may happen */ }
</script>
```

### HTML 5 Resource Timing tracking

#### Resource performance tracking by regular expression

```HTML
<script src="//some-shady-3rd-party-server.com/weird-widget-that-we-dont-trust.js"></script>
<script>
eaio.trackResourcePerformance(/3rd-party-server/, 'That damn 3rd party script')
</script>
```
(This only works if the server delivers the script with a `Timing-Allow-Origin: *` header. Many CDNs do.)

#### Resource performance tracking for the current page

```HTML
<script>
eaio.trackPagePerformance('expensive Page')
</script>
```

Timing information includes:

* DNS lookup
* TCP handshake
* SSL handshake (excluding the TCP handshake time, which is different from Souder's code that I stole)
* TTFB (time to first byte)

### Passing custom parameters

```JavaScript
eaio.trackResourcePerformance(/3rd-party-server/, 'Yet another 3rd party script', null, { 'dh': '3rd-party-server.com' })
```

Tracks the resource performance under the `3rd-party-server.com` hostname. Useful if you set up different profiles for various components.
