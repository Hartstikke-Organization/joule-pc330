function main() {
  const VAT_RATE = 1.21

  function initializeLinkedInputs() {
    const inputRanges = document.querySelectorAll('.linked-input, .linked-range')
    inputRanges.forEach((element) => {
      element.addEventListener('input', updateLinkedValue)
      // Initialize the style on load
      updateLinkedValue.call(element)
    })
  }

  function checkLength(elem, max) {
    // checking if iput value is more than 5
    if (elem.value > max) {
      console.log(`Max value is ${max}`)
      elem.value = max - 1 // emptying the input box
    }
  }

  function updateLinkedValue() {
    const linkedId = this.getAttribute('data-linked-input') || this.getAttribute('data-linked-range')
    const linkedElement = document.getElementById(linkedId)
    if (linkedElement) {
      if (this.classList.contains('linked-range')) {
        // Apply the style directly to the range
        const rangeValue = ((this.value - this.min) / (this.max - this.min)) * 100
        this.style.background = `linear-gradient(to right, #A0E8E3 0%, #A0E8E3 ${rangeValue}%, #F3F3F3 ${rangeValue}%, #F3F3F3 100%)`
      }
    }
  }

  const getBikeLease = () => {
    // Get the full URL
    const url = window.location.href

    // Create a URLSearchParams object
    const params = new URLSearchParams(new URL(url).search)

    if (params.has('price')) {
      const price = params.get('price')
      document.querySelector('#bikeLease').value = price
      console.log(`Price parameter exists: ${price}`)
    }
    if (params.has('grossYearEndPremium')) {
      const endPrem = params.get('grossYearEndPremium')
      document.querySelector('#grossYearEndPremium').value = endPrem
      console.log(`Year End Premium parameter exists: ${endPrem}`)
    }
  }

  getBikeLease()

  initializeLinkedInputs()

  const checkComputeModel = () => {
    const computeModelWhites = document.querySelectorAll('input[name="computeModel"][data-bediende]')
    const computeModelBlues = document.querySelectorAll('input[name="computeModel"][data-arbeider]')
    if (document.querySelector('input[name="employmentStatus"]:checked').value == 'white-collar') {
      computeModelWhites.forEach((el) => el.parentElement.classList.remove('hide'))
      computeModelBlues.forEach((el) => el.parentElement.classList.add('hide'))
      console.log('bediende')
    } else {
      computeModelWhites.forEach((el) => el.parentElement.classList.add('hide'))
      computeModelBlues.forEach((el) => el.parentElement.classList.remove('hide'))
      console.log('arbeiders')
    }
  }
  checkComputeModel()

  document.addEventListener('input', function (e) {
    const target = e.target
    const linkedAttributeName = target.dataset.linkedInput || target.dataset.linkedRange

    // ✅ Fixing the incorrect condition: Check if target is an input and has 'max' attribute
    if (target.tagName === 'INPUT' && target.hasAttribute('max')) {
      checkLength(target, parseInt(target.getAttribute('max'), 10))
    }

    if (document.querySelector('input[name="civilStatus"]:checked')) {
      if (document.querySelector('input[name="civilStatus"]:checked').value === 'MARRIED' || document.querySelector('input[name="civilStatus"]:checked').value === 'COHABITING') {
        document.querySelector('#workingSpouseParent').classList.remove('hide')
      } else {
        document.querySelector('#workingSpouseParent').classList.add('hide')
      }
    }
    checkComputeModel()

    if (linkedAttributeName) {
      const linkedElements = document.querySelectorAll(`[data-linked-input="${linkedAttributeName}"], [data-linked-range="${linkedAttributeName}"]`)

      linkedElements.forEach((linkedElement) => {
        linkedElement.value = target.value
        updateLinkedValue.call(linkedElement)
      })
    }

    console.log(target.name)
    if (target.name === 'endYearBoolean' && target.checked) {
      // document.querySelector('#endYearInputParent').classList.remove('hide')
    }
  })

  // VARIABLES
  const submitCalculator = document.getElementById('form-button')
  const submitForm = async (e) => {
    e.preventDefault()
    // VALUES

    let flexBudget = parseFloat(document.querySelector('#grossYearEndPremium').value)
    let grossYearlySalary = parseFloat(document.querySelector('#grossSalary').value)
    let flexPeriod = parseInt(document.querySelector('input[name="flexPeriod"]:checked').value)
    let civilStatus = document.querySelector('input[name="civilStatus"]:checked').value
    let computeModel = document.querySelector('input[name="computeModel"]:checked').value
    let workingSpouse = false
    document.querySelector('input[name="workingSpouse"]:checked').value == 'true' ? (workingSpouse = true) : (workingSpouse = false)
    let bikeLease = parseInt(document.querySelector('#bikeLease').value)
    let dependentChildren = parseInt(document.querySelector('#dependentChildren').value)
    let monthlyLeasePrice = parseInt(document.querySelector('#bikeLease').value)

    const data = {
      grossSalary: grossYearlySalary,
      grossYearEndPremium: flexBudget,
      workingSpouse: workingSpouse,
      dependentChildren: dependentChildren,
      monthlyLeasePrice: monthlyLeasePrice / VAT_RATE,
      workingRegimePercent: 1,
      civilStatus: civilStatus,
      computeModel: computeModel,
      computeLeaseRateDto: {
        bikeRetailPrice: bikeLease / VAT_RATE,
        discountRate: 0,
        interestRate: 0.077,
        insurancePremium: 0.035,
        durationInMonths: flexPeriod,
        deliveryCost: 50,
        assemblyCost: 117,
        yearlyAdminFee1: 36,
        yearlyAdminFee2: 18.33,
      },
    }

    console.log(data)

    try {
      const json = await fetch('https://api.offr.be/partners/joule/calculate-cp330', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-offr-api-key': 'clomvufdi000408i8f7i0gu6t',
        },
        body: JSON.stringify(data),
      })

      const r = await json.json()

      if (r) {
      }
      console.log(r)

      document.querySelector('.calculator_result').style.display = 'block'
      document.querySelector('.calculator_default').style.display = 'none'

      window.scrollTo({
        top: document.getElementById('calculator_result-wrapper').offsetTop,
        behavior: 'smooth',
      })

      const setValue = (el, resultText, multiple) => {
        if (multiple) {
          const thisEl = document.querySelectorAll(`[data-result="${el}"`)

          thisEl.forEach((element) => (element.innerText = `${element.hasAttribute('data-prefix') ? '€' + resultText : resultText}`))
        } else {
          const thisEl = document.querySelector(`[data-result="${el}"`)

          if (thisEl) {
            thisEl.innerText = `${thisEl.hasAttribute('data-prefix') ? '€' + resultText : resultText}`
          }
        }
      }

      const checkIfPositive = (inputValue, withDollar = true, forceNegative = false) => {
        if (inputValue > 0) {
          return withDollar ? `${forceNegative ? '- ' : ''}€` + inputValue : inputValue
        } else {
          return withDollar ? `${forceNegative ? '- ' : ''}€` + 0 : 0
        }
      }

      // Gross Year End Salary
      setValue('flexBudget2026', '€' + bikeLease * 12)
      // setValue('red', Math.abs(flexBudget - bikeLease * 12))

      // grossYearEndPremium
      setValue('beforeGrossYearEndPremium', '€' + r.beforeLease.grossYearEndPremium.toFixed(0))
      setValue('afterGrossYearEndPremium', checkIfPositive(r.afterLease.grossYearEndPremium.toFixed(0)))

      setValue('beforeEmployerSocialSecurityContributions', '€' + Math.abs(r.beforeLease.employerSocialSecurityContributions.toFixed(0)))
      setValue('afterEmployerSocialSecurityContributions', checkIfPositive(r.afterLease.employerSocialSecurityContributions.toFixed(0), true))

      // RSZ
      setValue('beforeSocialSecurityContributions', '- €' + Math.abs(r.beforeLease.socialSecurityContributions.toFixed(0)))
      setValue('afterSocialSecurityContributions', checkIfPositive(r.afterLease.socialSecurityContributions.toFixed(0), true, true))

      const deltaPatronaleBijdrage = Math.abs(r.afterLease.employerSocialSecurityContributions - Math.abs(r.beforeLease.employerSocialSecurityContributions))

      setValue('advantage', r.afterLease.employerSocialSecurityContributions > 0 ? deltaPatronaleBijdrage.toFixed(0) : r.beforeLease.employerSocialSecurityContributions.toFixed(0))
      setValue('monthlyLeasePrice', Math.abs((bikeLease * 12).toFixed(0)))

      let recoupValue
      if (r.afterLease.employerSocialSecurityContributions > 0) {
        recoupValue = Math.abs((bikeLease * 12 - Math.abs(r.afterLease.employerSocialSecurityContributions - r.beforeLease.employerSocialSecurityContributions)).toFixed(0))
      } else {
        recoupValue = (bikeLease * 12 - r.beforeLease.employerSocialSecurityContributions).toFixed(0)
        setValue('red', Math.abs(flexBudget - (bikeLease * 12 - r.beforeLease.employerSocialSecurityContributions)).toFixed(0))
        console.log(bikeLease * 12)
        console.log(r.beforeLease.employerSocialSecurityContributions)
      }

      setValue('recoup', recoupValue)

      // Taxable Income
      setValue('beforeTaxableIncome', '€' + (r.beforeLease.grossYearEndPremium - r.beforeLease.socialSecurityContributions).toFixed(0))
      setValue('afterTaxableIncome', checkIfPositive((r.afterLease.grossYearEndPremium - r.afterLease.socialSecurityContributions).toFixed(0)))

      // Income Tax
      setValue('beforeIncomeTax', '- €' + Math.abs(r.beforeLease.incomeTaxes.toFixed(0)))
      setValue('afterIncomeTax', checkIfPositive(r.afterLease.incomeTaxes.toFixed(0), true, true))

      // Netto Eindejaarspremie
      setValue('beforeNetYearEndPremium', '€' + r.beforeLease.netYearEndPremium.toFixed(0))
      setValue('afterNetYearEndPremium', checkIfPositive(r.afterLease.netYearEndPremium.toFixed(0)))

      // Netto kost bikelease voor een jaar
      const netCostBikePeriod = ((r.beforeLease.netYearEndPremium - r.afterLease.netYearEndPremium) * flexPeriod) / 12
      setValue('netCostBikeYear', '€' + (r.beforeLease.netYearEndPremium - r.afterLease.netYearEndPremium).toFixed(0))
      setValue('netCostBikePeriod', '€' + netCostBikePeriod.toFixed(0))

      const conditionalItems = document.querySelectorAll('[data-flex-conditional]')
      const conditionalGreen = document.querySelector('[data-flex-conditional="green"]')
      const conditionalRed = document.querySelector('[data-flex-conditional="red"]')
      conditionalItems.forEach((allItem) => allItem.classList.add('hide'))

      if (bikeLease * 12 < flexBudget + deltaPatronaleBijdrage) {
        console.log(bikeLease * 12)
        console.log(flexBudget + deltaPatronaleBijdrage)

        conditionalItems.forEach((allItem) => allItem.classList.add('hide'))
        conditionalGreen.classList.remove('hide')
      } else {
        conditionalItems.forEach((allItem) => allItem.classList.add('hide'))
        conditionalRed.classList.remove('hide')
      }

      /**
       *
       */
    } catch (error) {
      console.log(`Error getting output: ${error}`)
      console.log(`Error getting output: ${error}`)
    }
  }
  submitCalculator.addEventListener('click', submitForm)

  // Add "checked" class to the active radio input button
  document.addEventListener('change', function (event) {
    if (event.target.type === 'radio' && event.target.closest('.calculator_radio-block')) {
      const radioName = event.target.name
      document.querySelectorAll(`.calculator_radio-block input[type="radio"][name="${radioName}"]`).forEach(function (radio) {
        radio.closest('.calculator_radio-block').classList.remove('checked')
      })
      event.target.closest('.calculator_radio-block').classList.add('checked')
    }
  })
}

console.log('whatdup ganggg')
// Execute main function
main()
