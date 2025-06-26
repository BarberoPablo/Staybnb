export const mockListings = [
  {
    id: 1,
    title: "Bright Apartment in Palermo",
    description: "Spacious and bright apartment located in the heart of Palermo, close to restaurants and parks. Perfect for couples or solo travelers.",
    location: "Miami, USA",
    price: 90,
    promotions: [
      {
        minNights: 3,
        discountPercentage: 10,
        description: "Stay 3 nights or more and get 10% off!",
      },
      {
        minNights: 7,
        discountPercentage: 20,
        description: "Weekly discount: 20% off for 7+ nights",
      },
    ],
    type: "Apartment",
    host: {
      name: "Carla",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    structure: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    guestLimits: {
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
    images: [
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557841.jpg?isFirstImage=true",
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557831.jpg",
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557840.jpg",
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557828.jpg",
      "https://imgar.zonapropcdn.com/avisos/resize/1/00/56/54/31/64/1200x1200/1983557843.jpg",
    ],
  },
  {
    id: 2,
    title: "Cozy Guesthouse in Belgrano",
    description: "A small guesthouse with great amenities, ideal for short stays. Safe neighborhood and near the subway.",
    location: "New York, USA",
    price: 79,
    type: "Guesthouse",
    host: {
      name: "James",
      avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    structure: {
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
    },
    guestLimits: {
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
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkZiCreAQ--Kxy5nDXwBouPsugKpWf-Wip5w&s",
      "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/5JRQXDEINNCSNEHHOEGO555X7U.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcjCZ5qIZJHKXD4cq7jeSm-BxFZu1xEqB7hg&s",
    ],
  },
  {
    id: 3,
    title: "Elegant Condo in La Matanza",
    description: "Elegant condo with modern design and comfortable furniture. Close to shopping malls and public transportation.",
    location: "Illinois, USA",
    price: 85,
    promotions: [
      {
        minNights: 3,
        discountPercentage: 10,
        description: "Stay 3 nights or more and get 10% off!",
      },
      {
        minNights: 7,
        discountPercentage: 20,
        description: "Weekly discount: 20% off for 7+ nights",
      },
    ],
    type: "Condo",
    host: {
      name: "Emily",
      avatarUrl: "https://randomuser.me/api/portraits/women/48.jpg",
    },
    structure: {
      guests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
    },
    guestLimits: {
      adults: { min: 1, max: 1 },
      children: { min: 0, max: 0 },
      infant: { min: 0, max: 0 },
      pets: { min: 0, max: 0 },
    },
    score: {
      value: 4.2,
      reviews: [
        { message: "Spacious and modern", score: 4.4 },
        { message: "Good service and amenities", score: 4 },
        { message: "Would book again", score: 4.4 },
      ],
    },
    images: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/498942056.jpg?k=c9f412b0820cd5f1a01bf9d5c8cc30bed8145abb538aea91243510b956c6a023&o=&hp=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_eTkduT8pI9M-7w2_J3xYLKdVdFNSj25aJA&s",
      "https://a0.muscache.com/im/pictures/a554d5f6-e719-44d6-a730-bc19dbb967c8.jpg?im_w=720",
    ],
  },
];
