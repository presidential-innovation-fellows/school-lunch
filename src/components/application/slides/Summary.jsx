﻿import React, { Component, PropTypes, responsive, bordered } from 'react'
import Slide from '../Slide'
import Link from '../Link'
import SummaryLabel from './SummaryLabel'
import SummaryLabelSmall from './SummaryLabelSmall'
import Checkbox from '../Checkbox'
import Checkboxes from '../Checkboxes'
import { observer } from 'mobx-react'
import { Glyphicon, OverlayTrigger, Table, Tooltip, Well } from 'react-bootstrap'
import { humanize, numberFormat } from 'underscore.string'
import { organization } from '../../../config'
import { allStudentsAreFHMR, fullName, informalName } from '../../../helpers'
import { tooltiptext } from '../../Tooltiptext'

@observer
class Summary extends Component {
  get isValid() {
    return this.props.applicationData.certifiedCorrect
  }

  get allOtherChildren() {
    return this.props.applicationData.otherChildren
  }

  get totalHouseholdMembers() {
    return this.props.applicationData.allPeopleCollections
               .map(collection => collection.length)
               .reduce((a, b) => a + b, 0)
  }

  get allIncomes() {
    return this.props.applicationData.allPeopleCollections
      .map(collection => collection.allApplicableIncomeSources)
      .reduce((a, b) => a.concat(b), [])
  }

  get totalAnnualHouseholdIncome() {
    function toAnnual(income) {
      let amount = parseFloat(income.amount, 10)

      switch (income.frequency) {
        case 'yearly':
        case 'annually':
          return amount * 1.0
        case 'monthly':
          return amount * 12.0
        case 'twicePerMonth':
          return amount * 24.0
        case 'everyTwoWeeks':
          return amount * 26.0
        case 'weekly':
          return amount * 52.0
        case 'hourly':
          let hours = parseFloat(income.hourlyHours, 10)

          switch (income.hourlyPeriod) {
            case 'day':
              return amount * hours * 365.0
            case 'week':
              return amount * hours * 52.0
            case 'month':
              return amount * hours * 12.0
            default:
              return 0.0
          }
        default:
          return 0.0
      }
    }

    return this.allIncomes
               .map(income => toAnnual(income))
               .reduce((a, b) => a + b, 0)
  }

  get totalMonthlyHouseholdIncome() {
    return this.totalAnnualHouseholdIncome / 12.0
  }

  fhmr(student) {
    return ([
      student.isFoster && 'foster',
      student.isHomeless && 'homeless',
      student.isMigrant && 'migrant',
      student.isRunaway && 'runaway'
    ].filter(x => x))
  }

  render() {
    const { applicationData } = this.props
    const { adults,
            contact,
            students,
            assistancePrograms } = applicationData
    const attestor = adults.first
    const showHousehold =
      !assistancePrograms.hasAny ||
      !allStudentsAreFHMR(students)

    return (
      <Slide header="Summary" nextText="Submit" nextDisabled={!this.isValid}
             id="summary">
        <p className="usa-font-lead">Awesome, you finished!</p>
        <p>Here is a summary of the information you provided in the application. We encourage you to save or print this screen for your records. If everything looks good, click the "Submit" button at the bottom of the page.</p>

        {!showHousehold &&
         <div>
           <SummaryLabel id="students">
             Students attending {organization.name}
           </SummaryLabel>
           <ul>
             {students.map(person =>
               <li key={person.id}>
                 {informalName(person)}
                 { !!this.fhmr(person).length &&
                   ` (${this.fhmr(person).join(', ')})`
                 }
               </li>
              )}
           </ul>
         </div>
        }

         {assistancePrograms.hasAny &&
         <div>
             <SummaryLabel id="assistance-programs">
               Assistance Program{assistancePrograms.applicable.length !== 1 && 's'}
             </SummaryLabel>
            <ul>
              {assistancePrograms.applicable.map(program =>
                <li key={program.id}>
                  {program.name}
                  —case number: <strong>{program.caseNumber}</strong>
                </li>
               )}
            </ul>
          </div>
        }

        {showHousehold &&
         <div>
           <SummaryLabel>Household</SummaryLabel>
           <Well>
             <SummaryLabelSmall id="students" small={true}>
               Students attending {organization.name}
             </SummaryLabelSmall>
             <ul>
               {students.map(person =>
                 <li key={person.id}>
                   {informalName(person)}
                   { !!this.fhmr(person).length &&
                     ` (${this.fhmr(person).join(', ')})`
                   }
                 </li>
                )}
             </ul>

             <SummaryLabelSmall id="other-children">
               Other Children
             </SummaryLabelSmall>
             <ul>
               {this.allOtherChildren.map(person =>
                 <li key={person.id}>{informalName(person)}</li>
                )}
                 {!this.allOtherChildren.length && <li><em>none</em></li>}
             </ul>

             <SummaryLabelSmall id="adults">Adults</SummaryLabelSmall>
             <ul>
               {adults.map(person =>
                 <li key={person.id}>{informalName(person)}</li>
                )}
                 {!adults.length && <li><em>none</em></li>}
             </ul>

             <div>
               <SummaryLabelSmall>
                 Total household members: {this.totalHouseholdMembers}
               </SummaryLabelSmall>
             </div>
           </Well>

           <SummaryLabel>Income</SummaryLabel>
           <Table responsive bordered>
             <thead>
               <tr>
                 <th>Name</th>
                 <th>Income Type</th>
                 <th>Amount</th>
                 <th>Frequency</th>
               </tr>
             </thead>
             <tbody>
               {this.allIncomes.map(income =>
                 <tr key={income.person.id + income.type + income.source + income.num}>
                   <td>{informalName(income.person)}</td>
                   <td>
                     {humanize(income.type)} income
                     {' '}
                     (<Link id={`income/${income.person.id}/${income.type}`}>edit</Link>)
                   </td>
                   <td>${numberFormat(parseFloat(income.amount, 10), 2)}</td>
                   <td>
                     {humanize(income.frequency)}
                     {income.frequency === 'hourly' &&
                      ` (${income.hourlyHours} hrs./${income.hourlyPeriod})`}
                   </td>
                 </tr>
                )}
               </tbody>
               <tfoot>
                 <tr>
                   <td colSpan="2">
                     <strong>Total household income:</strong>
                   </td>
                   <td>
                     <OverlayTrigger placement="top" overlay={
                       <Tooltip id="total-income">
                         {tooltiptext.monthlyIncomeSum}
                       </Tooltip>
                     }>
                       <strong className="info-target">
                         ${numberFormat(this.totalMonthlyHouseholdIncome, 2)}
                         <Glyphicon glyph="question-sign" />
                       </strong>
                     </OverlayTrigger>
                   </td>
                   <td><strong>Monthly</strong></td>
                 </tr>
             </tfoot>
           </Table>
         </div>
        }

        <SummaryLabel id="contact">Contact Information</SummaryLabel>
        <Well>
          { fullName(attestor) }
          {!!contact.address1 &&
           <span>
             <br />
             { contact.address1 }
           </span>
          }
          {!!contact.address2 &&
           <span>
             <br />
             { contact.address2 }
           </span>
          }
          {!!contact.city &&
           <span>
             <br />
             { contact.city },{' '}
           </span>
          }
          { contact.state }
          {' '}
          { contact.zip }
          {!!contact.phone &&
           <span>
             <br />
             { contact.phone }
           </span>
          }
          {!!contact.email &&
           <span>
             <br />
             { contact.email }
           </span>
          }
        </Well>

        <Checkboxes legend="Certification">
          <Checkbox name="certifiedCorrect" object={applicationData}>
            <strong>I certify* that <span className="usa-label-big">{this.totalHouseholdMembers}</span> people are in my household and that our household income is about <span className="usa-label-big">${numberFormat(this.totalMonthlyHouseholdIncome)}</span> per month.</strong>
          </Checkbox>
        </Checkboxes>
        <p><small><em>*I understand that this information is given in connection with the receipt of Federal funds, and that school o­fficials may verify (check) the information. I am aware that if I purposely give false information, my children may lose meal benefits. Deliberate misrepresentation of information may subject applicants to prosecution under applicable State and Federal law.</em></small></p>
      </Slide>
    )
  }
}

Summary.propTypes = {
  applicationData: PropTypes.object.isRequired
}

export default Summary
