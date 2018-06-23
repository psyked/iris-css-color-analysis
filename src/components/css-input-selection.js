import React from 'react'
import { Segment, Tab, Input, Label } from 'semantic-ui-react'
import axios from 'axios'
import queryString from 'query-string-es5'
import { connect } from "react-redux"
import { navigateTo } from 'gatsby-link'

class CSSInput extends React.Component {

    constructor(props) {
        super(props)

        // console.log(props)

        const { location: { search = '' } = {} } = this.props || {}
        const { source } = queryString.parse(search)

        this.state = {
            // ...parseData(''),
            loading: false,
            errorMessage: '',
            sourceurl: source// || `https://psyked.github.io/assets/built/screen.css`
        }
    }

    componentDidMount() {
        if (this.state.sourceurl) {
            this.handleChange.call(this, { target: { value: this.state.sourceurl } })
        }
    }

    handleChange(event) {

        const newPath = event.target.value;

        this.setState({
            sourceurl: newPath,
            loading: true
        })

        axios.get(`https://cors-anywhere.herokuapp.com/${newPath}`)
            .then(res => {
                this.setState({
                    // ...parseData(res.data),
                    errorMessage: undefined,
                    loading: false
                });
                // console.log(res.data)
                this.props.parseData(res.data)

                if (newPath !== this.props.location.search) {
                    navigateTo(`?source=${newPath}`)
                }
            }).catch(err => {
                this.setState({
                    // ...parseData(''),
                    errorMessage: err.message,
                    loading: false
                });
                console.log('resetting', err)
                this.props.parseData('')
            })
    }

    render() {
        return <Segment padded>
            <Label attached='top' size="large">Source CSS</Label>
            {/* <Label pointing='below' color='blue'>Start here. Enter a CSS URL and it should automatically load.</Label> */}
            <Input
                fluid
                size="large"
                placeholder='Enter CSS URL...'
                action={{ content: 'Load CSS' }}
                error={!!this.state.errorMessage}
                loading={this.state.loading}
                value={this.state.sourceurl}
                onChange={this.handleChange.bind(this)} />
            {!!this.state.errorMessage && <Label basic color='red' pointing>
                {this.state.errorMessage}
            </Label>}
        </Segment>
    }
}

export default connect(() => { return {} }, (dispatch, props) => {
    return {
        parseData: (payload) => dispatch({
            type: 'PARSE',
            payload
        })
    }
})(CSSInput)