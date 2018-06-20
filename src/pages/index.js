// JS
import React from 'react'
import { Card, Segment, Tab, Input, Label } from 'semantic-ui-react'
import { navigateTo } from "gatsby-link"
import extractor from 'css-color-extractor'
import parse from 'parse-color'
import DeltaE from 'delta-e'
import axios from 'axios'
import queryString from 'query-string-es5'
import rgb2lab from '../libs/rgb2lab'
import removeDuplicates from '../libs/removeDuplicatesFromArrayByKey'

import Palette from '../components/report/panel/palette'
import Similar from '../components/report/panel/similar'
import Extracted from '../components/report/panel/extracted'
import Source from '../components/report/panel/source'

// CSS
import "semantic-ui-css/semantic.css";
import './styles.css'

const parseData = (exampleData) => {
  // extract color declarations from a full stylesheet
  const extractedColours = extractor.fromCss(exampleData);

  // expand the input colours into their other-format equivalents
  const expanded = extractedColours
    // replace with the full details
    .map(declaration => {
      const r = new RegExp(declaration.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '[\s|;|!|\)]', 'g')
      const matches = exampleData.match(r);
      // console.log('regex?', r)
      // console.log('exampleData', exampleData.match(r).length)
      return {
        ...parse(declaration), // use all of the values from 'parse-color'
        lab: rgb2lab(parse(declaration).rgb), // lab values are needed for Delta-E analysis
        raw: declaration, // so we know how it's been referenced in the source code,
        useCount: matches ? matches.length : 0
      }
    })
    // remove any invalid values that couldn't be parsed into hex values
    .filter(({ hex }) => !!hex)

  const expandedRefs = expanded.map(colorInfo => {
    // console.log(expanded.filter(({ hex }) => hex === colorInfo.hex))
    return {
      ...colorInfo,
      useCount: expanded.filter(({ hex }) => hex === colorInfo.hex).map(({ useCount }) => useCount).reduce((prev, curr) => prev + curr),
      raw: expanded.filter(({ hex }) => hex === colorInfo.hex).map(({ raw }) => raw)
    }
  }).sort((a, b) => {
    return b.useCount - a.useCount
  })

  let newData = exampleData;

  expandedRefs.map(colours => {
    newData = newData.replace(colours.raw, `rgba(${colours.rgba})`)
  })

  // const expandedWithUseCount

  const deduplicated = removeDuplicates(expandedRefs, 'hex');
  // const deduplicated = expanded.filter((obj, pos, arr) => {
  //   const rtn = arr.map(mapObj => mapObj.hex).indexOf(obj.hex) === pos;
  //   if (rtn) {
  //     obj.raw = obj.raw.concat(arr[pos].raw)
  //     console.log(obj.raw)
  //   }
  //   return rtn;
  // });

  const groupedPalette = deduplicated.map((color) => {
    return {
      ...color,
      distance: deduplicated.filter(curr => color !== curr).map((curr) => {
        const color1 = { L: color.lab[0], A: color.lab[1], B: color.lab[2] }
        const color2 = { L: curr.lab[0], A: curr.lab[1], B: curr.lab[2] }
        return {
          hex: curr.hex,
          distance: DeltaE.getDeltaE00(color1, color2)
        };
      }).sort((a, b) => {
        return a.distance - b.distance
      })
    }
  })

  const groups = groupedPalette.map(({ hex, distance }) => {
    return [
      ...distance.filter(({ distance }) => {
        return distance < 1
      }).map(({ hex: dhex }) => {
        return deduplicated.find(({ hex }) => dhex === hex)
      })
    ]
      .concat(deduplicated.find(({ hex: fhex }) => fhex === hex))
      .sort(({ hex: a }, { hex: b }) => {
        return parseInt(a.replace('#', ''), 16) - parseInt(b.replace('#', ''), 16);
      })
  }).filter(ar => ar.length > 1)

  const deduplicatedgroups = removeDuplicates(groups.map((group) => {
    return {
      id: group.map(({ hex }) => hex).join('-'),
      value: group
    }
  }), 'id').sort(({ value: a }, { value: b }) => {
    const ahue = a[0]['hsv'][0]
    const bhue = b[0]['hsv'][0]
    if (ahue !== bhue) {
      return bhue - ahue;
    }
    return b.length - a.length
  })

  return {
    exampleData,
    newData,
    expanded,
    extractedColours,
    deduplicated,
    groupedPalette,
    groups,
    deduplicatedgroups
  }
}

class IndexPage extends React.Component {

  constructor(props) {
    super(props)

    const { location: { search = '' } = {} } = this.props || {}
    const { source } = queryString.parse(search)

    this.state = {
      ...parseData(''),
      sourceurl: source// || `https://psyked.github.io/assets/built/screen.css`
    }
  }

  componentDidMount() {
    if (this.state.sourceurl) {
      this.handleChange.call(this, { target: { value: this.state.sourceurl } })
    }
  }

  handleChange(event) {

    // window.location.search = `?source=${event.target.value}`

    const newPath = event.target.value;

    this.setState({
      sourceurl: newPath,
      loading: true
    })

    axios.get(`https://cors-anywhere.herokuapp.com/${newPath}`)
      .then(res => {
        this.setState({
          ...parseData(res.data),
          errorMessage: undefined,
          loading: false
        });

        if (newPath !== this.props.location.search) {
          navigateTo(`?source=${newPath}`)
        }
      }).catch(err => {
        this.setState({
          ...parseData(''),
          errorMessage: err.message,
          loading: false
        });
      })
  }

  render() {

    const panes = [
      {
        menuItem: 'Colour Palette', render: () => <Palette groupedPalette={this.state.groupedPalette}></Palette>
      },
      {
        menuItem: 'Similar colours', render: () => <Similar deduplicatedgroups={this.state.deduplicatedgroups}></Similar>
      },
      {
        menuItem: 'Extracted Colours', render: () => <Extracted expanded={this.state.expanded} deduplicated={this.state.deduplicated} groupedPalette={this.state.groupedPalette}></Extracted>
      },
      {
        menuItem: 'Source data', render: () => <Source exampleData={this.state.exampleData} newData={this.state.newData}></Source>
      },
    ]

    return <div>
      <Segment padded>
        <Label attached='top' size="large">Start with a stylesheet URL</Label>
        <Input
          fluid
          size="large"
          placeholder='Enter CSS URL...'
          error={!!this.state.errorMessage}
          loading={this.state.loading}
          value={this.state.sourceurl}
          onChange={this.handleChange.bind(this)} />
        {!!this.state.errorMessage && <Label basic color='red' pointing>
          {this.state.errorMessage}
        </Label>}
      </Segment>
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
                  <td>{this.state.extractedColours.length}</td>
                </tr>
                <tr>
                  <td>Unique Colors:</td>
                  <td>{this.state.deduplicated.length}</td>
                </tr>
                <tr>
                  <td>CSS Spec Keyword Colors:</td>
                  <td>{this.state.deduplicated.filter(({ keyword }) => !!keyword).length}</td>
                </tr>
              </tbody>
            </table>
          </Card.Description>
        </Card.Content>
      </Card>
      <Tab panes={panes} />
    </div >
  }
}

export default IndexPage