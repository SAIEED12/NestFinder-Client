"use client";

import React, { useState } from "react";
import { Button, Modal, Input } from "@heroui/react";
import { Calendar, Shield, Heart, User, Phone, Loader2 } from "lucide-react";

export default function BookingCard({ property = {}, userSession = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUser = userSession?.user;
  const role = currentUser?.role
  const rentPrice = property?.rent || "0";
  const rentInterval = property?.rentType || "Month";
  const propertyTitle = property?.title || "";
  const propertyId = property?._id || "";

  const handleFormSubmission = () => {
    setLoading(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-900/80 rounded-[32px] p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#E05638]/5 rounded-bl-full pointer-events-none" />

        <div className="space-y-1">
          <span className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
            Lease Evaluation Price
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              ${rentPrice}
            </span>
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
              / {rentInterval}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-zinc-100 dark:border-zinc-900/60 pt-5 text-xs font-bold text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2.5">
            <Calendar size={15} className="text-[#E05638]" />
            <span>Immediate Structural Occupancy Available</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Shield size={15} className="text-[#E05638]" />
            <span>NestFinder Double Audited Secure Application</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {role === 'tenant' ? (
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full bg-[#E05638] hover:bg-[#c9492e] text-white font-bold text-md h-12 rounded-xl shadow-xs transition-all active:scale-[0.98]"
            >
              Book Now
            </Button>
          ) : (
            <div className="p-4 bg-slate-50/60 dark:bg-zinc-900/30 border border-slate-200/60 dark:border-zinc-800/60 rounded-xl text-center shadow-2xs">
              <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 leading-relaxed">
                {role === 'owner' || role === 'admin'
                  ? "Only Tenants can book a property!"
                  : "Please authenticate with your tenant account credentials to book this property."}
              </p>
            </div>
          )}

          <Button className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800/80 font-bold text-xs h-12 rounded-xl transition-all active:scale-[0.98] group flex items-center justify-center gap-2">
            <Heart size={16} strokeWidth={2.5} className="text-zinc-400 group-hover:text-[#E05638] transition-colors shrink-0" />
            <span>Add to favourites</span>
          </Button>
        </div>
      </div>

      {/* HeroUI v3 Modal */}
      <Modal state={{ isOpen, setIsOpen }} onOpenChange={(open) => setIsOpen(open)}>
        <Modal.Backdrop>
          <Modal.Container classNames={{ base: "border border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 rounded-[28px] max-w-lg mx-4 shadow-xl" }}>
            <Modal.Dialog>
              {({ close }) => (
                <form action="/api/payment" method="POST" onSubmit={handleFormSubmission}>
                  <input type="hidden" name="price" value={rentPrice} />
                  <input type="hidden" name="title" value={propertyTitle} />
                  <input type="hidden" name="propertyId" value={propertyId} />

                  <Modal.Header className="text-xl font-black text-slate-900 dark:text-white pb-1 tracking-tight px-6 pt-6">
                    <Modal.Heading>Finalize Intent Reservation</Modal.Heading>
                  </Modal.Header>

                  <Modal.Body className="space-y-4 py-4 px-6">
                    <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 leading-relaxed">
                      Provide your leasing parameters below. Confirming this configuration automatically builds a secure financial portal redirect pipeline.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Applicant Name"
                        defaultValue={currentUser?.name || ""}
                        isDisabled
                        variant="bordered"
                        startContent={<User size={14} className="text-zinc-400" />}
                        classNames={{ inputWrapper: "rounded-xl border-zinc-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30" }}
                      />
                      <Input
                        label="Account Email"
                        defaultValue={currentUser?.email || ""}
                        isDisabled
                        variant="bordered"
                        startContent={<User size={14} className="text-zinc-400" />}
                        classNames={{ inputWrapper: "rounded-xl border-zinc-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30" }}
                      />
                    </div>

                    <Input
                      type="date"
                      name="moveInDate"
                      label="Target Move-in Date"
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      classNames={{ inputWrapper: "h-11 rounded-xl border-zinc-200/60 dark:border-zinc-800/80" }}
                    />

                    <Input
                      type="tel"
                      name="contactNumber"
                      label="Contact Phone Line"
                      placeholder="+880 1XXX-XXXXXX"
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={<Phone size={14} className="text-zinc-400 shrink-0 mr-1" />}
                      classNames={{ inputWrapper: "h-11 rounded-xl border-zinc-200/60 dark:border-zinc-800/80" }}
                    />

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                        Additional Request Parameters
                      </label>
                      <textarea
                        name="additionalNotes"
                        placeholder="Mention optional parking parameters, pet certifications, or lease layout specifications..."
                        className="w-full text-xs font-semibold p-3 bg-transparent border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl outline-none focus:border-[#E05638]/50 min-h-[90px] text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 transition-all resize-none"
                      />
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="border-t border-zinc-100 dark:border-zinc-900/60 pt-4 pb-6 px-6 flex gap-3 justify-end">
                    <Button
                      variant="light"
                      onPress={close}
                      isDisabled={loading}
                      className="rounded-xl font-bold text-xs text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={loading}
                      className="bg-[#E05638] text-white font-bold text-xs px-6 rounded-xl shadow-xs flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Generating Gateway...</span>
                        </>
                      ) : (
                        <span>Confirm & Go To Payment</span>
                      )}
                    </Button>
                  </Modal.Footer>
                </form>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}