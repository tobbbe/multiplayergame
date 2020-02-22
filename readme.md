## to run dev
client app is using CRA for dev
server is running for serverstuff

in client/ `npm start`
in server/ `npm start`

test on http://localhost:3000
(server is running on port 5000)

## to run prod
everything is run from server

first create/update prod build: `npm run build` in client/
=> files are copied from client/build to server/build

then run `npm run prod` in server/

access on http://localhost:5000