"use client";
import { useListingForm } from "@/store/useListingForm";
import { RiDiscountPercentLine } from "react-icons/ri";
import { InputAutoWidth } from "./components/InputAutoWidth";
import { SelectButton } from "./components/SelectButton";
import Title from "./components/Title";

export default function PromotionsStep() {
  const nightPrice = useListingForm((state) => state.nightPrice);
  const setField = useListingForm((state) => state.setField);

  const handlePriceChange = (number: number) => {
    setField("nightPrice", number);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <Title className="flex flex-col gap-2">
        Add discounts
        <p className="text-lg font-medium text-gray-500">Help your place stand out to get booked faster and earn your first reviews.</p>
      </Title>
      <div className="flex flex-col justify-center items-center">
        <InputAutoWidth nightPrice={nightPrice} handleOnChange={handlePriceChange} editable={false} />
      </div>
      <div className="flex flex-col gap-2">
        <PromotionButtons />
      </div>
    </div>
  );
}

const defaultPromotions = [
  {
    id: "defaultPromotion-01",
    minNights: 3,
    discountPercentage: 20,
    title: "20% New listing promotion",
    description: "20% New listing promotion Offer 20% off your first 3 bookings",
  },
  {
    id: "defaultPromotion-04",
    minNights: 28,
    discountPercentage: 15,
    title: "20% Monthly discount",
    description: "20% Monthly discount, For stays of 28 nights or more",
  },
  {
    id: "defaultPromotion-03",
    minNights: 7,
    discountPercentage: 10,
    title: "10% Weekly discount",
    description: "10% Weekly discount, For stays of 7 nights or more",
  },
];

const PromotionButtons = () => {
  const promotions = useListingForm((state) => state.promotions);
  const setField = useListingForm((state) => state.setField);

  const handlePromotions = (minNights: number, discountPercentage: number) => {
    const promotionSelected = promotions.find((promo) => promo.minNights === minNights && promo.discountPercentage === discountPercentage);

    if (promotionSelected) {
      setField(
        "promotions",
        promotions.filter((promo) => !(promo.minNights === minNights && promo.discountPercentage === discountPercentage))
      );
    } else {
      setField("promotions", [...promotions, { minNights, discountPercentage, description: "" }]);
    }
  };

  return defaultPromotions.map((promotion, index) => {
    const selected = promotions.some((promo) => promo.minNights === promotion.minNights && promo.discountPercentage === promotion.discountPercentage);
    return (
      <SelectButton
        key={"promotion-" + index}
        title={promotion.title}
        subtitle={promotion.description}
        icon={
          <div className={`flex items-center justify-center text-4xl ${selected ? "text-foreground" : "text-gray-500"}`}>
            {promotion.discountPercentage}
            <RiDiscountPercentLine className="w-8 h-8" />
          </div>
        }
        selected={selected}
        onClick={() => handlePromotions(promotion.minNights, promotion.discountPercentage)}
      />
    );
  });
};
