"use client";

import { EditListing } from "@/lib/types/listing";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash, FaPercent } from "react-icons/fa";
import { inputClass, labelClass, errorClass } from "@/lib/styles";

export default function PromotionsSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EditListing>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "promotions",
  });

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaPercent className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Promotions
      </h3>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Min Nights */}
              <div>
                <label className={labelClass}>Min Nights</label>
                <input
                  {...register(`promotions.${index}.minNights`, {
                    required: "Minimum nights is required",
                    min: { value: 1, message: "Must be at least 1" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={1}
                  className={inputClass}
                />
                {errors.promotions?.[index]?.minNights && <p className={errorClass}>{errors.promotions[index]?.minNights?.message}</p>}
              </div>

              {/* Discount % */}
              <div>
                <label className={labelClass}>Discount %</label>
                <input
                  {...register(`promotions.${index}.discountPercentage`, {
                    required: "Discount percentage is required",
                    min: { value: 0, message: "Must be 0 or greater" },
                    max: { value: 100, message: "Must be 100 or less" },
                    valueAsNumber: true,
                  })}
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                />
                {errors.promotions?.[index]?.discountPercentage && <p className={errorClass}>{errors.promotions[index]?.discountPercentage?.message}</p>}
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="w-12 h-12.5 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center hover:cursor-pointer"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className={labelClass}>Description</label>
              <input {...register(`promotions.${index}.description`)} type="text" placeholder="Promotion description" className={inputClass} />
            </div>
          </div>
        ))}

        {/* Add Promotion Button */}
        <button
          type="button"
          onClick={() => append({ minNights: 1, discountPercentage: 0, description: "" })}
          className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-myGray hover:border-myGreen hover:text-myGreen transition-colors hover:cursor-pointer"
        >
          <FaPlus className="w-4 h-4" />
          Add Promotion
        </button>
      </div>
    </div>
  );
}
