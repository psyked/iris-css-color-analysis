import React from 'react'
import { Card, Segment, Tab, Popup, Input, Label } from 'semantic-ui-react'

import styles from './palette.module.css'

export default (props) => <Tab.Pane>
    <h2>Colour Palette</h2>
    <p>A preview of all of the colours, arranged by a number of declarations in the stylesheet.</p>
    <div className={styles.palettecontainer}>
        {
            props.groupedPalette && props.groupedPalette.map((colour) => {
                return (
                    <div key={colour.hex} className={`ui ${styles.palette}`} style={{
                        backgroundColor: colour.hex
                    }}></div>
                )
            })
        }
    </div>
</Tab.Pane>