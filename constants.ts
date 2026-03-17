import { Service, Review, TeamMember, BusinessInfo } from './types';

export const BUSINESS_INFO: BusinessInfo = {
  name: "Barbearia Guarujá 01",
  phone: "5513981388978",
  phoneDisplay: "(13) 98138-8978",
  address: "Alameda das Margaridas, 243 - Loja 7, Jardim Primavera, Guarujá - SP",
  mapLink: "https://maps.google.com/?q=Alameda+das+Margaridas,243,Guaruja,SP",
  hours: {
    weekdays: "09:30 - 20:30",
    sunday: "Fechado"
  },
  social: {
    facebook: "https://www.facebook.com/BarbeariaGuaruja",
    instagram: "#"
  }
};

export const SERVICES: Service[] = [
  {
    id: 1,
    name: "Corte Masculino Tradicional",
    description: "Corte clássico executado por profissionais experientes",
    price: 40.00,
    duration: "40min"
  },
  {
    id: 2,
    name: "Corte + Barba",
    description: "Pacote completo: corte moderno + design de barba impecável",
    price: 70.00,
    duration: "1h",
    popular: true
  },
  {
    id: 3,
    name: "Barba Completa",
    description: "Aparar, modelar e finalizar sua barba com precisão",
    price: 35.00,
    duration: "30min"
  },
  {
    id: 4,
    name: "Corte Infantil",
    description: "Atendimento especializado para os pequenos",
    price: 35.00,
    duration: "30min"
  },
  {
    id: 5,
    name: "Degradê/Fade",
    description: "Degradê profissional com acabamento perfeito",
    price: 45.00,
    duration: "45min"
  },
  {
    id: 6,
    name: "Sobrancelha",
    description: "Design e limpeza de sobrancelhas masculinas",
    price: 15.00,
    duration: "15min"
  },
  {
    id: 7,
    name: "Platinado/Luzes",
    description: "Coloração e mechas com produtos de qualidade",
    price: 80.00,
    duration: "1h 30min"
  },
  {
    id: 8,
    name: "Hidratação",
    description: "Tratamento hidratante para cabelo e couro cabeludo",
    price: 25.00,
    duration: "20min"
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Cliente Google",
    rating: 5,
    text: "Ótimo atendimento, com direito a água e cafezinho enquanto espera.",
    date: "Há 2 meses"
  },
  {
    id: 2,
    name: "Cliente Google",
    rating: 5,
    text: "Pessoal simpático, bons profissionais, bom papo, enfim.",
    date: "Há 1 semana"
  },
  {
    id: 3,
    name: "Cliente Google",
    rating: 5,
    text: "Excelente serviço, sempre saio satisfeito com o resultado.",
    date: "Há 3 semanas"
  },
  {
    id: 4,
    name: "Cliente Google",
    rating: 5,
    text: "Melhor barbearia da região, recomendo!",
    date: "Há 1 mês"
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Bruno Lima",
    role: "Proprietário & Master Barber",
    experience: "10+ anos",
    image: "https://picsum.photos/300/300?grayscale&random=101",
    available: true
  },
  {
    id: 2,
    name: "João Silva",
    role: "Barbeiro Sênior",
    experience: "5 anos",
    image: "https://picsum.photos/300/300?grayscale&random=102",
    available: true
  },
  {
    id: 3,
    name: "Pedro Santos",
    role: "Especialista em Barba",
    experience: "4 anos",
    image: "https://picsum.photos/300/300?grayscale&random=103",
    available: false
  }
];

export const GALLERY_IMAGES = [
  "https://lh3.googleusercontent.com/p/AF1QipPqKN7tQYj1xEZ8bBLaSiJo9Jy7qfUwpg0PUygv=w800",
  "https://lh3.googleusercontent.com/p/AF1QipO1R9LaHplS4LNn2ttxvXbQt9PpTY0n46oT6PDU=w800",
  "https://lh3.googleusercontent.com/p/AF1QipNibm9WgJ5cB3O80CMV4n1QjBp-NAc3TLpWAeWd=w800",
  "https://lh3.googleusercontent.com/p/AF1QipPEYkSpN2oW8RJkbiDxJ_Im2M1c-BMAGb0fZejz=w800",
  "https://lh3.googleusercontent.com/p/AF1QipMfz7kAuDWbdlFaWJzWKY86TRTIApHRXtfwut5g=w800",
  "https://lh3.googleusercontent.com/p/AF1QipNgJBZO2-KtwUOOhO0re0OSo4XzCp4lbsuBYlZ_=w800",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqDEkMeh0ZCbc4nwqBGeQhmdZM6s9OMlXWO0HICWOsoxZCRZ93-hnT__Nml9stLXEj7kE0NynBlBgkuK9khj9IuJR80-LYSuygOMTmJidkgwOAYOTG_0ELl6Bdi_PqfkzX9kz9T=w800",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepAc_RKWQ5EbuSs9MfgTYpuYU_mHYDONbwite1R18QOPWSlD5h-UBspCGrcamBxJmZZKNVbtUVALnfgo9DGJUgp-fW4OioDtOM4FiPXp5grxJvCHcLxt7KsorTYam9DZDNM2KLScA=w800",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq260-cwfBF8nRrVLqzBokWmYjAbu49PBZAsPX_SeKG15OkqRt6-dBmPT-OIq9u7B9WIqLsKQjsSo-AGyUgEf8aYiLtIHV3j8MLrqIjAu7XWjAh7kN_AVs0iunxJaKPlKQd_x0=w800",
  "https://lh3.googleusercontent.com/p/AF1QipN5_z2qFWIaJPK3zmHzysAaE2MLEGB6E2Laxg2X=w800",
  "https://lh3.googleusercontent.com/p/AF1QipOevPWezY9DnijJ1y2MaB9pjsoj2xONp30f4Yc3=w800",
  "https://lh3.googleusercontent.com/p/AF1QipP4hTJK-VNl2ypZzL9T3pyf9-I04ZJ0vbTT7i5v=w800",
  "https://lh3.googleusercontent.com/p/AF1QipORv31fHuhvF5yGEQbiuWOLhNX9JZLO21wOxjZX=w800",
  "https://lh3.googleusercontent.com/p/AF1QipNWIVzh-3KO6e2nk7L_hhKdoVPDjdbJotHgUoWN=w800",
  "https://lh3.googleusercontent.com/p/AF1QipM2U5FBUxVRH9-B2mCOcRZ-rKZxzwij0-ECiAcA=w800",
  "https://lh3.googleusercontent.com/p/AF1QipMXrnkxI9fD5eFL6lzqgg4faxpnULCpgmOuf5oG=w800",
  "https://lh3.googleusercontent.com/p/AF1QipP6IJHinkD0nvcLbADDYy-35DTG_C5ijDDZwTh4=w800",
  "https://lh3.googleusercontent.com/p/AF1QipMbjoQr_0u0xqrGQBrpGeEqJLizWItADmYrfyrw=w800",
  "https://lh3.googleusercontent.com/p/AF1QipPz40VpPbqh7JB1hOTFLB1kKpUWZicf3Ref30tU=w800",
  "https://lh3.googleusercontent.com/p/AF1QipNKh3a0saXymJaGPwyxGFQ5DW73QsLnWSmB-Ihs=w800",
  "https://lh3.googleusercontent.com/p/AF1QipPVrEKIwI9Dz5NieI6ZousDC30BM5fzezZs3JvK=w800",
  "https://lh3.googleusercontent.com/p/AF1QipNspt09ICDx1lJ-n2qt9a-9u2-vayllH8NL91_f=w800",
  "https://lh3.googleusercontent.com/p/AF1QipMVrjWKoWFjBvJKXKtJ4kZClQfg_UXukapv_vIj=w800",
  "https://lh3.googleusercontent.com/p/AF1QipPJxj5f9-o8HhRXFo_5ngmQwJ5eEAhDnmUIeGxF=w800",
  "https://lh3.googleusercontent.com/p/AF1QipP9mePaSxD3XmCeYp5ymT1VTvh65ZT1uNoVOlqR=w800",
  "https://lh3.googleusercontent.com/p/AF1QipPotyTCaY38l0oPFlr1PZk26ToxQCclbSFOeptV=w800"
];