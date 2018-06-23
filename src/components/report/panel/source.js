import React from 'react'
import { Tab } from 'semantic-ui-react'
import AceEditor, { diff as DiffEditor } from 'react-ace'
import { connect } from "react-redux"
import Measure from 'react-measure'
import cssbeautify from 'cssbeautify'

import 'brace/mode/css'
import 'brace/theme/monokai'

class SourcePane extends React.Component {
    state = {
        dimensions: {
            width: -1,
            height: -1
        }
    }

    render() {
        const { width, height } = this.state.dimensions
        const { exampleData } = this.props;

        var formattedCSS = cssbeautify(exampleData, {
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        });

        return <Tab.Pane>
            <h2 id="source-data">Source data</h2>
            {/* <DiffEditor
        mode="css"
        theme="monokai"
        width="900px"
        splits={2}
        value={[String(props.exampleData), String(props.newData)]}
    /> */}
            <Measure
                bounds
                onResize={(contentRect) => {
                    this.setState({ dimensions: contentRect.bounds })
                }}
            >
                {({ measureRef }) =>
                    <div ref={measureRef}>
                        <AceEditor
                            mode="css"
                            theme="monokai"
                            value={formattedCSS}
                            width={`${width}px`}
                            wrapEnabled={true}
                        />
                    </div>
                }
            </Measure>
        </Tab.Pane>
    }
}

export default connect(({ exampleData }) => {
    return {
        exampleData
    }
})(SourcePane)