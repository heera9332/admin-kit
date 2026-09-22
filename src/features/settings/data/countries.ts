import type { CountryOption } from "../types/address"

export const COUNTRIES: CountryOption[] = [
  {
    code: "US",
    name: "United States (US)",
    flag: "🇺🇸",
    states: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" },
      { code: "TX", name: "Texas" },
      { code: "FL", name: "Florida" },
      { code: "WA", name: "Washington" },
      { code: "IL", name: "Illinois" },
      { code: "PA", name: "Pennsylvania" },
      { code: "OH", name: "Ohio" },
      { code: "GA", name: "Georgia" },
      { code: "NC", name: "North Carolina" },
      { code: "MA", name: "Massachusetts" },
      { code: "CO", name: "Colorado" },
      { code: "AZ", name: "Arizona" },
      { code: "NV", name: "Nevada" },
      { code: "OR", name: "Oregon" },
    ],
  },
  {
    code: "GB",
    name: "United Kingdom (UK)",
    flag: "🇬🇧",
    states: [
      { code: "ENG-LON", name: "Greater London" },
      { code: "ENG-MAN", name: "Greater Manchester" },
      { code: "ENG-WM", name: "West Midlands" },
      { code: "ENG-WY", name: "West Yorkshire" },
      { code: "SCT", name: "Scotland" },
      { code: "WLS", name: "Wales" },
      { code: "NIR", name: "Northern Ireland" },
    ],
  },
  {
    code: "CA",
    name: "Canada (CA)",
    flag: "🇨🇦",
    states: [
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" },
      { code: "BC", name: "British Columbia" },
      { code: "AB", name: "Alberta" },
      { code: "MB", name: "Manitoba" },
      { code: "NS", name: "Nova Scotia" },
    ],
  },
  {
    code: "AU",
    name: "Australia (AU)",
    flag: "🇦🇺",
    states: [
      { code: "NSW", name: "New South Wales" },
      { code: "VIC", name: "Victoria" },
      { code: "QLD", name: "Queensland" },
      { code: "WA", name: "Western Australia" },
      { code: "SA", name: "South Australia" },
      { code: "TAS", name: "Tasmania" },
      { code: "ACT", name: "Australian Capital Territory" },
    ],
  },
  {
    code: "IN",
    name: "India (IN)",
    flag: "🇮🇳",
    states: [
      { code: "MH", name: "Maharashtra" },
      { code: "DL", name: "Delhi" },
      { code: "KA", name: "Karnataka" },
      { code: "RJ", name: "Rajasthan" },
      { code: "TN", name: "Tamil Nadu" },
      { code: "UP", name: "Uttar Pradesh" },
      { code: "GJ", name: "Gujarat" },
      { code: "WB", name: "West Bengal" },
      { code: "TG", name: "Telangana" },
      { code: "HR", name: "Haryana" },
      { code: "PB", name: "Punjab" },
    ],
  },
  {
    code: "DE",
    name: "Germany (DE)",
    flag: "🇩🇪",
    states: [
      { code: "BY", name: "Bavaria" },
      { code: "BE", name: "Berlin" },
      { code: "NW", name: "North Rhine-Westphalia" },
      { code: "BW", name: "Baden-Württemberg" },
      { code: "HE", name: "Hesse" },
      { code: "HH", name: "Hamburg" },
    ],
  },
  {
    code: "FR",
    name: "France (FR)",
    flag: "🇫🇷",
    states: [
      { code: "IDF", name: "Île-de-France" },
      { code: "ARA", name: "Auvergne-Rhône-Alpes" },
      { code: "PAC", name: "Provence-Alpes-Côte d'Azur" },
      { code: "OCC", name: "Occitanie" },
      { code: "NAQ", name: "Nouvelle-Aquitaine" },
    ],
  },
  {
    code: "JP",
    name: "Japan (JP)",
    flag: "🇯🇵",
    states: [
      { code: "13", name: "Tokyo" },
      { code: "27", name: "Osaka" },
      { code: "14", name: "Kanagawa" },
      { code: "23", name: "Aichi" },
      { code: "26", name: "Kyoto" },
      { code: "01", name: "Hokkaido" },
    ],
  },
  {
    code: "SG",
    name: "Singapore (SG)",
    flag: "🇸🇬",
    states: [
      { code: "SG-CENTRAL", name: "Central Region" },
      { code: "SG-EAST", name: "East Region" },
      { code: "SG-NORTH", name: "North Region" },
      { code: "SG-WEST", name: "West Region" },
    ],
  },
  {
    code: "AE",
    name: "United Arab Emirates (AE)",
    flag: "🇦🇪",
    states: [
      { code: "DXB", name: "Dubai" },
      { code: "AUH", name: "Abu Dhabi" },
      { code: "SHJ", name: "Sharjah" },
      { code: "AJM", name: "Ajman" },
    ],
  },
]

export function getCountryByCode(code: string): CountryOption | undefined {
  return COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase())
}

export function getStatesForCountry(countryCode: string) {
  const country = getCountryByCode(countryCode)
  return country?.states ?? []
}
