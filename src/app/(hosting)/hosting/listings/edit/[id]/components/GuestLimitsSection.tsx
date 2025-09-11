"use client";

import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { guests } from "@/lib/types";
import { EditListing } from "@/lib/types/listing";
import { useFormContext } from "react-hook-form";
import { FaUsers } from "react-icons/fa";

export default function GuestLimitsSection() {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext<EditListing>();

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaUsers className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Guest Limits
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guests.map((guestType) => (
          <div key={guestType} className="space-y-2">
            <label className={`${labelClass} capitalize`}>{guestType}</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className={labelClass + " text-xs"}>Min</label>
                <input
                  {...register(`guestLimits.${guestType}.min`, {
                    valueAsNumber: true,
                    onChange: () => {
                      // trigger validation for max when min changes
                      trigger(`guestLimits.${guestType}.max`);
                    },
                  })}
                  type="number"
                  min={0}
                  className={inputClass}
                />
                {errors.guestLimits?.[guestType]?.min && <p className={errorClass}>{errors.guestLimits[guestType]?.min?.message}</p>}
              </div>
              <div className="flex-1">
                <label className={labelClass + " text-xs"}>Max</label>
                <input {...register(`guestLimits.${guestType}.max`, { valueAsNumber: true })} type="number" min={0} className={inputClass} />
                {errors.guestLimits?.[guestType]?.max && <p className={errorClass}>{errors.guestLimits[guestType]?.max?.message}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
