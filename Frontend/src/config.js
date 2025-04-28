
const config = {
  // API Configuration
  api: {
    url: import.meta.env.VITE_API_URL ,
  },
  
  // Business Information
  business: {
    name: 'Briskwell International',
    email: 'info@briskwellinternational.com',
    phone: '+919922990829',
    address: {
      street: 'A602, Lotus Sanskruti, bldg 2', 
      area: 'Malawalenager 2, Mukai chowk',
      city: 'Ravet- Kiwale',
      country: 'India',
      postalCode: '412101'
    }
  },
  
  // Social Media Links
  social: {
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK || '#',
    twitter: import.meta.env.VITE_SOCIAL_TWITTER || '#',
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || '#',
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || '#'
  }
};

export default config;