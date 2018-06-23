// JS
import React from 'react'
import { connect } from "react-redux"
import { Segment, Tab, Input, Label } from 'semantic-ui-react'

import CSSInput from '../components/css-input-selection'
import Summary from '../components/report/panel/summary'
import Palette from '../components/report/panel/palette'
import Similar from '../components/report/panel/similar'
import Extracted from '../components/report/panel/extracted'
import Source from '../components/report/panel/source'

// CSS
import "semantic-ui-css/semantic.css";
import './styles.css'

const IndexPage = ({ exampleData, location }) => {
  const panes = [
    {
      menuItem: 'Summary', render: () => <Summary />
    },
    {
      menuItem: 'Colour Palette', render: () => <Palette />
    },
    {
      menuItem: 'Similar colours', render: () => <Similar />
    },
    {
      menuItem: 'Extracted Colours', render: () => <Extracted />
    },
    {
      menuItem: 'Source data', render: () => <Source />
    },
  ]

  return (
    <div>
      <CSSInput location={location} />
      {/* {exampleData && */}
      <Tab panes={panes} />
      {/* } */}
    </div>
  )
}

export default connect(({ exampleData }) => {
  return {
    exampleData
  }
})(IndexPage)