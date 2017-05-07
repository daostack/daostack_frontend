#!/bin/bash

echo 'Deploying app to IPFS'

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $ROOT_DIR
cd ../build

js_hash=`ipfs add main.js -q`
ipfs_url="/ipfs/$js_hash"
echo "uploaded JS to IPFS - $ipfs_url"

# Replace main.js with IPFS hosted JS file
sed -i -e 's%/main.js%'"$ipfs_url"'%g' "index.html"
echo "replaced js file in index.html"

# Upload index.html to IPFS
index_hash=`ipfs add index.html -q`
index_ipfs_url="https://ipfs.io/ipfs/$index_hash"
echo "DAOstack index.html uploaded to IPFS - $index_ipfs_url"

cd ..

today=`date '+%Y_%m_%d__%H_%M_%S'`;

if [ "$1" == "ropsten" ]; then
	sed -i "/ROPSTEN_DEPLOYEMENTS/a * [$today]($index_ipfs_url)" "README.md"
fi

if [ "$1" == "kovan" ]; then
	sed -i "/KOVAN_DEPLOYEMENTS/a * [$today]($index_ipfs_url)" "README.md"
fi

echo "Added latest deploy to readme"
git add README.md
git commit -m 'Saving new deployment IPFS link to Readme'
echo 'Saving new deployment IPFS link to Readme'
