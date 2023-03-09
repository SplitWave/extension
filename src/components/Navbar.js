import styles from "../styles/Home.module.scss"
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { useEffect, useState } from 'react';
import pfp from "../assets/images.jpeg";

export default function Navbar() {
    const [name, setName] = useState("Santiago");
    const [address, setAddress] = useState("dasdaxasxasxa");
    

    useEffect(() => {
        initialize()
    }, [])
    
    function initialize() {}

    return (
        <div className={styles.navbar}>
        <img src={pfp} height="40px" width="40px"alt="user pfp" />
        <div>
            <p>{name}</p>
            <p>{address}</p>
        </div>
        <div className={styles.icons}>
            <span><NotificationsActiveOutlinedIcon /></span>
            <span><DonutSmallOutlinedIcon /></span>
            <span><ExitToAppOutlinedIcon /></span>
        </div>
    </div>
    )
}