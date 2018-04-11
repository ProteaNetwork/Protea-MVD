# Protea Network MVP

This MVP repo presents the first iteration of the protea network. We develop a method for meetup groups and communities to create decentralized events and stake their attendance via an RSVP function that deposits ERC223 tokens into an event contract and returns them to the attendant upon successful attendance. Attendance is verified via a Proof of Attendance mechanism based on uPort.

* Token version of [Mokoto's BlockParty](https://github.com/makoto/blockparty)
* A token faucet to get initial tokens
* Front end app using [Truffle's](truffleframework.com) [Drizzle Framework](http://truffleframework.com/docs/drizzle/getting-started) & [React & uPort trufflebox](http://truffleframework.com/boxes/react-uport)

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

### Front end

First start up Ganache at port 7545, then compile the truffle contracts

```truffle compile```

Next deploy the contracts

```truffle deploy --network development```

Then load up the app with

```yarn run start```

<!-- 
## Running the tests


### Tests breakdwon


## Deployment -->



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
