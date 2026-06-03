// Canonical list of the 40 business categories (names match the live DB exactly,
// see categorySubMap in BusinessList.jsx). Each entry carries an icon and an
// accent hue used by the "Browse by Category" UI. Ordered by trader volume
// (live DB ranking) so the most popular categories surface first.
import {
  FaHandshake, FaBolt, FaShoppingBasket, FaTshirt, FaBuilding, FaHotel,
  FaUserMd, FaTruck, FaSeedling, FaTools, FaGraduationCap, FaPrint,
  FaStethoscope, FaSpa, FaRing, FaHardHat, FaLeaf, FaCar, FaBlender,
  FaUtensils, FaBullhorn, FaCode, FaBriefcase, FaUniversity, FaFutbol,
  FaLaptopCode, FaGem, FaShieldAlt, FaBalanceScale, FaBoxOpen, FaConciergeBell,
  FaShippingFast, FaGlassCheers, FaHandHoldingUsd, FaWrench, FaBug,
  FaPlaceOfWorship, FaFileInvoiceDollar, FaFlask, FaPlaneDeparture
} from 'react-icons/fa';

export const categories = [
  { rank: 1, name: 'B2B Services', icon: FaHandshake, count: 3120, pct: '17.1%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301336/vanigan_biz/businesses/gallery/LIST3897_g0.jpg' },
  { rank: 2, name: 'Electricals & Electronics', icon: FaBolt, count: 1541, pct: '8.4%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301392/vanigan_biz/businesses/gallery/LIST4778_g0.jpg' },
  { rank: 3, name: 'Daily Needs', icon: FaShoppingBasket, count: 1071, pct: '5.9%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301098/vanigan_biz/businesses/gallery/LIST216_g0.jpg' },
  { rank: 4, name: 'Textiles & Garments', icon: FaTshirt, count: 909, pct: '5.0%', accent: '#C77DBb', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301505/vanigan_biz/businesses/LIST7107_cover.jpg' },
  { rank: 5, name: 'Real Estate', icon: FaBuilding, count: 810, pct: '4.4%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301557/vanigan_biz/businesses/gallery/LIST8316_g0.jpg' },
  { rank: 6, name: 'Hotels & Restaurants', icon: FaHotel, count: 742, pct: '4.1%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301301/vanigan_biz/businesses/gallery/LIST3277_g0.jpg' },
  { rank: 7, name: 'Doctors', icon: FaUserMd, count: 708, pct: '3.9%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301402/vanigan_biz/businesses/gallery/LIST4943_g0.jpg' },
  { rank: 8, name: 'Transport', icon: FaTruck, count: 672, pct: '3.7%', accent: '#E8A93A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301363/vanigan_biz/businesses/LIST4327_profile.jpg' },
  { rank: 9, name: 'Agriculture', icon: FaSeedling, count: 636, pct: '3.5%', accent: '#5FB85F', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301867/vanigan_biz/businesses/LIST22816_cover.jpg' },
  { rank: 10, name: 'Construction Materials', icon: FaTools, count: 588, pct: '3.2%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301814/vanigan_biz/businesses/LIST19224_cover.jpg' },
  { rank: 11, name: 'Education', icon: FaGraduationCap, count: 565, pct: '3.1%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301504/vanigan_biz/businesses/gallery/LIST7094_g0.jpg' },
  { rank: 12, name: 'Printing Services', icon: FaPrint, count: 528, pct: '2.9%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301434/vanigan_biz/businesses/gallery/LIST5655_g0.jpg' },
  { rank: 13, name: 'Hospitals & Clinics', icon: FaStethoscope, count: 515, pct: '2.8%', accent: '#E05A5A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301320/vanigan_biz/businesses/gallery/LIST3632_g0.jpg' },
  { rank: 14, name: 'Spa & Beauty', icon: FaSpa, count: 479, pct: '2.6%', accent: '#C77DBb', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301333/vanigan_biz/businesses/gallery/LIST3841_g0.jpg' },
  { rank: 15, name: 'Wedding Services', icon: FaRing, count: 444, pct: '2.4%', accent: '#E8A93A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301093/vanigan_biz/businesses/gallery/LIST138_g0.jpg' },
  { rank: 16, name: 'Civil Contractors', icon: FaHardHat, count: 435, pct: '2.4%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301804/vanigan_biz/businesses/LIST18777_profile.jpg' },
  { rank: 17, name: 'Organic Products', icon: FaLeaf, count: 413, pct: '2.3%', accent: '#5FB85F', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301493/vanigan_biz/businesses/gallery/LIST6822_g0.jpg' },
  { rank: 18, name: 'Automobile', icon: FaCar, count: 409, pct: '2.2%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301682/vanigan_biz/businesses/LIST10888_cover.jpg' },
  { rank: 19, name: 'Home Appliances', icon: FaBlender, count: 398, pct: '2.2%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301815/vanigan_biz/businesses/LIST19239_profile.jpg' },
  { rank: 20, name: 'Caterers', icon: FaUtensils, count: 345, pct: '1.9%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301174/vanigan_biz/businesses/gallery/LIST1269_g0.jpg' },
  { rank: 21, name: 'Advertising', icon: FaBullhorn, count: 309, pct: '1.7%', accent: '#E8A93A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301348/vanigan_biz/businesses/gallery/LIST4043_g0.jpg' },
  { rank: 22, name: 'IT & Software', icon: FaCode, count: 305, pct: '1.7%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301287/vanigan_biz/businesses/gallery/LIST3058_g0.jpg' },
  { rank: 23, name: 'Jobs', icon: FaBriefcase, count: 253, pct: '1.4%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301767/vanigan_biz/businesses/LIST16759_cover.jpg' },
  { rank: 24, name: 'Banking & Finance', icon: FaUniversity, count: 245, pct: '1.3%', accent: '#5FB85F', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301565/vanigan_biz/businesses/gallery/LIST8454_g0.jpg' },
  { rank: 25, name: 'Sports', icon: FaFutbol, count: 205, pct: '1.1%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301360/vanigan_biz/businesses/LIST4246_profile.jpg' },
  { rank: 26, name: 'Digital & IT Products', icon: FaLaptopCode, count: 183, pct: '1.0%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301679/vanigan_biz/businesses/LIST10649_profile.jpg' },
  { rank: 27, name: 'Jewellery', icon: FaGem, count: 163, pct: '0.9%', accent: '#E8A93A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301762/vanigan_biz/businesses/LIST16477_profile.jpg' },
  { rank: 28, name: 'Insurance', icon: FaShieldAlt, count: 158, pct: '0.9%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301479/vanigan_biz/businesses/LIST6431_cover.jpg' },
  { rank: 29, name: 'Advocate & Legal', icon: FaBalanceScale, count: 157, pct: '0.9%', accent: '#C77DBb', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301174/vanigan_biz/businesses/gallery/LIST1260_g0.jpg' },
  { rank: 30, name: 'Packers & Movers', icon: FaBoxOpen, count: 120, pct: '0.7%', accent: '#E87722', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301752/vanigan_biz/businesses/LIST15725_cover.jpg' },
  { rank: 31, name: 'Demand Services', icon: FaConciergeBell, count: 111, pct: '0.6%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301760/vanigan_biz/businesses/LIST16387_cover.jpg' },
  { rank: 32, name: 'Courier Services', icon: FaShippingFast, count: 99, pct: '0.5%', accent: '#E8A93A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301124/vanigan_biz/businesses/gallery/LIST646_g0.jpg' },
  { rank: 33, name: 'Banquets & Event Halls', icon: FaGlassCheers, count: 98, pct: '0.5%', accent: '#C77DBb', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301115/vanigan_biz/businesses/gallery/LIST493_g0.jpg' },
  { rank: 34, name: 'Hire Services', icon: FaHandHoldingUsd, count: 96, pct: '0.5%', accent: '#5FB85F', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301297/vanigan_biz/businesses/LIST3228_profile.jpg' },
  { rank: 35, name: 'Repairs', icon: FaWrench, count: 93, pct: '0.5%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301258/vanigan_biz/businesses/gallery/LIST2578_g0.jpg' },
  { rank: 36, name: 'Pest Control', icon: FaBug, count: 89, pct: '0.5%', accent: '#5FB85F', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301267/vanigan_biz/businesses/LIST2772_profile.jpg' },
  { rank: 37, name: 'Religious', icon: FaPlaceOfWorship, count: 69, pct: '0.4%', accent: '#E8A93A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301485/vanigan_biz/businesses/gallery/LIST6482_g0.jpg' },
  { rank: 38, name: 'Bills & Recharge', icon: FaFileInvoiceDollar, count: 66, pct: '0.4%', accent: '#3DB1AD', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301633/vanigan_biz/businesses/gallery/LIST9539_g0.jpg' },
  { rank: 39, name: 'Labs & Diagnostics', icon: FaFlask, count: 57, pct: '0.3%', accent: '#E05A5A', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301212/vanigan_biz/businesses/gallery/LIST1825_g0.jpg' },
  { rank: 40, name: 'Travel & Tourism', icon: FaPlaneDeparture, count: 47, pct: '0.3%', accent: '#5B8DEF', image: 'https://res.cloudinary.com/dr5tkzmva/image/upload/v1780301755/vanigan_biz/businesses/LIST16010_profile.jpg' },
];

export default categories;
