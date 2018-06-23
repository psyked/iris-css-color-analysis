// JS
import React from 'react'
import { connect } from "react-redux"
import { Segment, Tab, Input, Label, Menu } from 'semantic-ui-react'

import CSSInput from '../components/css-input-selection'
import Summary from '../components/report/panel/summary'
import Palette from '../components/report/panel/palette'
import Similar from '../components/report/panel/similar'
import Source from '../components/report/panel/source'

// CSS
import "semantic-ui-css/semantic.css";
import './styles.css'

const IndexPage = ({ exampleData, location, deduplicated }) => {
  const panes = [
    {
      menuItem: 'Summary',
      render: () => <Summary />
    },
    {
      menuItem: (
        <Menu.Item key='color-palette'>
          Color Palette
          {deduplicated.length && <Label>{deduplicated.length}</Label>}
        </Menu.Item>
      ),
      render: () => <Palette />
    },
    {
      menuItem: 'Similar colours',
      render: () => <Similar />
    },
    {
      menuItem: 'Source data',
      render: () => <Source />
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

export default connect(({ exampleData, deduplicated = [] }) => {
  return {
    exampleData,
    deduplicated
  }
})(IndexPage)