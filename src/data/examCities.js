/**
 * IITM BS exam centres — the single source of truth for the /exam-cities page.
 *
 * Lifted verbatim out of the old Study Corner section when exam locations were
 * given their own route: same states, same cities, same region assignments, in
 * the same order. Nothing here is derived at build time, so an addition is a
 * one-line edit.
 *
 * `region` names the exam city a state is administered from; `examRegionKeys`
 * fixes the display order of those regions, which is not alphabetical.
 */
export const examCitiesData = [
  {
    state: 'Andaman & Nicobar Islands',
    region: 'Kolkata',
    cities: ['Port Blair'],
  },
  {
    state: 'Andhra Pradesh',
    region: 'Hyderabad',
    cities: [
      'Anantapur',
      'Bhimavaram',
      'Guntur',
      'Kadapa',
      'Kurnool',
      'Rajahmundry',
      'Tirupathi',
      'Vijayawada',
      'Vishakhapatnam',
    ],
  },
  { state: 'Arunachal Pradesh', region: 'Kolkata', cities: ['Naharlagun'] },
  {
    state: 'Assam',
    region: 'Kolkata',
    cities: ['Dibrugarh', 'Guwahati', 'Silchar', 'Tezpur'],
  },
  {
    state: 'Bihar',
    region: 'Patna',
    cities: ['Patna', 'Bhagalpur', 'Gaya', 'Muzaffarpur', 'Darbhanga'],
  },
  { state: 'Chhattisgarh', region: 'Patna', cities: ['Raipur'] },
  { state: 'Delhi', region: 'Delhi', cities: ['Delhi'] },
  { state: 'Goa', region: 'Mumbai', cities: ['Panaji'] },
  {
    state: 'Gujarat',
    region: 'Mumbai',
    cities: ['Ahmedabad', 'Anand', 'Rajkot', 'Surat', 'Vadodara'],
  },
  {
    state: 'Haryana',
    region: 'Chandigarh',
    cities: ['Faridabad', 'Gurgaon', 'Kurukshetra'],
  },
  {
    state: 'Himachal Pradesh',
    region: 'Chandigarh',
    cities: ['Hamirpur', 'Shimla'],
  },
  {
    state: 'Jammu & Kashmir',
    region: 'Chandigarh',
    cities: ['Jammu', 'Srinagar'],
  },
  {
    state: 'Jharkhand',
    region: 'Patna',
    cities: ['Dhanbad', 'Jamshedpur', 'Ranchi'],
  },
  {
    state: 'Karnataka',
    region: 'Bengaluru',
    cities: ['Belgaum', 'Bengaluru', 'Dharwad', 'Gulbarga', 'Mangalore', 'Mysore'],
  },
  {
    state: 'Kerala',
    region: 'Bengaluru',
    cities: ['Calicut', 'Ernakulam', 'Kollam', 'Kottayam', 'Palakkad', 'Thrissur', 'Trivandrum'],
  },
  {
    state: 'Madhya Pradesh',
    region: 'Mumbai',
    cities: ['Bhopal', 'Gwalior', 'Indore', 'Jabalpur'],
  },
  {
    state: 'Maharashtra',
    region: 'Mumbai',
    cities: [
      'Amravati',
      'Aurangabad',
      'Jalgaon',
      'Kolhapur',
      'Mumbai',
      'Nagpur',
      'Nanded',
      'Nashik',
      'Pune',
      'Solapur',
    ],
  },
  { state: 'Manipur', region: 'Kolkata', cities: ['Imphal'] },
  { state: 'Meghalaya', region: 'Kolkata', cities: ['Shillong'] },
  { state: 'Mizoram', region: 'Kolkata', cities: ['Aizawl'] },
  { state: 'Nagaland', region: 'Kolkata', cities: ['Dimapur'] },
  {
    state: 'Odisha',
    region: 'Kolkata',
    cities: ['Bhubaneswar', 'Rourkela', 'Sambalpur'],
  },
  { state: 'Puducherry', region: 'Chennai', cities: ['Puducherry'] },
  {
    state: 'Punjab',
    region: 'Chandigarh',
    cities: ['Chandigarh', 'Jalandhar', 'Ludhiana', 'Amritsar'],
  },
  {
    state: 'Rajasthan',
    region: 'Chandigarh',
    cities: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur'],
  },
  { state: 'Sikkim', region: 'Kolkata', cities: ['Bardang'] },
  {
    state: 'Tamil Nadu',
    region: 'Chennai',
    cities: [
      'Chennai-Avadi',
      'Chennai-South',
      'Coimbatore',
      'Erode',
      'Kanchipuram',
      'Madurai',
      'Salem',
      'Thanjavur',
      'Tiruchirappalli',
      'Tirunelveli',
      'Vellore',
    ],
  },
  {
    state: 'Telangana',
    region: 'Hyderabad',
    cities: ['Hyderabad', 'Warangal'],
  },
  { state: 'Tripura', region: 'Kolkata', cities: ['Agartala'] },
  {
    state: 'Uttar Pradesh',
    region: 'Lucknow',
    cities: [
      'Agra',
      'Allahabad',
      'Ghaziabad',
      'Gorakhpur',
      'Greater Noida',
      'Kanpur',
      'Lucknow',
      'Meerut',
      'Varanasi',
    ],
  },
  {
    state: 'Uttarakhand',
    region: 'Chandigarh',
    cities: ['Dehradun', 'Haldwani', 'Roorkee'],
  },
  {
    state: 'West Bengal',
    region: 'Kolkata',
    cities: ['Asansol', 'Adisaptagram', 'Durgapur', 'Kolkata', 'Siliguri'],
  },
];

export const examRegionKeys = [
  'Delhi',
  'Chennai',
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
  'Kolkata',
  'Patna',
  'Chandigarh',
  'Lucknow',
];
