// Icon mappings for amenities
// This file maps amenity names to their specific icons and libraries
// The script will use these mappings to generate the final constants

export const AMENITY_ICON_MAPPINGS: Record<string, { name: string; library: string }> = {
  // Essentials
  WiFi: { name: "FaWifi", library: "fa" },
  Heating: { name: "FaThermometerHalf", library: "fa" },
  "Air conditioning": { name: "FaSnowflake", library: "fa" },
  Parking: { name: "FaParking", library: "fa" },
  Elevator: { name: "FaElevator", library: "fa6" },
  "Free street parking": { name: "FaParking", library: "fa" },
  "Paid parking off premises": { name: "FaParking", library: "fa" },
  "Pets allowed": { name: "FaDog", library: "fa" },
  "Service animals allowed": { name: "FaDog", library: "fa" },
  "Luggage drop-off allowed": { name: "FaSuitcase", library: "fa" },
  "Flexible check-in/check-out": { name: "FaClock", library: "fa" },
  "Self check-in": { name: "FaKey", library: "fa" },
  "Key safe": { name: "FaKey", library: "fa" },

  // Kitchen
  Refrigerator: { name: "MdKitchen", library: "md" },
  Microwave: { name: "MdKitchen", library: "md" },
  Stove: { name: "MdKitchen", library: "md" },
  Oven: { name: "MdKitchen", library: "md" },
  Dishwasher: { name: "MdKitchen", library: "md" },
  "Coffee maker": { name: "FaCoffee", library: "fa" },
  Toaster: { name: "MdKitchen", library: "md" },
  Blender: { name: "MdKitchen", library: "md" },
  Kettle: { name: "MdKitchen", library: "md" },

  // Dining
  "Dining area": { name: "MdRestaurant", library: "md" },
  Breakfast: { name: "MdRestaurant", library: "md" },
  "High chair": { name: "MdRestaurant", library: "md" },

  // Bedroom
  Bedroom: { name: "MdBed", library: "md" },
  Bed: { name: "MdBed", library: "md" },
  Wardrobe: { name: "MdBed", library: "md" },
  Desk: { name: "MdBed", library: "md" },
  Crib: { name: "MdBed", library: "md" },

  // Bathroom
  Bathroom: { name: "MdBathroom", library: "md" },
  Shower: { name: "MdBathroom", library: "md" },
  Bathtub: { name: "MdBathroom", library: "md" },
  "Hair dryer": { name: "MdBathroom", library: "md" },
  "Hot water": { name: "MdBathroom", library: "md" },

  // Entertainment
  TV: { name: "FaTv", library: "fa" },
  Netflix: { name: "FaTv", library: "fa" },
  "Gaming console": { name: "FaGamepad", library: "fa" },
  "Board games": { name: "FaGamepad", library: "fa" },
  Books: { name: "FaBook", library: "fa" },
  Piano: { name: "FaMusic", library: "fa" },
  Guitar: { name: "FaMusic", library: "fa" },

  // Security
  "Fire extinguisher": { name: "FaFireExtinguisher", library: "fa" },
  "Smoke alarm": { name: "MdSecurity", library: "md" },
  "Carbon monoxide alarm": { name: "MdSecurity", library: "md" },
  "First aid kit": { name: "FaFirstAid", library: "fa" },
  "Lock on bedroom door": { name: "FaLock", library: "fa" },

  // Activities
  "Swimming pool": { name: "FaSwimmingPool", library: "fa" },
  "Hot tub": { name: "FaHotTub", library: "fa" },
  Gym: { name: "FaDumbbell", library: "fa" },
  "Tennis court": { name: "FaTableTennis", library: "fa" },
  "Basketball court": { name: "FaBasketballBall", library: "fa" },
  Bicycle: { name: "FaBicycle", library: "fa" },
  Kayak: { name: "FaWater", library: "fa" },
  Fishing: { name: "FaFish", library: "fa" },
  Hiking: { name: "FaHiking", library: "fa" },
  Skiing: { name: "FaSkiing", library: "fa" },
  Snowboarding: { name: "FaSnowboarding", library: "fa" },

  // Laundry
  Washer: { name: "MdLocalLaundryService", library: "md" },
  Dryer: { name: "MdLocalLaundryService", library: "md" },
  Iron: { name: "MdLocalLaundryService", library: "md" },

  // Workspace
  "Dedicated workspace": { name: "FaLaptop", library: "fa" },
  "Wifi speed": { name: "FaWifi", library: "fa" },
  "Standing desk": { name: "FaLaptop", library: "fa" },

  // Outdoor
  Balcony: { name: "FaHome", library: "fa" },
  Garden: { name: "FaSeedling", library: "fa" },
  "BBQ grill": { name: "FaFire", library: "fa" },
  "Fire pit": { name: "FaFire", library: "fa" },
  "Outdoor dining area": { name: "MdRestaurant", library: "md" },
  "Outdoor shower": { name: "MdBathroom", library: "md" },

  // Default fallback for any unmapped amenities
  default: { name: "FaSnowflake", library: "fa" },
};
