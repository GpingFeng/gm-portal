import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect, SetStateAction } from 'react'
import { ethers } from 'ethers'
import WavePortal from '../WavePortal.json'
import { useAccount } from "wagmi";
import moment from 'moment'

const contractAddress = '0xa7df09af4e5e90db542639d4e97fd2585abe66d3'

function App() {
  useEffect(() => {
    getAllWaves()
    getTotalWaves()
    }, [])
  const [viewState, setViewState] = useState('view-posts')
  const [posts, setPosts] = useState([])
  const [message, setMessage] = useState('')
  const [totalWaves, setTotalWaves] = useState(0)
  const { address } = useAccount();

  async function getAllWaves() {
    const provider = new ethers.providers.Web3Provider((window.ethereum as any))
    const contract = new ethers.Contract(contractAddress, WavePortal.abi, provider)
    let data = await contract.getAllWaves()
    data = data.map((d: { waver: string, message: string; timestamp: string }) => ({
      waver: d['waver'],
      message: d['message'],
      timestamp: d['timestamp'],
    }))
    setPosts(data)
  }

  async function getTotalWaves() {
    const provider = new ethers.providers.Web3Provider((window.ethereum as any))
    const contract = new ethers.Contract(contractAddress, WavePortal.abi, provider)
    const totalWaves = await contract.getTotalWaves()
    console.log('total waves', totalWaves)
    setTotalWaves(totalWaves.toString())
  }

  async function wave() {
    const provider = new ethers.providers.Web3Provider((window.ethereum as any))
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, WavePortal.abi, signer)
    const tx = await contract.wave(message)
    await tx.wait()
    setViewState('view-posts')
  }

  function toggleView(value: SetStateAction<string>) {
    setViewState(value)
    if (value === 'view-posts') {
      getAllWaves()
      getTotalWaves()
    }
  }

  return (
    <div style={outerContainerStyle}>
      <div style={innerContainerStyle}>
      <h1>GM Portal</h1>
      {!address ? (<div>
        <h3>What is GM?</h3>
      <p>GM means good morning. It's GM o'clock somewhere, so there's never a bad time to say GM.</p>
        <h3>Getting Started</h3>
      <p>First, you will need to connect your Ethereum wallet to the Ethermint Sovereign Rollup to display the posts from the smart contract and post a GM.</p>
      <p>DM joshcs.lens or @JoshCStein with your Ethereum wallet address to receive EMINT tokens.</p>
      <h3>Nice, what's going on under the hood?</h3>
      <p>This GM Portal is built with <a href="https://celestia.org" target="_blank">Celestia</a>, <a href ="https://docs.celestia.org/developers/rollmint" target="_blank">RollKit</a>, & <a href="https://github.com/celestiaorg/ethermint" target="_blank">Ethermint</a>.</p>
      <p>The GM Portal is a <a href="https://celestia.org/glossary/sovereign-rollup" target="_blank">sovereign rollup</a> built on Celestia to provide <a href="https://celestia.org/glossary/data-availability" target="_blank">data availability</a> and <a href="https://ethereum.org/en/developers/docs/consensus-mechanisms/" target="_blank">consensus</a>, leveraging Ethermint with RollKit as the <a href="https://celestia.org/glossary/execution-environment" target="_blank">execution environment</a>.</p>
      <p>This allows users to securely create and share blog posts on the blockchain without the need for a centralized server or authority.</p></div> ) : null}
      <br />
      <h3 style={{ justifyContent: 'right', textAlign: 'right'}}>Connect your Ethereum wallet to begin ✨</h3>
      <div style={buttonContainerStyle}>
      <ConnectButton />
      </div>
      {address ? (
      <div style={buttonContainerStyle}>
        <button onClick={() => toggleView('view-posts')} style={buttonStyle}>View Posts</button>
        <button  onClick={() => toggleView('create-post')} style={buttonStyle}>Create Post</button>
      </div>
      ) : null}
      {
        viewState === 'view-posts' && address && (
          <div style={{ textAlign: 'left'}}>
            <div style={postContainerStyle}>
            <h1>Posts</h1>
            <h3>☀️ Total GMs: {totalWaves}</h3>
            {
              posts.slice().reverse().map((post, index) => (
                <div key={index}>
                  <h2>{post.message}</h2>
                  <p className="wallet-address">📤 From: {post.waver}</p>
                  <p>⏰ GM'd at: {moment.unix(post.timestamp).format('lll')}</p>
                </div>
              ))
            }
          </div>
          </div>
        )
      }
      {
        viewState === 'create-post' && (
          <div style={formContainerStyle}>
              <h2>Create Post</h2>
              <input
                placeholder='Message'
                onChange={e => setMessage(e.target.value)}
                style={inputStyle}
              />
              <button onClick={wave}>Create Post</button>
          </div>
        )
      }
      </div>
    </div>
  )
}

const outerContainerStyle = {
  padding: '50px 0px',
}

const innerContainerStyle = {
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
}

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as any,
  alignItems: 'center'
}

const inputStyle = {
  width: '400px',
  marginBottom: '10px',
  padding: '10px',
  height: '40px',
}

const postContainerStyle = {
  margin: '0 auto',
  padding: '1em',
  width: '90%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column' as any,
  alignItems: 'start',
  justifyContent: 'center',
}

const buttonStyle = {
  marginTop: 15,
  marginRight: 5,
  border: '1px solid rgba(255, 255, 255, .2)'
}

const buttonContainerStyle = {
  marginTop: 15,
  marginRight: 5,
  display: 'flex',
  justifyContent: 'right',
}

export default App
