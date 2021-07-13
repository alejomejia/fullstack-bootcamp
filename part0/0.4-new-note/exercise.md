**NOTE:** When SUBMIT clicked, `Form` action is triggered and user input is send using `POST`

BROWSER - Request   ===> HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note
SERVER  - Response  ===> HTTP 302
BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
SERVER  - Response  ===> HTML-code
BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
SERVER  - Response  ===> main.css
BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
SERVER  - Response  ===> main.js

**NOTE:** Browser starts executing js-code that requests `JSON` data from server. This includes the new user input sent before

BROWSER - Request   ===> HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
SERVER  - Response  ===> [..., { content: 'My just created note', date: '2021-07-13' }]
