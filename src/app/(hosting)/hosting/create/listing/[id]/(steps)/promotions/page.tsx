"use client";

import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPercent, FaTrashAlt } from "react-icons/fa";
import { RiAddLine } from "react-icons/ri";

type Promotion = {
  minNights: number;
  discountPercentage: number;
  description: string;
};

export default function PromotionsStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  const promotions = watch("promotions") || [];
  const isFirstRender = useRef(true);

  const [newPromotion, setNewPromotion] = useState({
    minNights: 3,
    discountPercentage: 10,
    description: "10% discount for 3 nights or more",
  });

  // Animation variants
  const promotionVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (errors.promotions && errors.promotions.message) {
      toast.error(errors.promotions.message);
    }
  }, [errors.promotions]);

  // Auto-generate description when minNights or discountPercentage changes
  useEffect(() => {
    const description = `${newPromotion.discountPercentage}% discount for ${newPromotion.minNights} nights or more`;
    setNewPromotion((prev) => ({ ...prev, description }));
  }, [newPromotion.minNights, newPromotion.discountPercentage]);

  const handleAddPromotion = () => {
    const exists = promotions.some(
      (promo: Promotion) => promo.minNights === newPromotion.minNights && promo.discountPercentage === newPromotion.discountPercentage
    );

    if (exists) {
      toast.error("A promotion with these settings already exists");
      return;
    }

    if (newPromotion.minNights < 1) {
      toast.error("Minimum nights must be at least 1");
      return;
    }

    if (newPromotion.discountPercentage < 1 || newPromotion.discountPercentage > 100) {
      toast.error("Discount percentage must be between 1% and 100%");
      return;
    }

    setValue("promotions", [{ ...newPromotion }, ...promotions], { shouldValidate: true });
    toast.success("Promotion added successfully");

    setNewPromotion({
      minNights: 3,
      discountPercentage: 10,
      description: "10% discount for 3 nights or more",
    });
  };

  const handleRemovePromotion = (index: number) => {
    const updatedPromotions = promotions.filter((_: Promotion, i: number) => i !== index);
    setValue("promotions", updatedPromotions, { shouldValidate: true });
    toast.success("Promotion removed");
  };

  return (
    <div className="w-full p-2 sm:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mb-8">
        <div className="text-center mt-8 sm:mt-4">
          <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Add discounts</h1>
          <p className="text-lg text-myGray max-w-2xl mx-auto">Create custom promotions to offer discounts for longer stays.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPercent className="w-6 h-6 text-myGreenSemiBold" />
                <h3 className="text-lg font-semibold text-myGrayDark">Promotions & Discounts</h3>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-myGrayDark">Create New Promotion</h4>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-myGrayDark mb-2">Minimum Nights</label>
                    <input
                      type="number"
                      min="1"
                      value={newPromotion.minNights}
                      onChange={(e) => setNewPromotion((prev) => ({ ...prev, minNights: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
                      placeholder="Enter minimum nights"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-myGrayDark mb-2">Discount Percentage</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newPromotion.discountPercentage}
                      onChange={(e) => setNewPromotion((prev) => ({ ...prev, discountPercentage: parseInt(e.target.value) || 1 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
                      placeholder="Enter discount %"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-myGrayDark mb-2">Description</label>
                  <input
                    type="text"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent"
                    placeholder="Enter promotion description"
                  />
                </div>
                <motion.button
                  onClick={handleAddPromotion}
                  className="w-full bg-myGreenSemiBold text-white py-3 px-6 rounded-lg hover:bg-myGreenDark transition-colors duration-200 flex items-center justify-center gap-2 hover:cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div animate={{ rotate: [0, 90, 0] }} transition={{ duration: 0.3 }}>
                    <RiAddLine className="w-5 h-5" />
                  </motion.div>
                  Add Promotion
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {promotions.length > 0 && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-lg font-semibold text-myGrayDark">Your Promotions</h4>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {promotions.map((promotion: Promotion, index: number) => (
                        <motion.div
                          key={`${promotion.minNights}-${promotion.discountPercentage}-${index}`}
                          variants={promotionVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                          }}
                          layout
                        >
                          <div className="w-full flex items-center justify-between p-6 rounded-xl border-2 border-myGreenSemiBold bg-myGreenExtraLight shadow-md">
                            <div className="flex items-center gap-4">
                              <motion.div
                                className="hidden sm:block text-3xl font-bold text-myGreenSemiBold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                              >
                                {promotion.discountPercentage}%
                              </motion.div>
                              <div className="text-left flex-1">
                                <p className="w-full bg-transparent border-none outline-none text-lg font-semibold text-myGrayDark">
                                  {promotion.description}
                                </p>
                                <p className="text-sm text-myGray">For stays of {promotion.minNights} nights or more</p>
                              </div>
                            </div>
                            <motion.button
                              onClick={() => handleRemovePromotion(index)}
                              className="bg-red-500 text-background rounded-lg hover:bg-red-600 transition-colors duration-200 p-2 hover:cursor-pointer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTrashAlt className="w-6 h-6" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
