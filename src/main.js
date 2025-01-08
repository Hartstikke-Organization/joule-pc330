function main() {
  function initializeLinkedInputs() {
    const inputRanges = document.querySelectorAll('.linked-input, .linked-range')
    inputRanges.forEach((element) => {
      element.addEventListener('input', updateLinkedValue)
      // Initialize the style on load
      updateLinkedValue.call(element)
    })
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

  document.addEventListener('input', function (event) {
    const target = event.target
    const linkedAttributeName = target.dataset.linkedInput || target.dataset.linkedRange

    if (linkedAttributeName) {
      const linkedElements = document.querySelectorAll(`[data-linked-input="${linkedAttributeName}"], [data-linked-range="${linkedAttributeName}"]`)

      linkedElements.forEach((linkedElement) => {
        linkedElement.value = target.value
        updateLinkedValue.call(linkedElement)
      })
    }
  })

  // VARIABLES
  const submitCalculator = document.getElementById('form-button')
  const submitForm = async (e) => {
    e.preventDefault()
    // VALUES

    let flexBudget = parseFloat(document.querySelector('#grossYearEndPremium').value)
    let grossYearlySalary = parseFloat(document.querySelector('#grossYearlySalary').value)
    let grossYearEndPremium = parseFloat(document.querySelector('#grossYearEndPremium').value)
    let flexPeriod = parseInt(document.querySelector('input[name="flexPeriod"]:checked').value)
    let bikeLease = document.querySelector('#bikeLease').value
    let workingRegimePercent = document.querySelector('#workingRegimePercent').value / 100 || 1

    const data = {
      employmentStatus: 'CONTRACTUAL',
      grossYearlySalary: grossYearlySalary,
      grossYearEndPremium: grossYearEndPremium,
      flexBudget: bikeLease * 12,
      workingRegimePercent: workingRegimePercent,
      computeLeaseRateDto: {
        discountRate: 0,
        interestRate: 0.077,
        insurancePremium: 0.035,
        deliveryCost: 50,
        assemblyCost: 117,
        yearlyAdminFee1: 36,
        yearlyAdminFee2: 18.33,
      },
    }

    console.log(data)

    try {
      const json = await fetch('https://api.offr.be/partners/joule/calculate-teachers', {
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

      // Gross Year End Salary
      setValue('flexBudget2026', '€' + bikeLease * 12)
      setValue('red', Math.abs(flexBudget - bikeLease * 12))

      // grossYearEndPremium
      setValue('beforeGrossYearEndPremium', '€' + r.beforeLease.grossYearEndPremium.toFixed(0))
      setValue('afterGrossYearEndPremium', '€' + Math.abs(r.afterLease.grossYearEndPremium.toFixed(0)))

      // RSZ
      setValue('beforeSocialSecurityContributions', '- €' + Math.abs(r.beforeLease.socialSecurityContributions.toFixed(0)))
      setValue('afterSocialSecurityContributions', '- €' + Math.abs(r.afterLease.socialSecurityContributions.toFixed(0)))

      // Taxable Income
      setValue('beforeTaxableIncome', '€' + (r.beforeLease.grossYearEndPremium - r.beforeLease.socialSecurityContributions).toFixed(0))
      setValue('afterTaxableIncome', '€' + Math.abs(r.afterLease.grossYearEndPremium - r.afterLease.socialSecurityContributions).toFixed(0))

      // Income Tax
      setValue('beforeIncomeTax', '- €' + Math.abs(r.beforeLease.incomeTaxes.toFixed(0)))
      setValue('afterIncomeTax', '- €' + Math.abs(r.afterLease.incomeTaxes.toFixed(0)))

      // Netto Eindejaarspremie
      setValue('beforeNetYearEndPremium', '€' + r.beforeLease.netYearEndPremium.toFixed(0))
      setValue('afterNetYearEndPremium', '€' + Math.abs(r.afterLease.netYearEndPremium.toFixed(0)))

      // Netto kost bikelease voor een jaar
      const netCostBikePeriod = ((r.beforeLease.netYearEndPremium - r.afterLease.netYearEndPremium) * flexPeriod) / 12
      setValue('netCostBikeYear', '€' + (r.beforeLease.netYearEndPremium - r.afterLease.netYearEndPremium).toFixed(0))
      setValue('netCostBikePeriod', '€' + netCostBikePeriod.toFixed(0))

      const conditionalItems = document.querySelectorAll('[data-flex-conditional]')
      const conditionalGreen = document.querySelector('[data-flex-conditional="green"]')
      const conditionalRed = document.querySelector('[data-flex-conditional="red"]')
      conditionalItems.forEach((allItem) => allItem.classList.add('hide'))

      if (bikeLease * 12 < flexBudget) {
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

// Execute main function
main()
