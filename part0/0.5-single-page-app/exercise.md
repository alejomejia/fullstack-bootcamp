BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
SERVER  - Response  ===> HTML-code
BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
SERVER  - Response  ===> main.css
BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
SERVER  - Response  ===> spa.js

**NOTE:** Browser starts executing js-code that requests `JSON` data from server

BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
SERVER  - Response  ===> [{ .... }]

**NOTE:** Browser executes the event handler that renders notes to display
