import React, { Component , Routes, Route } from 'react';
import './App.css';
import Main from './Main.js';
import Web3 from 'web3';
import MaoriArt from '../contracts/build/MaoriArt.json'

const ipfsClient = require('ipfs-http-client');
const projectId = '';
const projectSecret = '';

const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsClient({
    host: 'infura-ipfs.io',
    port: 5001,
    protocol: 'https',
    headers: {
       authorization: auth,
    },
});

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()  
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = MaoriArt.networks[networkId]
    if(networkData) {
      const abi = MaoriArt.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract: contract })
      const artString = await contract.methods.readFromBlockchain().call()
      let artVariables = artString.split(' ')
      this.setState({ artHash: artVariables[0] })
      this.setState({ artName: artVariables[1] })
      this.setState({ artistName: artVariables[2] })
      console.log(contract)
    } else {
      window.alert('Smart contract is not deployed to the detected network')
    }
    console.log(networkId)
  }
  
  constructor(props) {
    super(props);
    // this is in charge of keeping the frontend state
    // but we want to keep the backend state so whenever the frontend 
    this.state = {
      account: '',
      buffer: null,
      contract: null,
      artHash: '',
      artName: '',
      artistName: ''
    };
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Need to use metamask')
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result)})
    }
  }

  // QmezBS4txMgHtVg9HNBRRBqoKuRUseex2C2KcgqqVd7yJx
  // https://infura-ipfs.io/ipfs/QmezBS4txMgHtVg9HNBRRBqoKuRUseex2C2KcgqqVd7yJx
  onSubmit = (event) => {
    event.preventDefault()
    //console.log("Submitting the form...")
    console.log(document.getElementById("artistName").value + " " + document.getElementById("artName").value);

    client.add(this.state.buffer, (error, result) =>{
      const artHash = result[0].hash
      this.setState({ artHash: artHash })
      
      const artistName = document.getElementById("artName").value
      this.setState({ artistName: artistName})

      const artName = document.getElementById("artistName").value
      this.setState({ artName: artName })

      if(error) {
        console.error(error)
        return
      }
      // store file in blockchain
      this.state.contract.methods.writeToBlockchain(artHash, artName, artistName).send( {from: this.state.account} ).then((r) => {
        this.setState({ artHash: artHash })
        this.setState({ artistName: artistName })
        this.setState({ artName: artName })
      })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
           Māori Art
          </a>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-block">
                <small className="text-white">{this.state.account}</small>
              </li>
            </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                  <img src={`https://infura-ipfs.io/ipfs/${this.state.artHash}`}  width={500} height={500} />
              
                <form onSubmit={this.onSubmit}>
                  <br />
                  <label>Artist Name: </label>
                  <input type='text' id="artistName"></input>
                  <br />
                  <br />
                  <label>Art Name: </label>
                  <input type='text' id="artName"></input>
                  <br />
                  <br />
                  <input type='file' onChange={this.captureFile}/>
                  <input type='submit'onSubmit={this.onSubmit}/>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
