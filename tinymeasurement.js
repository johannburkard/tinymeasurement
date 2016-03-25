(function(window, name, tid) {

    var eaio = window[name] = window[name] || {}

    eaio['extend'] = function() {
        var target = arguments[0], args = [].slice.call(arguments, 1), i, j
        for (i = 0; i < args.length; ++i) {
            if (args[i]) {
                for (j in args[i]) {
                    if (args[i].hasOwnProperty(j) && args[i][j] != undefined && args[i][j] !== '') {
                        target[j] = args[i][j]
                    }
                }
            }
        }
        return target
    }

    function serialize(obj, str, p) {
        str = []
        for (p in obj) {
            if (obj.hasOwnProperty(p) && obj[p] != undefined && obj[p] !== '') {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
            }
        }
        return str.join('&')
    }

    function abbreviate(x, maxlength) {
        return (x || '').length > maxlength ? x.substr(0, maxlength - 3) + '...' : x
    }

    function track(params, extra) {
        if (1 == navigator['doNotTrack']) return
        var url = 'https://www.google-analytics.com/collect?' + serialize(eaio.extend({}, eaio['track']['defaultParams'], params, extra))
        try {
            navigator.sendBeacon(url)
        }
        catch (e) {
            new Image().src = url
        }
    }

    function trackPerformance(r0, name, label, params) {
        var timing = eaio['track']['timing']
        if (r0.requestStart) {
            timing(name, 'DNS', (r0.domainLookupEnd - r0.domainLookupStart)+.5|0, label, params)
            timing(name, 'TCP', ((r0.secureConnectionStart ? r0.secureConnectionStart : r0.connectEnd) - r0.connectStart)+.5|0, label, params)
            timing(name, 'TTFB', (r0.responseStart - (r0.startTime || r0.navigationStart))+.5|0, label, params)
        }
        if (r0.secureConnectionStart) {
            timing(name, 'SSL', (r0.connectEnd - r0.secureConnectionStart)+.5|0, label, params)
        }
    }

    eaio['track'] = {
            'defaultParams': { 'v': 1, 'tid': tid, 'cid': +new Date, 'aip': 1, 'ul': navigator['userLanguage'] || navigator['language'],
                'sr': [ screen['width'], screen['height'] ].join('x'), 'dl': abbreviate(location['href'], 2048), 'dt': abbreviate(document['title'], 1500) },
            'timingSamplingRate': .2,
            'pageview': function(url, title, params) {
                track({ 't': 'pageview', 'dl': abbreviate(url, 2048), 'dt': abbreviate(title, 1500) }, params)
            },
            'event': function(category, action, label, value, nonInteraction, params) {
                track({ 't': 'event', 'ec': abbreviate(category, 150), 'ea': abbreviate(action, 500), 'el': abbreviate(label, 500), 'ev': value, 'ni': nonInteraction ? 1 : 0 }, params)
            },
            'timing': function(category, variable, time, label, params) {
                // See https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTiming
                if (time < 1000 * 60 * 60 && Math.random() < eaio['track']['timingSamplingRate']) {
                    track({ 't': 'timing', 'utc': abbreviate(category, 150), 'utv': abbreviate(variable, 500), 'utt': time, 'utl': abbreviate(label, 500) }, params)
                }
            },
            'exception': function(category, thrown, label, params) {
                try {
                    var message = thrown['message'] ? thrown['name'] + ': ' + thrown['message'] : /^([^\r\n]+)/.exec(thrown['stackTrace'] || thrown['stack'])[1]
                    var stack = (thrown['stackTrace'] || thrown['stack']).replace(/^[^:]+: [^\r\n]+/, '').replace(/\s\(([^)]+)\)/g, '@$1').replace(/[\r\n](\s*at)?\s+/g, ' > ').replace(/https?:\/\/[^/]+/ig, '...')
                    eaio['track']['event'](category, message + ' ' + stack, label, null, null, params) 
                }
                catch (e) {}
            },
            'social': function(network, action, target, params) {
                track({ 't': 'social', 'sn': abbreviate(network, 50), 'sa': abbreviate(action, 50), 'st': abbreviate(target || location['href'], 2048) }, params)

            },
            /**
             * Performance tracking of loaded resources.
             * 
             * See http://www.stevesouders.com/blog/2014/08/21/resource-timing-practical-tips/ (used with changes to the TCP time calculation).
             */
            'resourcePerformance': function(pattern, name, label, params) {
                try {
                    var resourceEntries = window.performance.getEntriesByType('resource'), i, r0
                    for (i = 0; i < resourceEntries.length; ++i) {
                        r0 = resourceEntries[i]
                        if (pattern.test(r0.name)) {
                            trackPerformance(r0, name, label, params)
                            break
                        }
                    }
                }
                catch (e) {}
            },
            /**
             * Performance tracking of the page itself.
             */
            'pagePerformance': function(name, label, params) {
                try {
                    trackPerformance(window.performance.timing, name, label, params)
                }
                catch (e) {}
            }
    }


})(window, 'eaio', 'UA-XXXXXXX-XX')
