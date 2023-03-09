import styles from "../styles/Home.module.scss"

export default function SelectAmount() {
    return (
        <div className={styles.page3}>
            <h2>Select an <span>amount</span> for payment</h2>
            <input className={styles.amount} placeholder="0 SOL" />
            <input  className={styles.tag} placeholder="Add a tag to the expense" />
            <button className={styles.split} >Split the amount</button>
            <button className={styles.cancel}>Cancel</button>
        </div>
    )
}
// its page 3