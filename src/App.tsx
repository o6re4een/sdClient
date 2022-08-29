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

import dart from "../public/svg/dart.png"

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');


const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

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
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    const [activedart, setActiveDart] = useState(false)
    return (
        <div className="App">
            <div className="sd__navbar">
                <WalletMultiButton />
            </div>
            <div className='sd__body'>
                <div className="sd__body__left">
                    Left part
                </div>
                <div className="sd__body__center">
                    <div className='sd__body__center__board'>
                    <div className='circle'></div>
                    
                    </div>
                    <img src={dart} className={`dart${activedart ? "-active" : ""}`}></img>
                </div>
                <div className="sd__body__right">
                    Right part
                </div>
            </div>
            <div className="sd__footer">
                <button onClick={()=>{setActiveDart(current => !current); console.log(activedart);}}>start</button>
            </div>
                    
        </div>
    );
};
