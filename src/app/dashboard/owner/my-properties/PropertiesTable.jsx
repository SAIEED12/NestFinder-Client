"use client";

import React from "react";
import { Table } from "@heroui/react";
import Link from "next/link";

export default function PropertiesTable({ propertiesData }) {
  const properties = propertiesData?.data || [];
  const page = Number(propertiesData?.page) || 1;
  const totalPages = Number(propertiesData?.totalPage) || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full space-y-4">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Owner Properties">
            <Table.Header>
              <Table.Column>Preview</Table.Column>
              <Table.Column isRowHeader>Title</Table.Column>
              <Table.Column>Location</Table.Column>
              <Table.Column>Type</Table.Column>
              <Table.Column>Rent</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>

            <Table.Body
              renderEmptyState={() => (
                <div className="text-center py-12 text-zinc-400 text-sm">
                  No properties discovered in your database listing.
                </div>
              )}
            >
              {properties.map((property) => (
                <Table.Row key={property._id}>
                  {/* Image */}
                  <Table.Cell>
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50">
                      <img
                        src={property.images || "https://i.ibb.co/MkKVxKLm/hero.jpg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://i.ibb.co/MkKVxKLm/hero.jpg"; }}
                      />
                    </div>
                  </Table.Cell>

                  {/* Title */}
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-zinc-100 text-sm line-clamp-1">{property.title}</span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {property.bedrooms} Bed • {property.bathrooms} Bath • {property.size} sqft
                      </span>
                    </div>
                  </Table.Cell>

                  {/* Location */}
                  <Table.Cell className="text-zinc-600 dark:text-zinc-400 text-sm">
                    {property.location}
                  </Table.Cell>

                  {/* Type */}
                  <Table.Cell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {property.propertyType}
                    </span>
                  </Table.Cell>

                  {/* Rent */}
                  <Table.Cell className="font-semibold text-slate-900 dark:text-zinc-100">
                    ${property.rent} <span className="text-[10px] text-zinc-400 font-normal">/{property.rentType}</span>
                  </Table.Cell>

                  {/* Status */}
                  <Table.Cell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      property.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {property.status || "Pending"}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        {/* Pagination in Table.Footer */}
        {totalPages > 1 && (
          <Table.Footer>
            <div className="w-full flex justify-end py-3 px-2 gap-1">
              {page > 1 ? (
                <Link href={`/dashboard/owner/my-properties?page=${page - 1}`}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  Prev
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs font-medium text-zinc-300 dark:text-zinc-600 cursor-not-allowed opacity-50">Prev</span>
              )}

              {pages.map((p) => (
                <Link key={p} href={`/dashboard/owner/my-properties?page=${p}`}
                  className={`min-w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                    p === page
                      ? "bg-[#E05638] text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}>
                  {p}
                </Link>
              ))}

              {page < totalPages ? (
                <Link href={`/dashboard/owner/my-properties?page=${page + 1}`}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  Next
                </Link>
              ) : (
                <span className="px-3 py-1.5 text-xs font-medium text-zinc-300 dark:text-zinc-600 cursor-not-allowed opacity-50">Next</span>
              )}
            </div>
          </Table.Footer>
        )}
      </Table>
    </div>
  );
}