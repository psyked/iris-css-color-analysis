import React from 'react'
import Link from 'gatsby-link'
import { Container, Grid, Header } from 'semantic-ui-react'

const Footer = ({ siteTitle }) => (
  <Container fluid
    style={{
      background: '#16161d', // eigengrau
      color: '#ffffff', // white
      marginTop: '1.45rem',
      borderTop: '.3rem solid #757596'
    }}
  >
    <Container
      style={{
        padding: '1.45rem 1.0875rem',
      }}
    >
      <Grid container columns={3}>
        <Grid.Column style={{ color: '#d9d9e2' }}>
          <Header>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              {siteTitle}
            </Link>
          </Header>
          <p>A tool for evaluating color declarations in a cascading stylesheet, with a focus on identifying potential errors and inconsistencies.</p>
          <p>Built by <a href="https://twitter.com/psyked" rel="noopener">@psyked</a></p>
          <p>Powered by&nbsp;<a href="https://www.gatsbyjs.org/" rel="noopener">Gatsby,</a>&nbsp;
            <a href="https://reactjs.org/" rel="noopener">React,</a>&nbsp;
            <a href="https://react.semantic-ui.com/" rel="noopener">Semantic UI,</a>&nbsp;
            <a href="https://securingsincity.github.io/react-ace/" rel="noopener">Ace,</a>&nbsp;
            <a href="https://cors-anywhere.herokuapp.com/" rel="noopener">CORS Anywhere,</a>&nbsp;
            <a href="https://github.com/rsanchez/css-color-extractor/" rel="noopener">CSS Color Extractor,</a>&nbsp;
            <a href="https://github.com/substack/parse-color/" rel="noopener">Parse Color,</a>&nbsp;
            <a href="http://zschuessler.github.io/DeltaE/" rel="noopener">Delta-E</a>&nbsp;and hosted on GitHub Pages.
          </p>
        </Grid.Column>
        <Grid.Column>
        </Grid.Column>
        <Grid.Column>
        </Grid.Column>
      </Grid>
    </Container>
  </Container >
)

export default Footer
