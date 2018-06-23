import React from 'react'
import { Radio, Tab } from 'semantic-ui-react'
import { connect } from "react-redux"

import styles from './palette.module.css'

class PalettePane extends React.Component {
    state = {
        grayscale: false
    }
    toggleGrayscale() {
        this.setState({
            ...this.state,
            grayscale: !this.state.grayscale
        })
    }
    render() {
        const { groupedPalette } = this.props
        return (<Tab.Pane>
            <h2>Colour Palette</h2>
            <p>A preview of all of the colours, arranged by a number of declarations in the stylesheet.</p>
            <p><Radio toggle label='Include grayscale colors' onChange={this.toggleGrayscale.bind(this)} /></p>
            <div className={styles.palettecontainer}>
                {
                    groupedPalette && groupedPalette
                        .filter(({ hsl }) => this.state.grayscale || !!hsl[1])
                        .map((colour) => {
                            return (
                                <div key={colour.hex} className={`ui ${styles.palette}`} style={{
                                    backgroundColor: colour.hex
                                }}></div>
                            )
                        })
                }
            </div>
        </Tab.Pane>)
    }
}

export default connect(({ groupedPalette }) => {
    return {
        groupedPalette
    }
})(PalettePane)