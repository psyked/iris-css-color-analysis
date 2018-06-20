import React from 'react'
import Link from 'gatsby-link'
import { Container, Grid, Header } from 'semantic-ui-react'

const SiteHeader = ({ siteTitle }) => (
  <Container fluid
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <Container
      style={{
        // margin: '0 auto',
        // maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <Header as="h1">
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
    </Container>
  </Container>
)

export default SiteHeader
