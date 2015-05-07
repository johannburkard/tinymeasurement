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

## Usage

- Chose a namespace to export the functions under (default is "eaio")
- Add your own property ID
- You may want to change the host name

