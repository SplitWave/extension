import { FC, useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import React from "react";
import styles from '../styles/Home.module.scss'
import { Link } from 'react-router-dom';



type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: ()=>Promise<void>;
    on: (event: PhantomEvent, callback: (args:any)=>void) => void;
    isPhantom: boolean;
}

type WindowWithSolana = Window & { 
    solana?: PhantomProvider;
}



const Connect2Phantom: FC = () => {

    const [ walletAvail, setWalletAvail ] = useState(false);
    const [ provider, setProvider ] = useState<PhantomProvider | null>(null);
    const [ connected, setConnected ] = useState(false);
    const [ pubKey, setPubKey ] = useState<PublicKey | null>(null);


    useEffect( ()=>{
        if ("solana" in window) {
            const solWindow = window as WindowWithSolana;
            if (solWindow?.solana?.isPhantom) {
                setProvider(solWindow.solana);
                setWalletAvail(true);
                // Attemp an eager connection
                solWindow.solana.connect({ onlyIfTrusted: true });
            }
        }
    }, []);

    useEffect( () => {
        provider?.on("connect", (publicKey: PublicKey)=>{ 
            console.log(`connect event: ${publicKey}`);
            setConnected(true); 
            setPubKey(publicKey);
        });
        provider?.on("disconnect", ()=>{ 
            console.log("disconnect event");
            setConnected(false); 
            setPubKey(null);
        });

    }, [provider]);


    const connectHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log(`connect handler`);
        provider?.connect()
        .catch((err) => { console.error("connect ERROR:", err); });
    }

    const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log("disconnect handler");
        provider?.disconnect()
        .catch((err) => {console.error("disconnect ERROR:", err); });
    }

    return (
      <div>
          { walletAvail ?
              <>
              <button disabled={connected} onClick={connectHandler} className={styles.phantom}>Connect to Phantom <span className={styles.icon}></span></button>
              <button disabled={!connected} onClick={disconnectHandler} className={styles.phantom}>Disconnect from Phantom <span className={styles.icon}></span></button>
              {/* { 
              connected ? 
              <button disabled={!connected} onClick={disconnectHandler} className={styles.phantom}>Disconnect from Phantom <span className={styles.icon}></span></button>
            : 
              null 
              } */}
              { connected ? console.log("Wallet Connected") : console.log("Wallet Disconnected")}
              {/* { connected ? <Link to={"/pending"}></Link> : console.log("please connect your wallet")} */}
              </>
          :
              <>
              <p>Opps!!! Phantom is not available. Go get it <a href="https://phantom.app/">https://phantom.app/</a>.</p>
              </>
          }
      </div>
  );
}

export default Connect2Phantom;
