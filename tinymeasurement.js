(function(window, name, tid, dh) {

    var eaio = window[name] = window[name] || {}

    function serialize(obj) {
        var str = []
        for (var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] != undefined && obj[p] !== '') {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
            }
        }
        return str.join("&")
    }

    function abbreviate(x, maxlength) {
        return (x || '').length > maxlength ? x.substr(0, maxlength - 3) + '...' : x
    }

    function request(params, extra) {
        if (/y|1/.test(navigator['doNotTrack'] || navigator['msDoNotTrack'] || window['doNotTrack'])) return
        var url = 'https://www.google-analytics.com/collect?' + serialize(eaio.extend({}, eaio.track.defaultParams, params, extra))
        try {
            navigator.sendBeacon(url)
        }
        catch (e) {
            new Image().src = url
        }
    }

    eaio.track = {
            'defaultParams': { 'v': 1, 'tid': tid, 'dh': dh, 'cid': 1 * new Date, 'aip': 1, 'ul': navigator['userLanguage'] || navigator['language'] || '' },
            'timingSamplingRate': .2,
            'pageview': function(url, title, params) {
                request({ 't': 'pageview', 'dl': abbreviate(url, 2048), 'dt': abbreviate(title, 1500) }, params)
            },
            'event': function(category, action, label, value, noInteraction, params) {
                request({ 't': 'event', 'ec': abbreviate(category, 150), 'ea': abbreviate(action, 500), 'el': abbreviate(label, 500), 'ev': value }, params)
            },
            'timing': function(category, variable, time, label, params) {
                // See https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTiming
                if (time < 1000 * 60 * 60 && Math.random() < eaio.track['timingSamplingRate']) {
                    request({ 't': 'timing', 'utc': abbreviate(category, 150), 'utv': abbreviate(variable, 500), 'utt': time, 'utl': abbreviate(label, 500) }, params)
                }
            },
            'exception': function(category, thrown, label, params) {
            	try {
            	    eaio.track.event(category, thrown.stack ? thrown.stack.replace(/[\r\n]\s+\w+ /g, ' > ').replace(/https?:\/\/[^/]+/g, '...') : thrown, label, null, null, params) 
            	}
            	catch (e) {}
            }
    }

    /**
     * Performance tracking of loaded resources.
     * 
     * See http://www.stevesouders.com/blog/2014/08/21/resource-timing-practical-tips/ (used with changes to the TCP time calculation).
     * 
     * @return if a resource was found
     */
    eaio['trackResourcePerformance'] = function(pattern, name, label, params) {
        try {
            var resourceEntries = window.performance.getEntriesByType('resource')
            for (var i = 0; i < resourceEntries.length; ++i) {
                var r0 = resourceEntries[i], timing = eaio.track.timing
                if (pattern.test(r0.name)) {
                    if (r0.requestStart) {
                        timing(name, 'DNS', (r0.domainLookupEnd - r0.domainLookupStart)+.5|0, label, params)
                        timing(name, 'TCP', ((r0.secureConnectionStart ? r0.secureConnectionStart : r0.connectEnd) - r0.connectStart)+.5|0, label, params)
                        timing(name, 'TTFB', (r0.responseStart - (r0.startTime || r0.navigationStart))+.5|0, label, params)
                    }
                    if (r0.secureConnectionStart) {
                        timing(name, 'SSL', (r0.connectEnd - r0.secureConnectionStart)+.5|0, label, params)
                    }
                    return true
                }
            }
        }
        catch (e) {}
        return false
    }

})(window, 'eaio', 'UA-XXXXXXX-XX', location.host)
