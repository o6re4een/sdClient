import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { GlowWalletAdapter,
        PhantomWalletAdapter,
        SlopeWalletAdapter,
        SolletWalletAdapter,
        SolflareWalletAdapter,
        LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useState} from 'react';

import PlayButton from "./components/startPlay/startPlay.jsx"

import dart from "./svg/dart.png"
import target from "./svg/target.png"
import leftArrrow from "./svg/arrowr.svg"
import rightArrrow from "./svg/arrowl.svg"


import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './components/Modal/Modal.jsx';

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');


const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};


const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolletWalletAdapter(),
            /**
             * Select the wallets you wish to support, by instantiating wallet adapters here.
             *
             * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
             * That package supports tree shaking and lazy loading -- only the wallets you import
             * will be compiled into your application, and only the dependencies of wallets that
             * your users connect to will be loaded.
             */
            
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    const [modalActive, setModalActive] = useState(false)
    const [game, setGame] = useState<number>(0)
   
    const [activedart, setActiveDart] = useState(false)
    
    
  
   

    return (
        <div className="App">    
            <div className="sd__navbar">
                <button className='sd__guide' onClick={()=>{setModalActive(true)}}>How to play</button>
                <WalletMultiButton /> 
            </div>
            <div className='sd__body'> 
                <div className="sd__right"><img src={rightArrrow} onClick={()=>{
                    toast.error('Temporarily unavailable', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }} /></div>       
                <div className="sd__body__center">
                    <div className='sd__body__center__board'>
                        <img src={target}></img>
                    </div>
                    <div>
                        <img src={dart} className={`dart${activedart ? `-active-${game}` : ""}`}></img>
                    </div>   
                </div>  
                <div className="sd__left"><img src={leftArrrow} onClick={()=>{
                    toast.error('Temporarily unavailable', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }}/></div>      
            </div>
                <PlayButton activedart = {activedart} setActiveDart={setActiveDart} setGame = {setGame} >Play</PlayButton>
            <div className='sd__gradient1'></div>
            <div className='sd__gradient2'></div>
            <ToastContainer
                position="top-right"

                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover/>
             <Modal active={modalActive} setActive = {setModalActive}>
                <div className='sd__instruction'>
                    <p>1. Connect Wallet</p>
                    <p>2. Set bid in sol</p>
                    <p>3. Click play</p>
                    <p>4. Approve transaction</p>
                    <p>5. Wait for notification</p>
                </div>
                </Modal>  
        </div>
    );
};
export default App;