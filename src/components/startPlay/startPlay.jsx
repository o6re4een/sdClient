import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, {useCallback, useState } from 'react';
import { toast } from 'react-toastify';
//icons
import me from "./me.svg"
import ds from "./ds.svg"
import tw from "./tw.svg"
import Modal from '../Modal/Modal';
import gameItem from './win1.png'
import {API_URL} from "./config";
const solanaWeb3 = require('@solana/web3.js');




const StartPlay = ({setActiveDart, setGame, ...props}) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [modalActive, setModalActive] = useState(false)
    const [ammount, setAmmount] = useState(0)
    const [bidN, setBidN] = useState(0.1)
    const [isLoading, setLoading] = useState(false)
    
    const loader =()=>(
        <div className='loader__container'>
            <div className='loader'></div>
            <p className='loader__text'>Wait for confirm transaction</p>
        </div>
    )



    const onClick = useCallback(async () => {
        try{
            setLoading(true)
            if (!publicKey) throw new WalletNotConnectedError();
            let b = parseFloat(bidN)
            if(!b || b<0.05){ 
                throw new Error("Bid")     
            }
           const bb= b*LAMPORTS_PER_SOL
                                                   
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new solanaWeb3.PublicKey(process.env.REACT_APP_public),
                    lamports: bb,
                })
            );
           
            
            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight }
            } = await connection.getLatestBlockhashAndContext();
         
           
            
            
           
            const signature = await sendTransaction(transaction, connection, { minContextSlot}) ;

            await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature}, "finalized");           
           
          
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                "bid": b, 
                "sign": signature,
                "pub": publicKey
                
            })
            };
            
            const response = await fetch(`${API_URL}/game`, requestOptions);
            
            await response.json().then((data)=>{
                console.log(data);
                if(data.ammount === undefined){
                    setAmmount(0)
                }else{
                    setAmmount(data.ammount)
                }
                
                if(data.game === undefined){
                    setGame(0)
                }else{
                    setGame(data.game)
                }
                
            })
            setLoading(false)
          
            setActiveDart(current => !current); 

            setTimeout(()=>{setActiveDart(current => !current);setModalActive(true)
            }, 1500)
            
            
        } catch(err){
            
            if(err.name=="WalletSendTransactionError"){
                toast.error('Transaction rejected', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else if(err.name=="WalletNotConnectedError"){
                toast.error('Connect wallet to play', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                toast.error('Incorrect bid', {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                console.log(err)
            }
            setLoading(false)
        }

    }, [publicKey, sendTransaction, connection, bidN]);

    return (
        <div className='sd__footer'>
            
            <div className='sd__footer__container'>
                <div className="sd__footer__container__icons">
                    <a href='https://discord.gg/3YgrP9fhjc'><img src={ds}></img></a>  
                    <a href='https://discord.gg/3YgrP9fhjc'><img src={me}></img></a> 
                    <a href='https://discord.gg/3YgrP9fhjc'><img src={tw}></img></a> 
                </div>
                <div className="sd___footer__line">
                    <hr/>
                </div>
            </div>
            
            <input value={bidN}
                    type="number" step="0.01"
                    
                    placeholder = {"1 Sol"}
                    onChange={
                        (el)=>{setBidN(el.target.value)}
                    }
                    ></input>
             <button onClick={(onClick)} disabled={props.activeDart} className="play">
                Play
            </button>

            <Modal active={modalActive} setActive={setModalActive}>
                <div className='game'>
                    <h1>YOU WON</h1>
                    <div className='game__items'> 
                            <img src={gameItem} className="win1"></img>
                            <h2>{`${ammount} sol`}</h2> 
                            <img src={gameItem} className="win2"></img>
                        </div>
                </div>
                
            </Modal>   
            <Modal active={isLoading} setActive={setLoading}>
                {loader()} 
            </Modal> 
              
        </div>
          
    );
};
export default StartPlay