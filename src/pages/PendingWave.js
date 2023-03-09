import Navbar from "../components/Navbar"
import styles from "../styles/Home.module.scss"

export default function PendingWave() {

    return (
        <div className={styles.page2}>
            <Navbar />
            <div className={styles.pendingTx}>
                <p>PENDING WAVE</p>
            </div>
            <button className={styles.initiate}>Initiate new payment</button>
        </div>
    )
}
// its page 2