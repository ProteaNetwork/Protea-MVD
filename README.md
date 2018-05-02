# Protea Network MVP

This MVP repo presents the first iteration of the protea network. We develop a method for meetup groups and communities to create decentralized events and stake their attendance via an RSVP function that deposits ERC223 tokens into an event contract and returns them to the attendant upon successful attendance. Attendance is verified via a Proof of Attendance mechanism based on uPort.

* Token version of [Makoto's BlockParty](https://github.com/makoto/blockparty)
* A token faucet to get initial tokens
* Front end app using [Truffle's](truffleframework.com) [Drizzle Box](https://github.com/truffle-box/drizzle-box    ) 

## Getting Started

The individual MVP components are stored in on their own branches. The readme is to be updated depending on that features requirements.

### Prerequisites


`Node.Js`, `Truffle`, `Genache-cli`, `npm` or `yarn`, `geth`


### Installing

The project uses Dotenv for environment variables, please create the `.env` file and add:
```
INFURA_API_KEY=YOUR-KEY
MNEMONIC=candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
NODE_ENV=development
```


```
npm install or yarn install
```

### ERC223 & Tokenized BlockParty
Firstly open either Ganache GUI or Ganache-cli at port 7545.

To run Ganache-cli

```yarn run testnet```

To deploy the contracts, use:

```truffle migrate```


### Front end

First start up Ganache at port 7545 running at 3 second block time,

```yarn run testnet``` 

then compile the truffle contracts

```truffle compile```

Next deploy the contracts

```truffle migrate --network development```

Then load up the app with

```yarn run start```

<!-- 
## Running the tests


### Tests breakdwon


## Deployment -->

## Ganache accounts

### Mnemonic
camel ostrich bagel potato spaniel lettuce tomato mustard salt pepper cayenne butter

### Public Keys
(0) 0x225ef27570c7d0e4773caee4b6bc03526b5df370

(1) 0x3b1451961d6e8702be61954c02c4ae2b4199cf97

(2) 0x1bb0e83842730e904063d752918b378a7c92ce2f

### Private Keys
(0) eb752dc9a4acbc8f8520dcd5499d480274a8794cf612b9cb70cf343306903da0

(1) c3649567a7841ae9a519b6d209983302bca37cb4266433e85057ae818a3df34e

(2) 9fa998e9a3c49b2babfb7df5b41990487d1014b685d967fe5d99f1986f5c06e2

## Built With


* [Truffle](truffleframework.com) - Tooling suite for Solidity
* [React](https://reactjs.org/) - A front end JS framework for app development
* [Drizzle](http://truffleframework.com/docs/drizzle/getting-started) - A Blockchain [Redux](https://redux.js.org/) Library for React
* [uPort](https://www.uport.me/) - A blockchain self-sovereign identity wallet
* [BlockParty](https://github.com/makoto/blockparty) - An Ether Staking RSVP system


<!-- ## Contributing

Please read [CONTRIBUTING.md]() for details on our code of conduct, and the process for submitting pull requests to us. -->

<!-- ## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).  -->

## Authors

* **Ryan Noble** - *Initial work* - [Linum Labs](https://github.com/LinumLabs)

See also the list of [contributors](https://github.com/ProteaNetwork/Protea-MVP/graphs/contributors) who participated in this project.

## License

This project is licensed under the GNU License - see the [LICENSE.md](LICENSE.md) file for details

<!-- ## Acknowledgments

* 
 -->
