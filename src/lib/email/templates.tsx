import React from "react";
import Head from "next/head";

interface ReservationConfirmationEmailProps {
  userName: string;
  listingTitle: string;
  listingAddress: string;
  listingImages: string[];
  startDate: Date;
  endDate: Date;
  totalNights: number;
  guests: Record<string, number>;
  totalPrice: number;
  nightPrice: number;
  discount?: number;
  discountPercentage?: number;
  checkInTime: string;
  checkOutTime: string;
  hostName: string;
  hostAvatarUrl?: string;
  reservationId: string;
}

// Component for email preview (without full HTML document structure)
export function ReservationConfirmationEmailPreview({
  userName,
  listingTitle,
  listingAddress,
  listingImages,
  startDate,
  endDate,
  totalNights,
  guests,
  totalPrice,
  nightPrice,
  discount,
  discountPercentage,
  checkInTime,
  checkOutTime,
  hostName,
  hostAvatarUrl,
  reservationId,
}: ReservationConfirmationEmailProps) {
  console.log({ hostAvatarUrl });
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time || "Flexible";
  };

  const getTotalGuests = (guests: Record<string, number>) => {
    return Object.values(guests).reduce((sum, count) => sum + count, 0);
  };

  const guestBreakdown = Object.entries(guests)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ");

  return (
    <div
      style={{
        fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: "1.6",
        color: "#364153",
        backgroundColor: "#DDF6D2",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #e9ecef" }}>
        <div style={{ backgroundColor: "#7FB069", padding: "40px 30px", textAlign: "center" }}>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
            <span style={{ display: "inline-block", marginRight: "8px", fontSize: "28px" }}>🏠</span>
            Staybnb
          </div>
          <h1 style={{ fontSize: "28px", color: "white", margin: "0", fontWeight: "bold" }}>Reservation Confirmed!</h1>
          <p style={{ color: "white", margin: "8px 0 0 0", fontSize: "16px", opacity: "0.9" }}>
            Hi {userName}, your reservation has been successfully confirmed
          </p>
        </div>

        <div style={{ padding: "40px 30px" }}>
          <div
            style={{
              backgroundColor: "#DDF6D2",
              border: "2px solid #7FB069",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              margin: "30px 0",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#364153", margin: "0" }}>✓ Confirmation #{reservationId}</p>
            <p style={{ fontSize: "14px", color: "#6A6A6A", margin: "8px 0 0 0" }}>Your reservation is ready and confirmed</p>
          </div>

          {/* Listing Images */}
          {listingImages && listingImages.length > 0 && (
            <div style={{ margin: "35px 0" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#364153",
                  marginBottom: "20px",
                  paddingBottom: "10px",
                  borderBottom: "2px solid #DDF6D2",
                }}
              >
                <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>📸</span>
                Your Stay
              </h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                {listingImages.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listingTitle} - Image ${index + 1}`}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #DDF6D2",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ margin: "35px 0" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#364153",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #DDF6D2",
              }}
            >
              <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>🏠</span>
              Your Stay Details
            </h2>
            <div style={{ backgroundColor: "#f8f9fa", padding: "25px", borderRadius: "8px", borderLeft: "4px solid #7FB069" }}>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#364153", marginBottom: "12px", lineHeight: "1.4" }}>{listingTitle}</div>
              <div
                style={{ fontSize: "16px", color: "#6A6A6A", marginBottom: "20px", lineHeight: "1.4", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "14px" }}>📍</span>
                {listingAddress}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        color: "#6A6A6A",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        width: "50%",
                      }}
                    >
                      Check-in
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        color: "#6A6A6A",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        width: "50%",
                      }}
                    >
                      Check-out
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0", fontWeight: "500", fontSize: "16px", color: "#364153" }}>
                      {formatDate(startDate)}
                      <br />
                      <small style={{ color: "#6A6A6A", fontSize: "14px" }}>{formatTime(checkInTime)}</small>
                    </td>
                    <td style={{ padding: "8px 0", fontWeight: "500", fontSize: "16px", color: "#364153" }}>
                      {formatDate(endDate)}
                      <br />
                      <small style={{ color: "#6A6A6A", fontSize: "14px" }}>{formatTime(checkOutTime)}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ margin: "35px 0" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#364153",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #DDF6D2",
              }}
            >
              <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>👥</span>
              Guest Information
            </h2>
            <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #7FB069" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6A6A6A",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  letterSpacing: "0.5px",
                }}
              >
                Total Guests
              </div>
              <div style={{ fontSize: "16px", fontWeight: "500", color: "#364153", lineHeight: "1.4" }}>
                {getTotalGuests(guests)} guests ({guestBreakdown})
              </div>
            </div>
          </div>

          <div style={{ margin: "35px 0" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#364153",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #DDF6D2",
              }}
            >
              <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>💰</span>
              Payment Summary
            </h2>
            <div
              style={{
                background: "linear-gradient(to right, #DDF6D2, rgba(127, 176, 105, 0.1))",
                padding: "25px",
                borderRadius: "12px",
                margin: "25px 0",
                border: "1px solid rgba(127, 176, 105, 0.2)",
              }}
            >
              {/* Selected Nights */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: "#6A6A6A" }}>Selected:</span>
                <span style={{ fontWeight: "bold", fontSize: "16px", color: "#364153" }}>
                  {totalNights} night{totalNights > 1 ? "s" : ""}
                </span>
              </div>

              {/* Price per night */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: "#6A6A6A" }}>Price per night:</span>
                <span style={{ fontWeight: "600", color: "#364153" }}>${nightPrice}</span>
              </div>

              {/* Subtotal */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: "#6A6A6A" }}>Subtotal:</span>
                <span style={{ fontWeight: "600", color: "#364153" }}>${(nightPrice * totalNights).toFixed(2)}</span>
              </div>

              {/* Discount */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ color: "#6A6A6A" }}>Discount:</span>
                {discount && discount > 0 ? (
                  <span style={{ fontWeight: "600", color: "#7FB069" }}>
                    -${discount.toFixed(2)} ({discountPercentage}% off)
                  </span>
                ) : (
                  <span style={{ fontWeight: "600", color: "#364153" }}>-</span>
                )}
              </div>

              {/* Total */}
              <div
                style={{
                  borderTop: "2px solid rgba(127, 176, 105, 0.2)",
                  paddingTop: "12px",
                  marginTop: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", color: "#364153" }}>Total:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {discount && discount > 0 && (
                      <span
                        style={{
                          color: "#6A6A6A",
                          fontSize: "16px",
                          fontWeight: "500",
                          textDecoration: "line-through",
                          textDecorationThickness: "2px",
                          textDecorationColor: "#6A6A6A",
                        }}
                      >
                        ${(nightPrice * totalNights).toFixed(2)}
                      </span>
                    )}
                    <span
                      style={{
                        color: "#364153",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#E0CFFA",
              padding: "25px",
              borderRadius: "8px",
              textAlign: "center",
              margin: "25px 0",
              border: "1px solid #E0CFFA",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#7FB069",
                borderRadius: "50%",
                lineHeight: "60px",
                textAlign: "center",
                margin: "0 auto 15px",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                backgroundImage: hostAvatarUrl ? `url(${hostAvatarUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {!hostAvatarUrl && hostName.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: "0 0 8px 0", color: "#364153", fontSize: "18px" }}>Your Host</h3>
            <p style={{ margin: "0", color: "#6A6A6A", fontSize: "16px" }}>{hostName}</p>
            <p style={{ margin: "10px 0 0 0", color: "#6A6A6A", fontSize: "14px" }}>
              If you have any questions, don&apos;t hesitate to contact your host directly
            </p>
          </div>

          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <a
              href={
                process.env.NEXT_PUBLIC_NODE_ENV === "development"
                  ? "http://localhost:3000/profile/reservations"
                  : "https://your-domain.com/profile/reservations"
              }
              style={{
                display: "inline-block",
                backgroundColor: "#7FB069",
                color: "white",
                padding: "16px 32px",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                margin: "25px 0",
              }}
            >
              View My Reservations
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Original component for actual email sending (with full HTML document structure)
export function ReservationConfirmationEmail({
  userName,
  listingTitle,
  listingAddress,
  listingImages,
  startDate,
  endDate,
  totalNights,
  guests,
  totalPrice,
  nightPrice,
  discount,
  discountPercentage,
  checkInTime,
  checkOutTime,
  hostName,
  hostAvatarUrl,
  reservationId,
}: ReservationConfirmationEmailProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time || "Flexible";
  };

  const getTotalGuests = (guests: Record<string, number>) => {
    return Object.values(guests).reduce((sum, count) => sum + count, 0);
  };

  const guestBreakdown = Object.entries(guests)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => `${count} ${type}${count > 1 ? "s" : ""}`)
    .join(", ");

  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reservation Confirmation - Staybnb</title>
      </Head>
      <body>
        <div
          style={{
            fontFamily: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            lineHeight: "1.6",
            color: "#364153",
            backgroundColor: "#DDF6D2",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", border: "1px solid #e9ecef" }}>
            <div style={{ backgroundColor: "#7FB069", padding: "40px 30px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
                <span style={{ display: "inline-block", marginRight: "8px", fontSize: "28px" }}>🏠</span>
                Staybnb
              </div>
              <h1 style={{ fontSize: "28px", color: "white", margin: "0", fontWeight: "bold" }}>Reservation Confirmed!</h1>
              <p style={{ color: "white", margin: "8px 0 0 0", fontSize: "16px", opacity: "0.9" }}>
                Hi {userName}, your reservation has been successfully confirmed
              </p>
            </div>

            <div style={{ padding: "40px 30px" }}>
              <div
                style={{
                  backgroundColor: "#DDF6D2",
                  border: "2px solid #7FB069",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                  margin: "30px 0",
                }}
              >
                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#364153", margin: "0" }}>✓ Confirmation #{reservationId}</p>
                <p style={{ fontSize: "14px", color: "#6A6A6A", margin: "8px 0 0 0" }}>Your reservation is ready and confirmed</p>
              </div>

              {/* Listing Images */}
              {listingImages && listingImages.length > 0 && (
                <div style={{ margin: "35px 0" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#364153",
                      marginBottom: "20px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid #DDF6D2",
                    }}
                  >
                    <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>📸</span>
                    Your Stay
                  </h2>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                    {listingImages.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${listingTitle} - Image ${index + 1}`}
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #DDF6D2",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ margin: "35px 0" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#364153",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "2px solid #DDF6D2",
                  }}
                >
                  <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>🏠</span>
                  Your Stay Details
                </h2>
                <div style={{ backgroundColor: "#f8f9fa", padding: "25px", borderRadius: "8px", borderLeft: "4px solid #7FB069" }}>
                  <div style={{ fontSize: "18px", fontWeight: "600", color: "#364153", marginBottom: "12px", lineHeight: "1.4" }}>{listingTitle}</div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#6A6A6A",
                      marginBottom: "20px",
                      lineHeight: "1.4",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>📍</span>
                    {listingAddress}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            padding: "8px 0",
                            color: "#6A6A6A",
                            fontSize: "12px",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            letterSpacing: "0.5px",
                            width: "50%",
                          }}
                        >
                          Check-in
                        </td>
                        <td
                          style={{
                            padding: "8px 0",
                            color: "#6A6A6A",
                            fontSize: "12px",
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            letterSpacing: "0.5px",
                            width: "50%",
                          }}
                        >
                          Check-out
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0", fontWeight: "500", fontSize: "16px", color: "#364153" }}>
                          {formatDate(startDate)}
                          <br />
                          <small style={{ color: "#6A6A6A", fontSize: "14px" }}>{formatTime(checkInTime)}</small>
                        </td>
                        <td style={{ padding: "8px 0", fontWeight: "500", fontSize: "16px", color: "#364153" }}>
                          {formatDate(endDate)}
                          <br />
                          <small style={{ color: "#6A6A6A", fontSize: "14px" }}>{formatTime(checkOutTime)}</small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ margin: "35px 0" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#364153",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "2px solid #DDF6D2",
                  }}
                >
                  <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>👥</span>
                  Guest Information
                </h2>
                <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #7FB069" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6A6A6A",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Total Guests
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "500", color: "#364153", lineHeight: "1.4" }}>
                    {getTotalGuests(guests)} guests ({guestBreakdown})
                  </div>
                </div>
              </div>

              <div style={{ margin: "35px 0" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#364153",
                    marginBottom: "20px",
                    paddingBottom: "10px",
                    borderBottom: "2px solid #DDF6D2",
                  }}
                >
                  <span style={{ marginRight: "12px", color: "#7FB069", fontSize: "24px" }}>💰</span>
                  Payment Summary
                </h2>
                <div
                  style={{
                    backgroundColor: "#DDF6D2",
                    padding: "25px",
                    borderRadius: "12px",
                    margin: "25px 0",
                    border: "1px solid rgba(127, 176, 105, 0.2)",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {/* Selected Nights */}
                      <tr>
                        <td style={{ padding: "8px 0", color: "#6A6A6A" }}>Selected:</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "bold", fontSize: "16px", color: "#364153" }}>
                          {totalNights} night{totalNights > 1 ? "s" : ""}
                        </td>
                      </tr>

                      {/* Price per night */}
                      <tr>
                        <td style={{ padding: "8px 0", color: "#6A6A6A" }}>Price per night:</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600", color: "#364153" }}>${nightPrice}</td>
                      </tr>

                      {/* Subtotal */}
                      <tr>
                        <td style={{ padding: "8px 0", color: "#6A6A6A" }}>Subtotal:</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600", color: "#364153" }}>
                          ${(nightPrice * totalNights).toFixed(2)}
                        </td>
                      </tr>

                      {/* Discount */}
                      <tr>
                        <td style={{ padding: "8px 0", color: "#6A6A6A" }}>Discount:</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "600", color: "#7FB069" }}>
                          {discount && discount > 0 ? (
                            <>
                              -${discount.toFixed(2)} ({discountPercentage}% off)
                            </>
                          ) : (
                            <>-</>
                          )}
                        </td>
                      </tr>

                      {/* Total */}
                      <tr>
                        <td style={{ padding: "12px 0 8px 0", borderTop: "2px solid rgba(127, 176, 105, 0.2)", fontWeight: "600", color: "#364153" }}>
                          Total:
                        </td>
                        <td style={{ padding: "12px 0 8px 0", borderTop: "2px solid rgba(127, 176, 105, 0.2)", textAlign: "right" }}>
                          {discount && discount > 0 && (
                            <span
                              style={{
                                color: "#6A6A6A",
                                fontSize: "16px",
                                fontWeight: "500",
                                textDecoration: "line-through",
                                marginRight: "8px",
                              }}
                            >
                              ${(nightPrice * totalNights).toFixed(2)}
                            </span>
                          )}
                          <span
                            style={{
                              color: "#364153",
                              fontSize: "20px",
                              fontWeight: "bold",
                            }}
                          >
                            ${totalPrice.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#E0CFFA",
                  padding: "25px",
                  borderRadius: "8px",
                  textAlign: "center",
                  margin: "25px 0",
                  border: "1px solid #E0CFFA",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      margin: "0 auto",
                      border: "2px solid #7FB069",
                      backgroundImage: hostAvatarUrl ? `url(${hostAvatarUrl})` : "none",
                      backgroundColor: hostAvatarUrl ? "transparent" : "#7FB069",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      lineHeight: "60px",
                      textAlign: "center",
                      color: "white",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {!hostAvatarUrl && hostName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 style={{ margin: "0 0 8px 0", color: "#364153", fontSize: "18px" }}>Your Host</h3>
                <p style={{ margin: "0", color: "#6A6A6A", fontSize: "16px" }}>{hostName}</p>
                <p style={{ margin: "10px 0 0 0", color: "#6A6A6A", fontSize: "14px" }}>
                  If you have any questions, don&apos;t hesitate to contact your host directly
                </p>
              </div>

              <div style={{ textAlign: "center", margin: "30px 0" }}>
                <a
                  href={
                    process.env.NEXT_PUBLIC_NODE_ENV === "development"
                      ? "http://localhost:3000/profile/reservations"
                      : "https://your-domain.com/profile/reservations"
                  }
                  style={{
                    display: "inline-block",
                    backgroundColor: "#7FB069",
                    color: "white",
                    padding: "16px 32px",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    margin: "25px 0",
                  }}
                >
                  View My Reservations
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
