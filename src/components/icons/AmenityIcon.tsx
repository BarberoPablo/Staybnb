import {
  FaWifi,
  FaThermometerHalf,
  FaSnowflake,
  FaParking,
  FaDog,
  FaKey,
  FaCoffee,
  FaTv,
  FaGamepad,
  FaBook,
  FaMusic,
  FaFireExtinguisher,
  FaSwimmingPool,
  FaHotTub,
  FaDumbbell,
  FaTableTennis,
  FaBasketballBall,
  FaBicycle,
  FaWater,
  FaFish,
  FaHiking,
  FaSkiing,
  FaSnowboarding,
  FaSuitcase,
  FaClock,
  FaFirstAid,
  FaLock,
  FaLaptop,
  FaHome,
  FaSeedling,
  FaFire,
} from "react-icons/fa";
import { FaElevator } from "react-icons/fa6";
import { MdKitchen, MdRestaurant, MdBed, MdBathroom, MdSecurity, MdSportsEsports, MdLocalLaundryService, MdAcUnit } from "react-icons/md";

interface AmenityIconProps {
  icon: {
    name: string;
    library: string;
  };
  className?: string;
}

const AmenityIcon = ({ icon, className = "w-5 h-5" }: AmenityIconProps) => {
  // Icon mapping based on the icon name and library
  const getIconComponent = (name: string, library: string) => {
    switch (library) {
      case "fa":
        switch (name) {
          case "FaWifi":
            return FaWifi;
          case "FaThermometerHalf":
            return FaThermometerHalf;
          case "FaSnowflake":
            return FaSnowflake;
          case "FaParking":
            return FaParking;
          case "FaDog":
            return FaDog;
          case "FaKey":
            return FaKey;
          case "FaElevator":
            return FaElevator;
          case "FaCoffee":
            return FaCoffee;
          case "FaTv":
            return FaTv;
          case "FaGamepad":
            return FaGamepad;
          case "FaBook":
            return FaBook;
          case "FaMusic":
            return FaMusic;
          case "FaFireExtinguisher":
            return FaFireExtinguisher;
          case "FaSwimmingPool":
            return FaSwimmingPool;
          case "FaHotTub":
            return FaHotTub;
          case "FaDumbbell":
            return FaDumbbell;
          case "FaTableTennis":
            return FaTableTennis;
          case "FaBasketballBall":
            return FaBasketballBall;
          case "FaBicycle":
            return FaBicycle;
          case "FaWater":
            return FaWater;
          case "FaFish":
            return FaFish;
          case "FaHiking":
            return FaHiking;
          case "FaSkiing":
            return FaSkiing;
          case "FaSnowboarding":
            return FaSnowboarding;
          case "FaSuitcase":
            return FaSuitcase;
          case "FaClock":
            return FaClock;
          case "FaFirstAid":
            return FaFirstAid;
          case "FaLock":
            return FaLock;
          case "FaLaptop":
            return FaLaptop;
          case "FaHome":
            return FaHome;
          case "FaSeedling":
            return FaSeedling;
          case "FaFire":
            return FaFire;
          default:
            return FaSnowflake; // fallback
        }
      case "fa6":
        switch (name) {
          case "FaElevator":
            return FaElevator;
          default:
            return FaSnowflake; // fallback
        }
      case "md":
        switch (name) {
          case "MdKitchen":
            return MdKitchen;
          case "MdRestaurant":
            return MdRestaurant;
          case "MdBed":
            return MdBed;
          case "MdBathroom":
            return MdBathroom;
          case "MdSecurity":
            return MdSecurity;
          case "MdSportsEsports":
            return MdSportsEsports;
          case "MdLocalLaundryService":
            return MdLocalLaundryService;
          case "MdAcUnit":
            return MdAcUnit;
          default:
            return MdKitchen; // fallback
        }
      default:
        return FaSnowflake; // ultimate fallback
    }
  };

  const IconComponent = getIconComponent(icon.name, icon.library);
  return <IconComponent className={className} />;
};

export default AmenityIcon;
