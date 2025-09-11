"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { FaPlus, FaTrash, FaImages } from "react-icons/fa";
import { inputClass, errorClass } from "@/lib/styles";

export default function ImagesSection() {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-myGrayDark">
        <div className="w-8 h-8 bg-myGreenExtraLight rounded-full flex items-center justify-center">
          <FaImages className="w-4 h-4 text-myGreenSemiBold" />
        </div>
        Images
      </h3>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`images.${index}`, {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Please enter a valid URL",
                },
              })}
              type="url"
              placeholder="https://example.com/image.jpg"
              className={inputClass + " flex-1"}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center hover:cursor-pointer"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        ))}

        {errors.images && (
          <p className={errorClass}>{Array.isArray(errors.images) ? errors.images.find((error) => error)?.message : errors.images?.message}</p>
        )}

        <button
          type="button"
          onClick={() => append("")}
          className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-myGray hover:border-myGreen hover:text-myGreen transition-colors hover:cursor-pointer"
        >
          <FaPlus className="w-4 h-4" />
          Add Image URL
        </button>
      </div>
    </div>
  );
}
