/**
 * House archive: past Sundarbans leadership, by academic year.
 *
 * These records used to live inline in the About page and were lost when that
 * view was rebuilt; they are restored here as a module so the archive has one
 * home and any future consumer reads the same list rather than copying it.
 *
 * This is HISTORICAL data and is deliberately kept separate from
 * `src/data/council.js`, which holds the CURRENT council that the Teams and
 * Leaderboard pages render. A year is never rewritten with a later team.
 *
 * Entries are reproduced exactly as they were previously published: the same
 * names, the same roles, the same years, the same contact details. Where a
 * year has no record for an office (2022-23 has no Web Admin), the office is
 * simply absent rather than filled in.
 */

/** Newest first, which is the order the archive renders. */
export const leadershipArchive = [
  {
    period: '2025–26',
    members: [
      {
        role: 'Web Admin',
        name: 'Samar Ahmad',
        email: '23f3001032@ds.study.iitm.ac.in',
        linkedin: 'https://www.linkedin.com/in/samarahmad10',
        instagram: '@thesamarsoldier',
      },
      {
        role: 'Secretary',
        name: 'Mannu Yadav',
        email: '23f3001972@ds.study.iitm.ac.in',
        linkedin: 'https://www.linkedin.com/in/mannuyadav',
        instagram: '@mannu',
      },
      {
        role: 'Deputy Secretary',
        name: 'Aditya Vaidhya',
        email: '23f2000809@ds.study.iitm.ac.in',
        linkedin: 'http://linkedin.com/in/aditya-vaidhya',
        instagram: '@aditya',
      },
    ],
  },
  {
    period: '2024–25',
    members: [
      {
        role: 'Web Admin',
        name: 'Jivraj',
        email: '23f3001032@ds.study.iitm.ac.in',
      },
      {
        role: 'Secretary',
        name: 'Shreyansh Mall',
        email: '23f1002638@ds.study.iitm.ac.in',
      },
      {
        role: 'Deputy Secretary',
        name: 'Divya Chinmay',
        email: '23f1002974@ds.study.iitm.ac.in',
      },
    ],
  },
  {
    period: '2023–24',
    members: [
      {
        role: 'Web Admin',
        name: 'Ravi Kumawat',
        email: '21f1004119@ds.study.iitm.ac.in',
        instagram: '@ravikumawat7716',
      },
      {
        role: 'Secretary',
        name: 'Abhishek Ojha',
        email: '22f1001774@ds.study.iitm.ac.in',
      },
      {
        role: 'Deputy Secretary',
        name: 'Ravi Kant',
        email: '21f3002792@ds.study.iitm.ac.in',
      },
    ],
  },
  {
    period: '2022–23',
    members: [
      {
        role: 'Secretary',
        name: 'Kunal Chaturvedi',
        email: '21f1003533@ds.study.iitm.ac.in',
      },
      {
        role: 'Deputy Secretary',
        name: 'Abhishek Ojha',
        email: '21f1003533@ds.study.iitm.ac.in',
      },
    ],
  },
  {
    period: '2021–22',
    members: [
      {
        role: 'Web Admin',
        name: 'Abhigyan Das',
        email: '21f1003533@ds.study.iitm.ac.in',
      },
      {
        role: 'Secretary',
        name: 'Anshuman',
        email: '21f1003533@ds.study.iitm.ac.in',
      },
      {
        role: 'Deputy Secretary',
        name: 'Utkarsh Gaurav',
        email: '21f1003533@ds.study.iitm.ac.in',
      },
    ],
  },
];

/**
 * Reading order for the offices, senior first. Presentation only: the stored
 * order of each year is untouched, and an office a year has no record for is
 * left out of the result rather than rendered empty.
 */
const ROLE_ORDER = ['Secretary', 'Deputy Secretary', 'Web Admin'];

export function membersInOfficeOrder(year) {
  return [...year.members].sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));
}

/** Instagram is stored as a handle, so the profile URL is derived from it. */
export function instagramUrl(handle) {
  return `https://instagram.com/${String(handle).replace('@', '')}`;
}
