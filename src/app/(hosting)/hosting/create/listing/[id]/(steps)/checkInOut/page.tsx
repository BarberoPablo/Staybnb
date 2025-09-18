"use client";

import { useFormContext } from "react-hook-form";
import { CreateListingForm } from "@/lib/schemas/createListingSchema";
import { FaClock, FaCalendarTimes } from "react-icons/fa";

export default function CheckInOutPage() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateListingForm>();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set check-in and check-out times</h1>
        <p className="text-gray-600">Choose the times when guests can check in and must check out.</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            <FaClock className="inline w-5 h-5 mr-2" />
            Check-in time
          </label>
          <p className="text-sm text-gray-600 mb-4">Guests can check in from this time onwards</p>
          <input
            type="time"
            {...register("checkInTime")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.checkInTime && <p className="mt-2 text-sm text-red-600">{errors.checkInTime.message}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            <FaClock className="inline w-5 h-5 mr-2" />
            Check-out time
          </label>
          <p className="text-sm text-gray-600 mb-4">Guests must check out by this time</p>
          <input
            type="time"
            {...register("checkOutTime")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.checkOutTime && <p className="mt-2 text-sm text-red-600">{errors.checkOutTime.message}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            <FaCalendarTimes className="inline w-5 h-5 mr-2" />
            Minimum cancellation notice
          </label>
          <p className="text-sm text-gray-600 mb-4">How many days in advance guests must cancel to get a full refund</p>
          <input
            type="number"
            min="0"
            {...register("minCancelDays", { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.minCancelDays && <p className="mt-2 text-sm text-red-600">{errors.minCancelDays.message}</p>}
        </div>
      </div>
    </div>
  );
}
