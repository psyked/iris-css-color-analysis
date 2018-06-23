import React from 'react'
import { Segment, Tab, Popup, Label, Icon } from 'semantic-ui-react'
import { connect } from "react-redux"

import styles from './similar.module.css'

export default connect(({ deduplicatedgroups }) => {
    return {
        deduplicatedgroups
    }
})(({ deduplicatedgroups }) => <Tab.Pane>
    <h2>Similar colours</h2>
    <p>
        The following colour groups have been tested with the <a href="http://zschuessler.github.io/DeltaE/">Delta-E
        2000 algorithm</a> and are determined to be <a href="http://zschuessler.github.io/DeltaE/learn">perceptually
        indistinct,</a> making them good candidates for reducing to a single colour. Colors are sorted left-to-right
        by brightness level, and the most numerous existing color definition is highlighted for convenience.</p>
    <div>
        {
            deduplicatedgroups.map(({ id, value: group }) => {
                return (
                    <Segment key={id} vertical>
                        <div className={styles.palettecontainer}>
                            {group.map(colour => {

                                const sortedGroup = [...group].sort((a, b) => {
                                    return b.useCount - a.useCount
                                })
                                const isKeeper = sortedGroup[0].useCount >= 1 && sortedGroup[0].hex === colour.hex;

                                return {
                                    ...colour,
                                    isKeeper
                                }

                            }).map((colour) => {
                                return (
                                    <Popup
                                        key={colour.hex}
                                        trigger={
                                            <div style={{ position: 'relative' }}>
                                                {/* {colour.useCount <= 1 &&
                                                    <Label color='red' corner='right'><Icon name='delete' /></Label>
                                                } */}
                                                {colour.isKeeper &&
                                                    <Label color='green' corner='right'><Icon name='check' /></Label>
                                                }
                                                <div key={colour.hex} className={`ui ${styles.palette} ${colour.hsl[2] > 50 ? styles.palette_dark : styles.palette_light}`} style={{ backgroundColor: colour.hex }}>
                                                    {colour.hex.toUpperCase()}
                                                </div>
                                            </div>
                                        }
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
</Tab.Pane>)