"use client";

import ListingPrice from "@/components/ListingPrice";
import ReservationDate from "@/components/ReservationDate";
import { ResumedReservationWithListing } from "@/lib/types/reservation";
import Image from "next/image";
import { useState } from "react";
import { LuCalendarX2, LuReceiptText } from "react-icons/lu";
import { MdOutlineMessage } from "react-icons/md";
import { CancelReservationDialog } from "./CancelReservationDialog";

export default function ListingReservation({ reservation }: { reservation: ResumedReservationWithListing }) {
  const [openCancelResevationDialog, setOpenCancelResevationDialog] = useState(false);

  return (
    <div className="flex flex-col p-4">
      <div className="flex align-center justify-around">
        <div className="flex gap-2">
          <div className="flex flex-col">
            <h2>{reservation.listing.title}</h2>
            <div className="w-80 h-45 relative">
              <Image src={reservation.listing.images[0]} alt="listing main image" priority fill className="object-cover" sizes="100%" />
            </div>
          </div>
          <div className="flex flex-col pt-5">
            <h3>{reservation.listing.location.city}</h3>
            <h3>{reservation.listing.privacyType}</h3>
            <ReservationDate startDate={reservation.startDate} endDate={reservation.endDate} timezone={reservation.listing.location.timezone} />
            <ListingPrice nightPrice={reservation.nightPrice} nights={reservation.totalNights} discountPercentage={reservation.discountPercentage} />
          </div>
        </div>

        <div className="flex flex-col pt-5 gap-2">
          <button className="basic-button text-red-900 bg-red-400 hover:bg-red-500" onClick={() => setOpenCancelResevationDialog(true)}>
            <LuCalendarX2 className="w-5 h-5" />
            <h3 className="ml-2">Cancel Reservation</h3>
          </button>
          <button className="basic-button text-[#13422d] bg-myGreen hover:bg-myGreenDark">
            <LuReceiptText className="w-5 h-5" />
            <h3 className="ml-2">See receipt</h3>
          </button>
          <button className="basic-button text-[#13422d] bg-myGreen hover:bg-myGreenDark">
            <MdOutlineMessage className="w-5 h-5" />
            <h3 className="ml-2">Chat with host</h3>
          </button>
        </div>
      </div>
      <CancelReservationDialog reservationId={reservation.id} isOpen={openCancelResevationDialog} setIsOpen={setOpenCancelResevationDialog} />
    </div>
  );
}
