import React from 'react'
import { Tab } from 'semantic-ui-react'
import AceEditor, { diff as DiffEditor } from 'react-ace'
import { connect } from "react-redux"

import 'brace/mode/css'
import 'brace/theme/monokai'

export default connect(({ exampleData }) => { return { exampleData } })(({ exampleData }) => <Tab.Pane>
    <h2 id="source-data">Source data</h2>
    {/* <DiffEditor
        mode="css"
        theme="monokai"
        width="900px"
        splits={2}
        value={[String(props.exampleData), String(props.newData)]}
    /> */}
    <AceEditor
        mode="css"
        theme="monokai"
        value={exampleData}
    />
</Tab.Pane>)