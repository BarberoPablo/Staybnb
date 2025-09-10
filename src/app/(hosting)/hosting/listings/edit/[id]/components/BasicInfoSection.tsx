"use client";

import { errorClass, inputClass, labelClass } from "@/lib/styles";
import { EditListing, privacyTypes, propertyTypes } from "@/lib/types/listing";
import { useFormContext } from "react-hook-form";
import { FaInfoCircle } from "react-icons/fa";

export default function BasicInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EditListing>();

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaInfoCircle className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Basic Information
      </h3>

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input {...register("title", { required: "Title is required" })} type="text" className={inputClass} placeholder="Enter listing title" />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Describe your property"
        />
        {errors.description && <p className={errorClass}>{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Night Price */}
        <div>
          <label className={labelClass}>Night Price ($) *</label>
          <input
            {...register("nightPrice", {
              required: "Night price is required",
              min: { value: 0, message: "Price must be positive" },
              valueAsNumber: true,
            })}
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            placeholder="0.00"
          />
          {errors.nightPrice && <p className={errorClass}>{errors.nightPrice.message}</p>}
        </div>

        {/* Property Type */}
        <div>
          <label className={labelClass}>Property Type *</label>
          <select {...register("propertyType", { required: "Property type is required" })} className={inputClass}>
            {propertyTypes.map((propertyType) => (
              <option key={propertyType} value={propertyType}>
                {propertyType}
              </option>
            ))}
          </select>
          {errors.propertyType && <p className={errorClass}>{errors.propertyType.message}</p>}
        </div>

        {/* Privacy Type */}
        <div>
          <label className={labelClass}>Privacy Type *</label>
          <select {...register("privacyType", { required: "Privacy type is required" })} className={inputClass}>
            {privacyTypes.map((privacyType) => (
              <option key={privacyType} value={privacyType}>
                {privacyType}
              </option>
            ))}
          </select>
          {errors.privacyType && <p className={errorClass}>{errors.privacyType.message}</p>}
        </div>

        {/* Min Cancel Days */}
        <div>
          <label className={labelClass}>Minimum Cancel Days</label>
          <input
            {...register("minCancelDays", {
              min: { value: 0, message: "Must be 0 or greater" },
              valueAsNumber: true,
            })}
            type="number"
            min="0"
            className={inputClass}
            placeholder="3"
          />
          {errors.minCancelDays && <p className={errorClass}>{errors.minCancelDays.message}</p>}
        </div>

        {/* Check-in Time */}
        <div>
          <label className={labelClass}>Check-in Time</label>
          <input {...register("checkInTime")} type="time" className={inputClass} />
        </div>

        {/* Check-out Time */}
        <div>
          <label className={labelClass}>Check-out Time</label>
          <input {...register("checkOutTime")} type="time" className={inputClass} />
        </div>
      </div>
    </div>
  );
}
