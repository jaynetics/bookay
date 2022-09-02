# bookay

[![Build Status](https://github.com/jaynetics/bookay/workflows/tests/badge.svg)](https://github.com/jaynetics/bookay/actions)

bookay is a set of free, open-source tools for self-hosting your bookmarks.

[
  ![Screenshot thumbnail showing the webapp and browser plugin](
    https://user-images.githubusercontent.com/10758879/113178657-1528d000-924f-11eb-9a02-2c0e4e504074.png
  )
](https://user-images.githubusercontent.com/10758879/113178042-77350580-924e-11eb-820f-298da2a2631d.png)

## Why?

- a bookmarking service is useful if you use varying browsers or devices
- there is currently no free service that supports nested folders
- self-hosting your bookmarks offers the best privacy

## Features

- easily deployed [backend](./server/)
- customizable, keyboard-friendly [browser plugin](./plugin/)
- lightweight (~50 kB) [web app](./webapp/)
- support for nested folders
- data import and export
- scan for dupes and broken links
- support for multiple users per instance
- responsiveness and dark mode

## Getting started

You need to run a bookay server to use bookay. It includes the webapp by default and also feeds the browser plugin. There are a few free hosting solutions that suffice to run the server. See [here](./server/README.md#how-to-use) for examples and deployment instructions.
