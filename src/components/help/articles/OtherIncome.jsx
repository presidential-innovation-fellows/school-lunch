import React, { Component, PropTypes } from 'react'
import Article from '../Article'
import Topic from '../Topic'
import { help, define } from './HelpText'
import NotTheSame from '../topics/NotTheSame'
import RegularCash from '../topics/RegularCash'
import WhatIncome from '../topics/WhatIncome'

//F37-38, F36, F39, F28, F26, F27, F24, D20-23, D5

export default class OtherIncome extends Component {
  render() {
    return (
      <Article>
	<Topic title={help.rentalTitle} body={help.rentalBody} />
        <Topic title={help.interestTitle} body={help.interestBody} />
        <Topic title={help.govProgramTitle} body={help.govProgramBody} />
        <Topic title={help.seasonalTitle} body={help.seasonalBody} />
        <NotTheSame />
        <Topic title={help.grossTitle} body={help.grossBody} />
	<Topic title={help.netTitle} body={help.netBody} />
        <WhatIncome />
        <bodyLabels>Definitions</bodyLabels>
        <RegularCash />
        <Topic title={define.pensionTerm} body={define.pensionDef} />
        <Topic title={define.annuityTerm} body={define.annuityDef} />
        <Topic title={define.trustTerm} body={define.trustDef} />
        <Topic title={define.currentTerm} body={define.currentDef} />
      </Article>
    )
  }
}
