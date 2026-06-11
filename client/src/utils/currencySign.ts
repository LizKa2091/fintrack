export const getCurrencySign = (currencyCode: string | undefined): string => {
   switch (currencyCode) {
      case 'USD':
         return '$'
      case 'EUR':
         return '€'
      case 'KZT':
         return '₸'
      case 'RUB':
      default:
         return '₽'
   }
}
