import Navbar from "../components/Navbar";
import { useState } from "react";
import styles from "../styles/Home.module.scss"
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';

export default function AmountToPay(){

    const [amount, setAmount] = useState(100)
    return (
        <div  className={styles.page4}>
            <Navbar />
            <h4>Amount to pay</h4>
            <h2>{amount} SOL</h2>
            <p>Select a first wallet</p>
            <input placeholder="Fzmd...TTe2" />
            <span><ControlPointOutlinedIcon /></span>
            <div className={styles.btnGrp}>
                <button className={` ${styles.subButton} ${styles.equal} `}>Equal</button>
                <button className={styles.subButton}>Quarter</button>
                <button className={styles.subButton}>Bi-quater</button>
            </div>
            <button className={styles.summary}>Check summary</button>
            <button className={styles.back}>Go back</button>
        </div>
    )
}
// its page 4