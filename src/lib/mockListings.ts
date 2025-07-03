import { ListingDB } from "./types/listing";

export const mockListings: ListingDB[] = [
  {
    id: 1,
    title: "Bright Apartment in Palermo",
    description: "Spacious and bright apartment located in the heart of Palermo, close to restaurants and parks. Perfect for couples or solo travelers.",
    location: "Miami, USA",
    night_price: 90,
    promotions: [
      {
        min_nights: 3,
        discount_percentage: 10,
        description: "Stay 3 nights or more and get 10% off!",
      },
      {
        min_nights: 7,
        discount_percentage: 20,
        description: "Weekly discount: 20% off for 7+ nights",
      },
    ],
    type: "Apartment",
    host_id: "host-uuid-1",
    created_at: "2025-06-01T12:00:00.000Z",
    images: [
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557841.jpg?isFirstImage=true",
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557831.jpg",
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557840.jpg",
    ],
    structure: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    guest_limits: {
      adults: { min: 1, max: 4 },
      children: { min: 0, max: 3 },
      infant: { min: 0, max: 1 },
      pets: { min: 0, max: 2 },
    },
    score: {
      value: 4.7,
      reviews: [
        { message: "Excellent location and very clean", score: 4.7 },
        { message: "Loved the view from the balcony", score: 4.9 },
        { message: "Cozy and well-equipped", score: 4.5 },
      ],
    },
  },
  {
    id: 2,
    title: "Cozy Guesthouse in Belgrano",
    description: "A small guesthouse with great amenities, ideal for short stays. Safe neighborhood and near the subway.",
    location: "New York, USA",
    night_price: 79,
    promotions: [
      {
        min_nights: 3,
        discount_percentage: 10,
        description: "Stay 3 nights or more and get 10% off!",
      },
      {
        min_nights: 7,
        discount_percentage: 20,
        description: "Weekly discount: 20% off for 7+ nights",
      },
    ],
    type: "Guesthouse",
    host_id: "host-uuid-2",
    created_at: "2025-06-05T09:00:00.000Z",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkZiCreAQ--Kxy5nDXwBouPsugKpWf-Wip5w&s",
      "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/5JRQXDEINNCSNEHHOEGO555X7U.jpg",
    ],
    structure: {
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
    },
    guest_limits: {
      adults: { min: 1, max: 2 },
      children: { min: 0, max: 2 },
      infant: { min: 0, max: 0 },
      pets: { min: 0, max: 0 },
    },
    score: {
      value: 3.9,
      reviews: [
        { message: "Very good value for money", score: 4 },
        { message: "Comfortable but a bit noisy", score: 3.8 },
      ],
    },
  },
  {
    id: 3,
    title: "Elegant Condo in La Matanza",
    description: "Elegant condo with modern design and comfortable furniture. Close to shopping malls and public transportation.",
    location: "Illinois, USA",
    night_price: 85,
    promotions: [
      {
        min_nights: 3,
        discount_percentage: 10,
        description: "Stay 3 nights or more and get 10% off!",
      },
      {
        min_nights: 7,
        discount_percentage: 20,
        description: "Weekly discount: 20% off for 7+ nights",
      },
    ],
    type: "Condo",
    host_id: "host-uuid-3",
    created_at: "2025-06-10T16:30:00.000Z",
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/498942056.jpg?k=c9f412b0820cd5f1a01bf9d5c8cc30bed8145abb538aea91243510b956c6a023&o=&hp=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_eTkduT8pI9M-7w2_J3xYLKdVdFNSj25aJA&s",
    ],
    structure: {
      guests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
    },
    guest_limits: {
      adults: { min: 1, max: 3 },
      children: { min: 0, max: 2 },
      infant: { min: 0, max: 1 },
      pets: { min: 0, max: 2 },
    },
    score: {
      value: 4.2,
      reviews: [
        { message: "Spacious and modern", score: 4.4 },
        { message: "Good service and amenities", score: 4 },
        { message: "Would book again", score: 4.4 },
      ],
    },
  },
];
