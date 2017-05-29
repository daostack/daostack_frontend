DAOstack Frontend readme

# Run app locally

Dependencies:
* [NVM](https://github.com/creationix/nvm#installation)
* [NodeJS + NPM](https://github.com/creationix/nvm#usage)
* [Yarn](https://yarnpkg.com/en/) - `curl -o- -L https://yarnpkg.com/install.sh | bash`
* [DAOstack Solidity Contracts](https://github.com/daostack/daostack) - Clone the DAOstack solidity smart contracts repository from github in to the same 'apps' folder in which the 'daostack_frontend' repo is placed.

If you're using Atom as your code editor consider installing the following packages:
* [language-ethereum](https://atom.io/packages/language-ethereum)
* [linter-eslint](https://atom.io/packages/linter-eslint)
* [react](https://atom.io/packages/react) - `apm install react`

`yarn install`

# Developer Development Environments

## Working with testrpc
1. Install [testrpc](https://github.com/ethereumjs/testrpc)
1. Switch off chrome extensions such as MetaMask or Parity extension OR have MetaMask listen to localhost:8545
2. Run `testrpc` in one terminal tab
3. In a separate tab run `yarn testrpc`

## Working with Kovan testnet locally
1. Install parity - `bash <(curl https://get.parity.io -Lk)`
2. Create a file in the root of the project called 'kovan_pass.txt' with your parity wallet password
3. Run `parity --no-warp --unlock KOVAN_ACCOUNT_PUBLIC_ADDRESS --password kovan_pass.txt --chain=kovan` in another terminal tab
4. Run `yarn kovan`

## Working with Ropsten Testnet locally (without MetaMask)
1. Run geth testnet - `geth --testnet --rpc --rpccorsdomain '*' --rpcport 8545 console`
2. Get some testnet ETH - `curl -X POST  -H "Content-Type: application/json" -d '{"toWhom":"0x9449939b942ec2d2db4ada31712125431c27ec41"}' https://ropsten.faucet.b9lab.com/tap` OR try [this link](http://faucet.ropsten.be:3001/)
3. Unlock your account in the geth console - `personal.unlockAccount(eth.accounts[0], 'PASSWORD', 100000)`
5. `yarn ropsten`


# Deployment

## Dependencies:
* [IPFS](https://ipfs.io/docs/getting-started/)
* [sed](http://www.grymoire.com/Unix/Sed.html) - `sudo apt-get install sed`

## Deploy to Kovan testnet
1. Start the `ipfs daemon` in one terminal
2. Create a file in the root of the project called 'kovan_pass.txt' with your pairty wallet password
3. Run `parity --no-warp --unlock KOVAN_ACCOUNT_PUBLIC_ADDRESS --password kovan_pass.txt --chain=kovan --dapps-port 8090` in another terminal
4. Then run `yarn deploy_ipfs_kovan`

* If you aren't connecting to any peers `0/0/25 peers` - delete your db by running `parity db kill --chain=kovan` and start the parity node with `--no-warp`


## Deploy to Ropsten testnet
1. Start the `ipfs daemon` in one terminal
2. Run `geth --testnet --rpc --rpccorsdomain '*' --unlock ROPSTEN_ACCOUNT_PUBLIC_ADDRESS --password ropsten_pass.txt console` in another terminal
3. Unlock your account: `personal.unlockAccount(eth.accounts[0], 'lN8zzFgcUQI8', 100000)`
4. Run `yarn deploy_ipfs_ropsten` in another terminal


## Regular end users

* Install [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) or the [Parity Chrome Extension](https://chrome.google.com/webstore/detail/himekenlppkgeaoeddcliojfddemadig)
* In MetaMask - Make sure to switch the network to kovan


### Latest deployments of the dapp

ROPSTEN_DEPLOYEMENTS
* [2017_04_09__16_09_43](https://ipfs.io/ipfs/QmeGV8JyVqNwJo4CqfhG99QdEmPzUzzq2HZBZA1eUhL8Am)
* [2017_04_09__16_04_19](https://ipfs.io/ipfs/QmdfLWum2xHtgmfDi7dd5mCj4wJnRJDKhHtxnUuMn7RUSH)
* [2017_04_08__22_33_03](https://ipfs.io/ipfs/QmSZVLEtnpNWkSxcc2Toddd2kKiZnPe3JC2ExDYcQRHNT4)

KOVAN_DEPLOYEMENTS
* [2017_05_29__11_44_52](https://ipfs.io/ipfs/Qmd86GVUFhdyvbVJbiv3XkmjmRNPnsqTS5YL77spMXgk6e)
* [2017_05_29__11_39_03](https://ipfs.io/ipfs/QmYSMEyuADx2cE1Mmv1iF4TiqyDcGrvh59cMgGaaAfQ2wp)
* [2017_04_30__22_42_40](https://ipfs.io/ipfs/QmWbWX8FSaxZvdiWbDXioJFg8shVLSTK1KNgmy787BqwvU)
* [2017_04_21__16_02_06](https://ipfs.io/ipfs/QmbJbNiYBDQcVSk5rDxCHmrFtBAwTNQFi3PmqJpGUX46Rd)
* [2017_04_21__15_50_35](https://ipfs.io/ipfs/QmVhyKWrpVfLnGbFh6dSNEccgHAe23sm6BWHjjcFAF8k7s)
* [2017_04_20__00_58_09](https://ipfs.io/ipfs/QmW6WTnBbE3z1SRT5XZUdWE8fBZxxoSoQpvnjjKaVPZALo)
* [2017_04_19__13_21_00](https://ipfs.io/ipfs/QmZ5AmoaMeTYCToJfa1dyQSdNAtmyAApMSHUqx4EK7F9uX)
* [2017_04_18__19_52_07](https://ipfs.io/ipfs/QmTgXBBTfJmAh5NgRVwa2W4TFqehQKysFrDKgkxKy92k3h)
* [2017_04_18__19_38_20](https://ipfs.io/ipfs/QmPM3nQLgu2VUDJpUJLQXWHnFRtmgpfUvHFJDn1ph3VdqB)
* [2017_04_18__17_22_08](https://ipfs.io/ipfs/QmTNVkLZLi26UaEKAFStv7bxsBVMhZr4CcQV4KfDBMibKV)
* [2017_04_18__15_00_33](https://ipfs.io/ipfs/QmTsCB2uh8Bqeqw8pZEoUiwFKYDygNGAm7rMy8dvwyyTGm)
* [2017_04_16__18_41_18](https://ipfs.io/ipfs/QmThZQ86Y5umY445HUpfP3vBg7unohvzLRYRepgUnuzy8K)
* [2017_04_13__23_27_37](https://ipfs.io/ipfs/QmPCiTS9ukdJRhzBEXhe8peWuU6CoffLneoYiR72uABUM8)
* [2017_04_13__21_54_02](https://ipfs.io/ipfs/QmYnR1cN7zZXcANt9qaaCXzwNQViSu7r3wCXEM47toVffr)
* [2017_04_13__21_49_03](https://ipfs.io/ipfs/Qmb1fLnuuPWE6zKwQMqWtYUmKySNoBemNfQS7giEh3A7sf)
* [2017_04_13__17_49_32](https://ipfs.io/ipfs/QmQpXmnboEmRcZWJJZvZJSKKSbzbyHYVR55VD9pSWk3hQ2)
* [2017_04_11__18_33_40](https://ipfs.io/ipfs/QmcdRWuiFaejiTicDhWS2tvSgitZhgTfmWAsqbKd6Y53R2)
* [2017_04_11__18_17_30](https://ipfs.io/ipfs/QmVS63Lj4fXBknxQX9wKdtYkkHXe7XcQjJTk3ALTNtwpm2)
* [2017_04_09__23_31_08](https://ipfs.io/ipfs/QmcxLLkaGtjCaUvedF9tBa7uHiUp1AHRiWVHCZhhANpi4j)
* [2017_04_09__20_29_15](https://ipfs.io/ipfs/QmaSbTJz6ssnU1oBic48PK3jJ7zRkdEqwpLBunbPiQniCj)
* [2017_04_09__19_52_41](https://ipfs.io/ipfs/QmR1izfh1jkGqsFyg5rB9n3JX4umhVTYDeYLNs9WKzy3YP)
* [2017_04_09__19_41_52](https://ipfs.io/ipfs/QmR1izfh1jkGqsFyg5rB9n3JX4umhVTYDeYLNs9WKzy3YP)
* [2017_04_09__18_34_40](https://ipfs.io/ipfs/QmTawZswbJoRbUVyHUroJCAf1vUtx7sdR229cU6JGGpA9a)
* [2017_04_09__18_18_33](https://ipfs.io/ipfs/Qme6eisBGMJLMTW9HDiEprMVwZ6WnTtjdZeusVhCQoffNE)
* [2017_04_09__17_15_32](https://ipfs.io/ipfs/QmTt7WvqW1a1Nyg6BYgxgQs3CVJWSfmgocn4kT7hef5sYW)
* [2017_04_09__16_44_52](https://ipfs.io/ipfs/QmZWobaMMBAg8mV3ztXKBEAFGZVf7D8ekrEKQ62xn64xCd)
* [2017_04_08__22_54_12](https://ipfs.io/ipfs/QmeKxV8GLfNsQqLWmYJhJ4XxYoBk5q3Ga28BBwo17hFEQm)
* [2017_04_08__20_54_38](https://ipfs.io/ipfs/QmVuddHYb3th3ccCdHChTinz9WxJAhV6iSjtWKjXxqwmWU)
* [2017_04_06__22_48_08](https://ipfs.io/ipfs/QmWWERY1KEWuP6dwEsFmzS3rcbgD7sFQFzetsK4oU3ca1r)
