import React from 'react'
import { Card, Segment, Tab, Input, Label } from 'semantic-ui-react'

export default (props) => <Tab.Pane><h1>Summary</h1>
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
                            <td>{props.extractedColours.length}</td>
                        </tr>
                        <tr>
                            <td>Unique Colors:</td>
                            <td>{props.deduplicated.length}</td>
                        </tr>
                        <tr>
                            <td>CSS Spec Keyword Colors:</td>
                            <td>{props.deduplicated.filter(({ keyword }) => !!keyword).length}</td>
                        </tr>
                    </tbody>
                </table>
            </Card.Description>
        </Card.Content>
    </Card>
</Tab.Pane>