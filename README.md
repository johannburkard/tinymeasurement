# tinymeasurement

Tiny JavaScript client for the [Google Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters). Originally written for [EAIO](http://eaio.com/?utm_source=github&utm_medium=open-source&utm_campaign=tinymeasurement)'s widget.
Useful if you want to ping back some data from your widget into your Google Analytics account, without relying on ga.js or analytics.js being present.

*Attention: The API has changed on 2015-03-25.*

## Features

* Page view tracking
* Event tracking
* Exception tracking
* Social tracking
* User timing tracking
* HTML 5 Resource timing tracking
* HTML 5 Page timing tracking 
* Respects DoNotTrack
* Survives Google Closure with Advanced Optimizations
* All parameters can be overwritten
* Uses `navigator.sendBeacon` by default
* About 1 KB post gzip

## Usage

- Set the Google Analytics property ID
- Optional: Chose a namespace to export the functions under (default is "eaio")


```JavaScript
...
})(window, 'eaio', 'UA-XXXXXXX-XX') <-- edit this!
```

## Examples

### Page view tracking

```JavaScript
eaio.track.pageview('http://guh.com', 'Guh - literally the best Guh EVER!')
```

Arguments: Location, title, parameters (optional)

### Event Tracking

```JavaScript
eaio.track.event('fnuh', 'guh', location.host)
```

Arguments: Event category, event action, event label, event value (optional), nonInteraction (optional), parameters (optional)

### Exception tracking

```JavaScript
try {
 pickedUpTheTelephoneThenDialedTheSevenDigits()
}
catch (e) {
 eaio.track.exception('yo', e, "it's marquis baby")
}
```

Arguments: Event category, exception, event label (optional), parameters (optional)

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

Arguments: Timing category, timing variable, time, timing label (optional), parameters (optional)

### Social tracking

```JavaScript
eaio.track.social('facebook', 'like', location.href)
```

Arguments: Social network, social action, social target (optional), parameters (optional)

### HTML 5 Resource Timing tracking

Timing information includes:

* DNS lookup
* TCP handshake
* SSL handshake (excluding the TCP handshake time, which is different from Souders' code that I stole)
* TTFB (time to first byte)

#### Resource performance tracking by regular expression

```HTML
<script src="//some-shady-3rd-party-server.com/weird-widget-that-we-dont-trust.js"></script>
<script>
eaio.track.resourcePerformance(/3rd-party-server/, 'That damn 3rd party script')
</script>
```

Arguments: Pattern, name, label (optional), parameters (optional)

(This only works if the server delivers the script with a `Timing-Allow-Origin: *` header. Many CDNs do.)

#### Resource performance tracking for the current page

```HTML
<script>
eaio.track.pagePerformance('expensive Page')
</script>
```

Arguments: Name, label (optional), parameters(optional)

### Parameters

```JavaScript
eaio.track.resourcePerformance(/3rd-party-server/, 'Yet another 3rd party script', null, { 'dh': '3rd-party-server.com' })
```

Tracks the resource performance under the `3rd-party-server.com` host name. Useful if you set up different views.

### Timing sampling rate

By default, 20 % of all calls to timing methods will be sent to Google Analytics. To change this, set:

```JavaScript
eaio.track.timingSamplingRate = .1
```

[![Analytics](https://ga-beacon.appspot.com/UA-7427410-89/tinymeasurement/README.md?pixel)](https://github.com/igrigorik/ga-beacon)