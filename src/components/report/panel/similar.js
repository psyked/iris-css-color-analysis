import React from 'react'
import { Segment, Tab, Popup, Label, Icon } from 'semantic-ui-react'
import { connect } from "react-redux"
import removeDuplicates from '../../../libs/removeDuplicatesFromArrayByKey'

import styles from './similar.module.css'

const findColoursWithDistance = ({ min, max }, { groupedPalette, deduplicated }) => {
    const groups = groupedPalette.map(({ hex, distance }) => {
        return [
            ...distance.filter(({ distance }) => {
                return distance < max && distance > min
            }).map(({ hex: dhex }) => {
                return deduplicated.find(({ hex }) => dhex === hex)
            })
        ]
            .concat(deduplicated.find(({ hex: fhex }) => fhex === hex))
            .sort(({ hex: a }, { hex: b }) => {
                return parseInt(a.replace('#', ''), 16) - parseInt(b.replace('#', ''), 16);
            })
    }).filter(ar => ar.length > 1)

    let remappedGroups = groups.map((group) => {
        return {
            id: group.map(({ hex }) => hex).join('-'),
            value: group
        }
    })

    remappedGroups = removeDuplicates(remappedGroups, 'id')

    const allKeys = remappedGroups.map(({ id }) => id)

    remappedGroups = remappedGroups.filter((group) => {
        const keysWithSubset = allKeys.filter((key) => key.indexOf(group.id) !== -1)
        return keysWithSubset.length === 1
    })

    const deduplicatedgroups = remappedGroups
        .sort(({ value: a }, { value: b }) => {
            const ahue = a[0]['hsv'][0]
            const bhue = b[0]['hsv'][0]
            if (ahue !== bhue) {
                return bhue - ahue;
            }
            return b.length - a.length
        })

    return deduplicatedgroups
}

const renderPalette = (palette) => {
    return palette.map(({ id, value: group }) => {
        return (
            <Segment key={id} vertical>
                <div className={styles.palettecontainer}>
                    {group.map(color => {

                        const sortedGroup = [...group].sort((a, b) => {
                            return b.useCount - a.useCount
                        })
                        const isKeeper = sortedGroup[0].useCount >= 1 && sortedGroup[0].hex === color.hex;

                        return {
                            ...color,
                            isKeeper
                        }

                    }).map((color) => {
                        return (
                            <Popup
                                key={color.hex}
                                trigger={
                                    <div style={{ position: 'relative' }}>
                                        {/* {color.useCount <= 1 &&
                                    <Label color='red' corner='right'><Icon name='delete' /></Label>
                                } */}
                                        {color.isKeeper &&
                                            <Label color='green' corner='right'><Icon name='check' /></Label>
                                        }
                                        <div key={color.hex} className={`ui ${styles.palette} ${color.hsl[2] > 50 ? styles.palette_dark : styles.palette_light}`} style={{ backgroundColor: color.hex }}>
                                            {color.hex.toUpperCase()}
                                        </div>
                                    </div>
                                }
                                content={`Used ${color.useCount} time${color.useCount > 1 ? 's' : ''}`}
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

export default connect(({ groupedPalette, deduplicated }) => {
    return {
        perceptuallyIndistinct: findColoursWithDistance({ min: 0, max: 1 }, { groupedPalette, deduplicated }),
        similar: findColoursWithDistance({ min: 1, max: 2 }, { groupedPalette, deduplicated })
    }
})(({ perceptuallyIndistinct, similar }) => {
    return (<Tab.Pane>
        <h2>Perceptually indistinct colors</h2>
        <p>
            The following color groups have been tested with the <a href="http://zschuessler.github.io/DeltaE/">Delta-E
        2000 algorithm</a> and are determined to be <a href="http://zschuessler.github.io/DeltaE/learn">perceptually
        indistinct,</a> (Not perceptible by human eyes) making them good candidates for reducing to a single color. Colors are sorted left-to-right
        by brightness level, and the most numerous existing color definition is highlighted for convenience.</p>
        <div>
            {
                renderPalette(perceptuallyIndistinct)
            }
        </div>
        <h2>Similar colors</h2>
        <p>
            The following color groups have been tested with the <a href="http://zschuessler.github.io/DeltaE/">Delta-E
        2000 algorithm</a> and are determined to be <a href="http://zschuessler.github.io/DeltaE/learn">perceptually
        indistinct,</a> (Perceptible through close observation) making them good candidates for reducing to a single color. Colors are sorted left-to-right
        by brightness level, and the most numerous existing color definition is highlighted for convenience.</p>
        <div>
            {
                renderPalette(similar)
            }
        </div>
    </Tab.Pane>)
})