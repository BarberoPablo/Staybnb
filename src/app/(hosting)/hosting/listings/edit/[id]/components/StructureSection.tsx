"use client";

import { useFormContext } from "react-hook-form";
import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { EditListing } from "@/lib/types/listing";
import { FaBuilding } from "react-icons/fa";

export default function StructureSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditListing>();

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaBuilding className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Property Structure
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Guests</label>
          <input {...register("structure.guests", { valueAsNumber: true })} type="number" min={1} className={inputClass} />
          {errors.structure?.guests && <p className={errorClass}>{errors.structure.guests.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Bedrooms</label>
          <input {...register("structure.bedrooms", { valueAsNumber: true })} type="number" min={1} className={inputClass} />
          {errors.structure?.bedrooms && <p className={errorClass}>{errors.structure.bedrooms.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Beds</label>
          <input {...register("structure.beds", { valueAsNumber: true })} type="number" min={1} className={inputClass} />
          {errors.structure?.beds && <p className={errorClass}>{errors.structure.beds.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Bathrooms</label>
          <input {...register("structure.bathrooms", { valueAsNumber: true })} type="number" min={1} className={inputClass} />
          {errors.structure?.bathrooms && <p className={errorClass}>{errors.structure.bathrooms.message}</p>}
        </div>
      </div>
    </div>
  );
}
