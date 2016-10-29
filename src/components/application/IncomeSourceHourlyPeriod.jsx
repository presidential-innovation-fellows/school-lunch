import React, { Component, PropTypes } from 'react'
import { observer } from 'mobx-react'
import Select from './Select'

@observer
class IncomeSourceHourlyPeriod extends Component {
  constructor (props) {
    super(props)
    this.defaultOnChange = this.defaultOnChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const handler = this.props.onChange || this.defaultOnChange
    handler(this.props.fieldName, event.target.value)
  }

  // side effect, but easier to handle once here than pass in every time
  defaultOnChange(fieldName, value) {
    this.props.incomeSource[fieldName] = value
  }

  render() {
    const { incomeSource, fieldName } = this.props
    const hours = incomeSource.hourlyHours
    const value = incomeSource[fieldName]

    return (
      <div className="usa-input-grid usa-input-grid-medium">
        <Select value={incomeSource[fieldName]}
                onChange={this.handleChange}>
          <option value="" disabled>hours per…</option>
          <option value="week">hours per week</option>
          <option value="month">hours per month</option>
        </Select>
      </div>
    )
  }
}

IncomeSourceHourlyPeriod.propTypes = {
  incomeSource: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  onChange: PropTypes.func
}

IncomeSourceHourlyPeriod.defaultProps = {
  fieldName: 'hourlyPeriod'
}

export default IncomeSourceHourlyPeriod
