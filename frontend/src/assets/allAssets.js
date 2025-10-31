import add_icon from './add_icon.svg'
import admin_logo from './admin_logo.svg'
import appointment_icon from './appointment_icon.svg'
import cancel_icon from './cancel_icon.svg'
import doctor_icon from './doctor_icon.svg'
import home_icon from './home_icon.svg'
import people_icon from './people_icon.svg'
import upload_area from './upload_area.svg'
import list_icon from './list_icon.svg'
import tick_icon from './tick_icon.svg'
import appointments_icon from './appointments_icon.svg'
import earning_icon from './earning_icon.svg'
import patients_icon from './patients_icon.svg'
import logo_icon from "./logo.svg";
import profile_pic from "./profile_pic.png";
import dropdown_icon from "./dropdown_icon.svg";
import group_profiles from "./group_profiles.png";
import header_img from "./header_img.png";
import arrow_icon from "./arrow_icon.svg";
import Dermatologist from "./Dermatologist.svg"
import Gastroenterologist from "./Gastroenterologist.svg";
import Gynecologist from "./Gynecologist.svg";
import Neurologist from "./Neurologist.svg";
import Pediatricians from "./Pediatricians.svg";
import General_physician from "./General_physician.svg";
import doc1 from "./doc1.png";
import doc2 from "./doc2.png";
import doc3 from "./doc3.png";
import doc4 from "./doc4.png";
import doc5 from "./doc5.png";
import doc6 from "./doc6.png";
import doc7 from "./doc7.png";
import doc8 from "./doc8.png";
import doc9 from "./doc9.png";
import doc10 from "./doc10.png";
import doc11 from "./doc11.png";
import doc12 from "./doc12.png";
import doc13 from "./doc13.png";
import doc14 from "./doc14.png";
import doc15 from "./doc15.png";
import appointment_img from "./appointment_img.png";
import verified_icon from "./verified_icon.svg";
import info_icon from "./info_icon.svg";
import about_image from "./about_image.png";
import contact_image from "./contact_image.png";
import menu_icon from "./menu_icon.svg";
import cross_icon from "./cross_icon.png";
import upload_icon from "./upload_icon.png";
import arhospital_logo from "./arhospital_logo.png";
export const assets = {
    add_icon,
    admin_logo,
    appointment_icon,
    cancel_icon,
    doctor_icon,
    upload_area,
    home_icon,
    patients_icon,
    people_icon,
    list_icon,
    tick_icon,
    appointments_icon,
    earning_icon,
    logo_icon,
    profile_pic,
    dropdown_icon,
    group_profiles,
    header_img,
    arrow_icon,
    appointment_img,
    verified_icon,
    info_icon,
    about_image,
    contact_image,
    menu_icon,
    cross_icon,
    upload_icon,
    arhospital_logo
}
export const speciality=[
  {
    speciality: "Gastroenterologist",
    image: Gastroenterologist
  },
  {
    speciality: "Dermatology",
    image: Dermatologist
  },
  {
    speciality: "Neurology",
    image: Neurologist
  },
  {
    speciality:"General_physician",
    image: General_physician
  },
  {
    speciality: "Pediatricians",
    image: Pediatricians
  },
  {
    speciality:"Gynecologist",
    image:Gynecologist
  }
]


export const doctors =[
  {
    id: "doc1",
    name: "Dr. Arjun Mehra",
    image: doc1,
    speciality: "General Physician",
    degree: "MBBS, MD",
    experience: 10,
    about: "Expert in heart-related treatments, preventive care, and lifestyle management. Known for a patient-first approach, thorough diagnoses, and a strong focus on long-term wellness.",
    fee: 500,
    address: {
      line1: "123 Main Street",
      line2: "City Center"
    }
  },
  {
    id: "doc2",
    name: "Dr. Priya Sharma",
    image: doc2,
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: 8,
    about: "Skin and hair specialist with extensive experience in treating chronic skin conditions, cosmetic dermatology, and laser treatments. Passionate about enhancing patient confidence through skin health.",
    fee: 400,
    address: {
      line1: "456 Elm Street",
      line2: "North Zone"
    }
  },
  {
    id: "doc3",
    name: "Dr. Rohan Khanna",
    image: doc3,
    speciality: "Neurologist",
    degree: "MBBS, DM",
    experience: 12,
    about: "Brain and nervous system expert specializing in migraines, epilepsy, and neurodegenerative disorders. Advocates for early diagnosis and holistic treatment strategies.",
    fee: 600,
    address: {
      line1: "789 Oak Avenue",
      line2: "Medical Plaza"
    }
  },
  {
    id: "doc4",
    name: "Dr. Christopher Lee",
    image: doc4,
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: 7,
    about: "Child specialist with a gentle approach, focusing on developmental milestones, vaccinations, and common childhood illnesses. Known for building trust with both children and parents.",
    fee: 350,
    address: {
      line1: "101 Maple Lane",
      line2: "Children's Wing"
    }
  },
  {
    id: "doc5",
    name: "Dr. Jennifer Garcia",
    image: doc5,
    speciality: "General Physician",
    degree: "MBBS, MS Ortho",
    experience: 15,
    about: "Bone and joint care expert with specialization in sports injuries, fracture management, and arthritis treatment. Dedicated to restoring mobility and improving quality of life.",
    fee: 550,
    address: {
      line1: "202 Pine Street",
      line2: "Ortho Block"
    }
  },
  {
    id: "doc6",
    name: "Dr. Andrew Williams",
    image: doc6,
    speciality: "Gynecologist",
    degree: "MBBS, MS Gynae",
    experience: 9,
    about: "Women’s health and pregnancy care specialist with expertise in prenatal care, fertility counseling, and minimally invasive gynecological surgeries.",
    fee: 450,
    address: {
      line1: "303 Birch Boulevard",
      line2: "Women’s Clinic"
    }
  },
  {
    id: "doc7",
    name: "Dr. Vivek Malhotra",
    image: doc7,
    speciality: "General Physician",
    degree: "MBBS, MD Psychiatry",
    experience: 11,
    about: "Mental health and therapy expert specializing in anxiety, depression, and stress management. Promotes mental well-being through therapy and lifestyle adjustments.",
    fee: 500,
    address: {
      line1: "404 Cedar Road",
      line2: "Mind Wellness Center"
    }
  },
  {
    id: "doc8",
    name: "Dr. Timothy White",
    image: doc8,
    speciality: "General Physician",
    degree: "MBBS, MS ENT",
    experience: 6,
    about: "Ear, nose, and throat specialist with a focus on sinus disorders, hearing loss, and voice-related conditions. Skilled in both medical and surgical ENT treatments.",
    fee: 300,
    address: {
      line1: "505 Spruce Street",
      line2: "ENT Clinic"
    }
  },
  {
    id: "doc9",
    name: "Dr. Ava Mitchell",
    image: doc9,
    speciality: "General Physician",
    degree: "MBBS, MS Ophthalmology",
    experience: 10,
    about: "Eye care and surgery specialist focusing on cataract surgery, glaucoma management, and vision restoration procedures.",
    fee: 400,
    address: {
      line1: "606 Redwood Drive",
      line2: "Eye Hospital"
    }
  },
  {
    id: "doc10",
    name: "Dr. Jeffrey King",
    image: doc10,
    speciality: "Gastroenterologist",
    degree: "MBBS, DM Oncology",
    experience: 13,
    about: "Cancer treatment and care expert specializing in gastrointestinal oncology. Known for combining advanced medical treatments with compassionate patient care.",
    fee: 700,
    address: {
      line1: "707 Chestnut Lane",
      line2: "Cancer Institute"
    }
  },
  {
    id: "doc11",
    name: "Dr. Sameer Rathi",
    image: doc11,
    speciality: "General Physician",
    degree: "MBBS, MS Urology",
    experience: 9,
    about: "Urinary tract and male health specialist with expertise in kidney stones, prostate conditions, and reproductive health.",
    fee: 450,
    address: {
      line1: "808 Palm Avenue",
      line2: "Uro Health Center"
    }
  },
  {
    id: "doc12",
    name: "Dr. Meera Desai",
    image: doc12,
    speciality: "General Physician",
    degree: "MBBS, MD",
    experience: 14,
    about: "Cardiovascular specialist focusing on heart disease prevention, advanced diagnostic methods, and rehabilitation programs for cardiac patients.",
    fee: 520,
    address: {
      line1: "909 Cypress Street",
      line2: "Cardio Care"
    }
  },
  {
    id: "doc13",
    name: "Dr. Aarav Joshi",
    image: doc13,
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: 5,
    about: "Cosmetic skin care expert with a special interest in acne treatment, anti-aging solutions, and aesthetic procedures.",
    fee: 380,
    address: {
      line1: "111 Pine Grove",
      line2: "Skin Solutions"
    }
  },
  {
    id: "doc14",
    name: "Dr. Sanjay Iyer",
    image: doc14,
    speciality: "Neurologist",
    degree: "MBBS, DM",
    experience: 16,
    about: "Neuro surgeon and specialist in complex brain surgeries, stroke management, and spinal cord treatments.",
    fee: 650,
    address: {
      line1: "222 Willow Way",
      line2: "Neuro Center"
    }
  },
  {
    id: "doc15",
    name: "Dr. Radhika Menon",
    image: doc15,
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: 4,
    about: "Newborn and child care specialist dedicated to preventive health, early childhood nutrition, and developmental guidance.",
    fee: 320,
    address: {
      line1: "333 Magnolia Lane",
      line2: "Pediatric Ward"
    }
  }
];
