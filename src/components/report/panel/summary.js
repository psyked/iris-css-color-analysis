import React from 'react'
import { Card, Segment, Tab, Input, Label } from 'semantic-ui-react'
import { connect } from "react-redux"

export default connect(({ extractedColours, deduplicated }) => {
    return {
        extractedColours,
        deduplicated
    }
})(({ extractedColours = [], deduplicated = [] }) => <Tab.Pane>
    <h1>Summary</h1>
    <Card fluid>
        <Card.Content>
            <Card.Header>Extracted data</Card.Header>
        </Card.Content>
        <Card.Content extra>
            <Card.Description>
                <table>
                    <tbody>
                        <tr>
                            <td>Total Color Declarations:</td>
                            <td>{extractedColours.length}</td>
                        </tr>
                        <tr>
                            <td>Unique Colors:</td>
                            <td>{deduplicated.length}</td>
                        </tr>
                        <tr>
                            <td>CSS Spec Keyword Colors:</td>
                            <td>{deduplicated.filter(({ keyword }) => !!keyword).length}</td>
                        </tr>
                        <tr>
                            <td>Shades of Grey:</td>
                            <td>{deduplicated.filter(({ hsl }) => !hsl[1]).length}</td>
                        </tr>
                    </tbody>
                </table>
            </Card.Description>
        </Card.Content>
    </Card>
</Tab.Pane>)