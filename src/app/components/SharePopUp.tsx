import React from 'react'
import styles from "../page.module.css";
type SharePopUpProps={
link:string
}
const SharePopUp:React.FC<SharePopUpProps> = ({link}) => {
  return (
    <>
    <div className={styles["pop-up-background" as keyof typeof styles]}>
        </div>
       <div className={styles["pop-up-view" as keyof typeof styles]}>
        <h1>Send Link To Opponent:</h1>
        <p>/game/{link}</p>
        

        
        </div> 
    </>
  )
}

export default SharePopUp