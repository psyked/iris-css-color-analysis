import React from 'react'
import { Segment, Tab, Popup } from 'semantic-ui-react'

import styles from './similar.module.css'

export default (props) => <Tab.Pane>
    <h2>Similar colours</h2>
    <p>The following colour groups have been tested with the <a href="http://zschuessler.github.io/DeltaE/">Delta-E 2000 algorithm</a> and are determined to be <a href="http://zschuessler.github.io/DeltaE/learn">perceptually indistinct,</a> making them good candidates for reducing to a single colour.</p>
    <div>
        {
            props.deduplicatedgroups.map(({ id, value: group }) => {
                return (
                    <Segment key={id} vertical>
                        <div className={styles.palettecontainer}>
                            {group.map((colour) => {
                                return (
                                    <Popup
                                        trigger={<div key={colour.hex} className={`ui ${styles.palette} ${colour.hsl[2] > 50 ? styles.palette_dark : styles.palette_light}`} style={{ backgroundColor: colour.hex }}>
                                            {colour.hex.toUpperCase()}
                                        </div>}
                                        content={`Used ${colour.useCount} time${colour.useCount > 1 ? 's' : ''}`}
                                        position='top center'
                                        inverted
                                    />
                                )
                            })}
                        </div>
                    </Segment>
                )
            })
        }
    </div>
</Tab.Pane>