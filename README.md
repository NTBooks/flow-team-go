# flow-team-go

Repo for Flow hackathon 2023

See the game!
https://www.youtube.com/watch?v=cnIjVhgkbYY

Try the live demo while it's up:
https://flowteamgo.waxworks.io/

# Want to run your own copy?

To prepare your environment:

Run "npm install --force" from both the client and server folders.
Add a .env to your server folder. It should contain the following:

```txt
TOKEN_SECRET=YOURSECRETGOESHERE
PORT=8252
SESSION_MINS=300
```

Add a .env to the client folder also with the following:

```txt
IMAGE_RESIZER="https://wsrv.nl/?url=%URL%&w=%WIDTH%"
PRIVATE_GATEWAY=YOUR PRIVATE FILEBASE IPFS GATEWAY
IMAGE_RESIZER_BYPASS="imgur"
```

To run the development version:

1. In a terminal navigate to the 'client' folder
2. Run "npm run watch"
3. Run index.js using the debugger in VS Code (check launch.json)

The server created by the VS Code Debugger will automatically fetch the react app in the dist folder. Parcel updates will still automatically refresh.
If you hit any snags try stopping the server and removing the .parcel-cache folder manually.

Run "npm install" as necessary and might need to clear the parcel cache.

```
MIT License

Copyright (c) 2023 Nick Tantillo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
