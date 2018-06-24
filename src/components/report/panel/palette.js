import React from 'react'
import { Radio, Tab, Card } from 'semantic-ui-react'
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
        const { deduplicated, extractedColours, groupedPalette } = this.props
        return (<Tab.Pane>
            <Radio toggle label='Include grayscale colors' onChange={this.toggleGrayscale.bind(this)} />
            <h2>Colour Palette</h2>
            <p>A preview of all of the colours, arranged by a number of declarations in the stylesheet.</p>
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
            <h2>Extracted Colours</h2>
            <p>Using <a href="https://github.com/rsanchez/css-color-extractor">css-color-extractor</a> to extract color declarations from CSS source and <a href="https://github.com/substack/parse-color">parse-color</a> to translate declarations into alternative formats.</p>
            <Card.Group className={styles.palettecontainer} itemsPerRow={3}>
                {
                    deduplicated.map((colour) => {
                        const withDistanceInfo = groupedPalette.find(({ hex }) => hex === colour.hex)
                        const desaturatedColor = groupedPalette.filter(({ hex, hsl }) => hex !== colour.hex && hsl[1] == 0 && hsl[2] == colour.hsl[2])
                        return (
                            <Card key={colour.hex}>
                                <Card.Content>
                                    <div className={`ui mini right floated ${styles.palette}`} style={{ backgroundColor: colour.hex }}></div>
                                    <Card.Header><a name={colour.hex.replace('#', '')}></a>{colour.hex}</Card.Header>
                                    <Card.Meta>Declared {colour.useCount} time{colour.useCount > 1 ? 's' : ''} in CSS</Card.Meta>
                                    <br />
                                    <Card.Description>
                                        <table className="ui celled table">
                                            <thead>
                                                <tr>
                                                    <th colSpan="2">Existing color declarations</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    colour.raw.map(value => {
                                                        return (
                                                            <tr key={value}>
                                                                <td>
                                                                    <code>{value}</code>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        extractedColours.filter(({ raw }) => raw === value).map(({ raw, useCount }) => {
                                                                            return <span key={raw}>Used {useCount} time{useCount > 1 ? 's' : ''}</span>
                                                                        })
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        {!!desaturatedColor.length &&
                                            <table className="ui celled table">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2">Desaturated version</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        desaturatedColor.map((color) => {
                                                            return (
                                                                <tr key={color.hex}>
                                                                    <td>
                                                                        <div className={`ui mini left floated ${styles.palette}`} style={{ backgroundColor: color.hex }}></div>
                                                                    </td>
                                                                    <td>
                                                                        <span><a href={color.hex}>{color.hex}</a></span><br />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        }
                                        {!!withDistanceInfo.distance.filter(({ distance }) => distance < 10).length &&
                                            <table className="ui celled table">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2">Nearest Matching color(s)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        withDistanceInfo.distance
                                                            .filter(({ distance }) => distance < 10)
                                                            .map(({ hex, distance }) => {
                                                                return (
                                                                    <tr key={hex}>
                                                                        <td>
                                                                            <div className={`ui mini left floated ${styles.palette}`} style={{ backgroundColor: hex }}></div>
                                                                        </td>
                                                                        <td>
                                                                            <span><a href={hex}>{hex}</a></span><br />
                                                                            <span>{(100 - distance).toFixed(2)}% similarity</span><br />
                                                                            <span>Used {deduplicated.find((otherColour) => otherColour.hex === hex).useCount} time{deduplicated.find((otherColour) => otherColour.hex === hex).useCount > 1 ? 's' : ''}</span><br />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                    }
                                                </tbody>
                                            </table>
                                        }
                                        <table className="ui celled table">
                                            <thead>
                                                <tr>
                                                    <th colSpan="2">Parsed color values</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td><strong>hex</strong></td><td>{String(colour.hex)}</td></tr>
                                                <tr><td><strong>rgb</strong></td><td>{String(colour.rgb)}</td></tr>
                                                <tr><td><strong>rgba</strong></td><td>{String(colour.rgba)}</td></tr>
                                                <tr><td><strong>hsl</strong></td><td>{String(colour.hsl)}</td></tr>
                                                <tr><td><strong>hsla</strong></td><td>{String(colour.hsla)}</td></tr>
                                                <tr><td><strong>hsv</strong></td><td>{String(colour.hsv)}</td></tr>
                                                <tr><td><strong>hsva</strong></td><td>{String(colour.hsva)}</td></tr>
                                                <tr><td><strong>cmyk</strong></td><td>{String(colour.cmyk)}</td></tr>
                                                <tr><td><strong>cmyka</strong></td><td>{String(colour.cmyka)}</td></tr>
                                                <tr className={!colour.keyword ? 'disabled' : ''}><td><strong>keyword</strong></td><td className={!colour.keyword ? styles.disabled : ''}>{!!colour.keyword ? String(colour.keyword) : 'no match'}</td></tr>
                                            </tbody>
                                        </table>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        )
                    })
                }
            </Card.Group>
        </Tab.Pane>)
    }
}

export default connect(({ deduplicated, extractedColours, groupedPalette }) => {
    return {
        deduplicated,
        extractedColours,
        groupedPalette
    }
})(PalettePane)