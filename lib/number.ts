const LOCALE = 'th-TH'

export const numberFormatter = new Intl.NumberFormat(LOCALE)

export const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'THB',
})
