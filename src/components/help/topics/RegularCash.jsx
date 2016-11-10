import React, { Component, PropTypes } from 'react'
import Topic from '../Topic'

//D20
export default class RegularCash extends Component {
  render() {
    return (
      <Topic title="Regular cash payments from outside the household">
        <p>
          Regular cash payments from outside the household is money regularly received from extended family or friends that do not live with you.  For example, if parents or grandparents regularly help cover the cost of groceries, bills, or rent, that money is considered household income and should be reported in your application for school meal benefits.
        </p>
        <p>
          One-time payments should not be reported as current, monthly income since they are not received on a regular basis. However, if you receive a one-time payment, such as from an award, settlement, inheritance or prize winnings, and then regularly draw on that money for living expenses later on, the amount withdrawn should be reported in your application for school meal benefits in the space for ‘Any other income available to pay for children’s school meals’.
        </p>
      </Topic>
    )
  }
}