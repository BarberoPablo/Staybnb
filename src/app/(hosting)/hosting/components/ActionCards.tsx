"use client";

import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { FaCalendarAlt, FaChartLine, FaHome, FaPlus } from "react-icons/fa";
import { IconType } from "react-icons/lib";

type ActionCard = {
  title: string;
  description: string;
  icon: IconType;
  onClick: () => void;
  color: string;
  hoverColor: string;
  iconColor: string;
  delay: number;
  disabled?: boolean;
};

export default function ActionCards() {
  const router = useRouter();

  const handleMyListings = () => {
    router.push("/hosting/listings");
  };

  const handleCreateListing = () => {
    router.push("/hosting/create");
  };

  const handleReservations = () => {
    router.push("/hosting/reservations");
  };

  const hostingActions: ActionCard[] = [
    {
      title: "My Listings",
      description: "Manage your properties",
      icon: FaHome,
      onClick: handleMyListings,
      color: "bg-myGreen",
      hoverColor: "hover:bg-myGreenSemiBold",
      iconColor: "text-white",
      delay: 0.1,
    },
    {
      title: "Create Listing",
      description: "Add a new property",
      icon: FaPlus,
      onClick: handleCreateListing,
      color: "bg-myGreenSemiBold",
      hoverColor: "hover:bg-myGreenBold",
      iconColor: "text-white",
      delay: 0.2,
    },
    {
      title: "Reservations",
      description: "View bookings",
      icon: FaCalendarAlt,
      onClick: handleReservations,
      color: "bg-myPurple",
      hoverColor: "hover:bg-purple-400",
      iconColor: "text-myGrayDark",
      delay: 0.3,
    },
    {
      title: "Analytics",
      description: "Performance insights",
      icon: FaChartLine,
      onClick: () => {},
      color: "bg-myGreenExtraLight",
      hoverColor: "hover:bg-myGreenLight",
      iconColor: "text-myGrayDark",
      delay: 0.4,
      disabled: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
    >
      {hostingActions.map((action) => {
        return <ActionCard key={action.title} props={action} />;
      })}
    </motion.div>
  );
}

function ActionCard({ props }: { props: ActionCard }) {
  const IconComponent = props.icon;

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      key={props.title}
      variants={cardVariants}
      custom={props.delay}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={props.onClick}
        disabled={props.disabled}
        className={`
          w-full p-8 rounded-2xl shadow-lg border border-gray-300 
          ${props.color} ${props.hoverColor} 
          transition-all duration-300 ease-out 
          hover:shadow-xl hover:shadow-myGreen/20 
          disabled:opacity-50 disabled:cursor-not-allowed 
          group relative overflow-hidden hover:cursor-pointer
        `}
      >
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300`}>
              <IconComponent className={`w-8 h-8 ${props.iconColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-myGrayDark mb-2">{props.title}</h3>
              <p className="text-sm text-myGray">{props.description}</p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 group-hover:scale-110 transition-transform duration-300" />
      </button>
    </motion.div>
  );
}
