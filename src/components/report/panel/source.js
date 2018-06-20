import React from 'react'
import { Tab } from 'semantic-ui-react'
import { diff as DiffEditor } from 'react-ace'

import 'brace/mode/css'
import 'brace/theme/monokai'

export default (props) => <Tab.Pane>
    <h2 id="source-data">Source data</h2>
    <DiffEditor
        mode="css"
        theme="monokai"
        width="900px"
        splits={2}
        value={[String(props.exampleData), String(props.newData)]}
    />
</Tab.Pane>