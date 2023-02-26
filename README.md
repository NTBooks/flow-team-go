# flow-team-go

Repo for Flow hackathon 2023

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
