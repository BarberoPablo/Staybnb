import { Promotion } from "@/lib/types/listing";
import { twoDecimals } from "@/lib/utils";

export default function ListingPrice({
  nights,
  nightPrice,
  discountPercentage = 0,
  promotions,
}: {
  nights: number;
  nightPrice: number;
  discountPercentage?: number;
  promotions?: Promotion[]; // ahora opcional
}) {
  const discount = discountPercentage ? twoDecimals((discountPercentage / 100) * nights * nightPrice) : 0;
  const total = twoDecimals(nights * nightPrice - discount);

  // Si no hay promociones, no mostramos promos aplicadas ni futuras
  const appliedPromo = promotions?.find((promo) => promo.discountPercentage === discountPercentage);
  const futurePromos = promotions ? promotions.filter((promo) => promo.minNights > nights).sort((a, b) => a.minNights - b.minNights) : [];

  return (
    <div className="text-sm space-y-2">
      <p>
        {nights} night{nights > 1 ? "s" : ""} x ${nightPrice} = <b>${twoDecimals(nights * nightPrice)}</b>
      </p>

      {discount !== 0 && discountPercentage !== 0 && appliedPromo && (
        <p className="text-green-600 font-semibold">
          {appliedPromo.discountPercentage}% discount applied: -${discount} ({appliedPromo.description})
        </p>
      )}

      {discount !== 0 && discountPercentage === 0 && <p className="text-green-600 font-semibold">Flat discount applied: -${discount}</p>}

      <p className="font-bold mt-2">Total: ${total}</p>

      {futurePromos.length > 0 && (
        <div className="mt-4 text-blue-600">
          <p className="font-semibold">Promotions you can unlock by staying more nights:</p>
          <ul className="list-disc list-inside">
            {futurePromos.map((promo) => (
              <li key={promo.minNights}>
                {promo.description} (from {promo.minNights} nights)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* export default function ListingPrice({
  nights,
  nightPrice,
  discountPercentage = 0,
  promotions,
}: {
  nights: number;
  nightPrice: number;
  discountPercentage?: number;
  promotions: Promotion[];
}) {
  const discount = discountPercentage ? twoDecimals((discountPercentage / 100) * nights * nightPrice) : 0;
  const total = twoDecimals(nights * nightPrice - discount);

  // Applied promotion
  const appliedPromo = promotions.find((promo) => promo.discountPercentage === discountPercentage);

  // Next promotions
  const futurePromos = promotions.filter((promo) => promo.minNights > nights).sort((a, b) => a.minNights - b.minNights);

  return (
    <div className="text-sm space-y-2">
      <p>
        {nights} night{nights > 1 ? "s" : ""} x ${nightPrice} = <b>${twoDecimals(nights * nightPrice)}</b>
      </p>

      {discount !== 0 && discountPercentage !== 0 && appliedPromo && (
        <p className="text-green-600 font-semibold">
          {appliedPromo.discountPercentage}% discount applied: -${discount} ({appliedPromo.description})
        </p>
      )}

      {discount !== 0 && discountPercentage === 0 && <p className="text-green-600 font-semibold">Flat discount applied: -${discount}</p>}

      <p className="font-bold mt-2">Total: ${total}</p>

      {futurePromos.length > 0 && (
        <div className="mt-4 text-blue-600">
          <p className="font-semibold">Promotions you can unlock by staying more nights:</p>
          <ul className="list-disc list-inside">
            {futurePromos.map((promo) => (
              <li key={promo.minNights}>
                {promo.description} (from {promo.minNights} nights)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} */
