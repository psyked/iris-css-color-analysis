import React from 'react'
import { Card, Tab } from 'semantic-ui-react'

import styles from './extracted.module.css'

export default (props) => <Tab.Pane>
    <h2>Extracted Colours</h2>
    <p>Using <a href="https://github.com/rsanchez/css-color-extractor">css-color-extractor</a> to extract color declarations from CSS source and <a href="https://github.com/substack/parse-color">parse-color</a> to translate declarations into alternative formats.</p>
    <Card.Group className={styles.palettecontainer} itemsPerRow={3}>
        {
            props.deduplicated.map((colour) => {
                const withDistanceInfo = props.groupedPalette.find(({ hex }) => hex === colour.hex)
                return (
                    <Card key={colour.hex}>
                        <Card.Content>
                            <div className={`ui mini right floated ${styles.palette}`} style={{ backgroundColor: colour.hex }}></div>
                            <Card.Header><a name={colour.hex.replace('#', '')}></a>{colour.hex}</Card.Header>
                            <Card.Meta>Declared {colour.useCount} time{colour.useCount > 1 ? 's' : ''} in CSS</Card.Meta>
                        </Card.Content>
                        <Card.Content extra>
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
                                                                props.expanded.filter(({ raw }) => raw === value).map(({ raw, useCount }) => {
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
                                <table className="ui celled table">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Nearest Matching color</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className={`ui mini left floated ${styles.palette}`} style={{ backgroundColor: withDistanceInfo.distance[0].hex }}></div>
                                            </td>
                                            <td>
                                                <span><a href={withDistanceInfo.distance[0].hex}>{withDistanceInfo.distance[0].hex}</a></span><br />
                                                <span>{(100 - withDistanceInfo.distance[0].distance).toFixed(2)}% similarity</span><br />
                                                <span>Used {props.deduplicated.find((otherColour) => otherColour.hex === withDistanceInfo.distance[0].hex).useCount} time{props.deduplicated.find((otherColour) => otherColour.hex === withDistanceInfo.distance[0].hex).useCount > 1 ? 's' : ''}</span><br />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
</Tab.Pane>
