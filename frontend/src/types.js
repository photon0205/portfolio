/**
 * @typedef {Object} Skill
 * @property {number} id
 * @property {string} name
 * @property {string|null} logo
 */

/**
 * @typedef {Object} SocialLink
 * @property {number} id
 * @property {string} platform
 * @property {string} url
 * @property {number} about_me
 */

/**
 * @typedef {Object} AboutData
 * @property {number} id
 * @property {SocialLink[]} social_links
 * @property {string} name
 * @property {string} summary
 * @property {string} current_role
 * @property {string} subtitle
 * @property {string} email
 * @property {string} profile_picture
 * @property {string} resume
 * @property {string} avatar
 */

/**
 * @typedef {Object} ProjectImage
 * @property {number} id
 * @property {string} image
 * @property {string} category
 * @property {number} project
 */

/**
 * @typedef {Object} ProjectCategory
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {Skill[]} skills_used
 * @property {ProjectImage[]} images
 * @property {ProjectCategory} category
 * @property {string} title
 * @property {string} caption
 * @property {string} description
 * @property {string} organisation
 * @property {string} github_link
 * @property {string} live_demo_link
 * @property {string} start_date
 * @property {string|null} end_date
 * @property {number} display_order
 */

/**
 * @typedef {Object} ExperiencePoint
 * @property {number} id
 * @property {string} point
 */

/**
 * @typedef {Object} Experience
 * @property {number} id
 * @property {ExperiencePoint[]} description
 * @property {Skill[]} skills_used
 * @property {string} company_logo
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {string} start_date
 * @property {string|null} end_date
 * @property {string} website
 */

/**
 * @typedef {Object} ContributionType
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} Contribution
 * @property {number} id
 * @property {ContributionType} contribution_type
 * @property {string} description
 * @property {string} pr_link
 * @property {number} open_source_project
 */

/**
 * @typedef {Object} OpenSourceProject
 * @property {number} id
 * @property {Contribution[]} contributions
 * @property {string} name
 * @property {string} caption
 * @property {string} image
 * @property {string} repo_link
 */

/**
 * @typedef {Object} PortfolioData
 * @property {AboutData} about
 * @property {Project[]} projects
 * @property {ProjectCategory[]} categories
 * @property {Experience[]} experiences
 * @property {OpenSourceProject[]} opensource
 */

/**
 * @typedef {'hero' | 'work' | 'career' | 'about'} SectionType
 */

export const SECTION_TYPES = {
  HERO: 'hero',
  WORK: 'work',
  CAREER: 'career',
  ABOUT: 'about',
};

