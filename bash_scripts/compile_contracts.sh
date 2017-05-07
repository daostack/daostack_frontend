#!/bin/bash

echo 'Compiling contracts using truffle'

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $ROOT_DIR
cd ../../daostack/

# In the daostack solidity folder:

echo 'Deleting old compiled contracts'
rm -r build/contracts/*

if [ "$1" == "testrpc" ]; then
	echo 'Running "truffle migrate"'
	truffle migrate
fi

if [ "$1" == "ropsten" ]; then
	echo 'truffle migrate --network ropsten --reset'
	truffle migrate --network ropsten --reset
fi

if [ "$1" == "kovan" ]; then
	echo 'truffle migrate --network kovan --reset'
	truffle migrate --network kovan --reset
fi

echo 'Copying contracts from daostack to frontend'
cp -r ./build/contracts/ ../daostack_frontend/client/data

# Back to daostack_frontend folder
# cd ../daostack_frontend/
# git add client/data/contracts --ignore-errors
# echo 'Committing new compiled contracts'
# git commit -m 'compiled solidity daostack contracts' --ignore-errors
