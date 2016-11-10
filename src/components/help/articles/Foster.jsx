import React, { Component, PropTypes } from 'react'
import Article from '../Article'
import Topic from '../Topic'
import { help } from './HelpText'
import Household from '../topics/Household'

export default class Foster extends Component {
  render() {
    return (
      <Article>
        <Topic title={help.permanentTitle} body={help.permanentBody} />
        <Topic title={help.fosterQualifyTitle} body={help.fosterQualifyBody} />
        <Topic title={help.fosterTitle} body={help.fosterBody} />
        <Household />
        <Topic title={help.sharedCustodyTitle} body={help.sharedCustodyBody} />
        <Topic title={help.childAppTitle} body={help.childAppBody} />
      </Article>
    )
  }
}
